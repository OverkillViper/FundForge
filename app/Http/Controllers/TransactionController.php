<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function create(Request $request): Response
    {
        $accounts = Account::where(
            'user_id',
            auth()->id()
        )->get();

        $categories = Category::where(
            'user_id',
            auth()->id()
        )->get();

        $frequentTransactions = Transaction::query()
            ->where('user_id', auth()->id())
            ->whereIn('type', ['expense', 'income'])
            ->with([
                'account:id,name,currency',
                'category:id,name',
            ])
            ->select([
                'id',
                'account_id',
                'category_id',
                'title',
                'type',
                'amount',
                'note',
                'reference',
            ])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Transactions/Create', [
            'accounts' => $accounts,
            'categories' => $categories,
            'frequentTransactions' => $frequentTransactions,
        ]);
    }

    public function edit(
        Transaction $transaction
    ): Response {
        // Make sure the transaction belongs to the
        // authenticated user.
        abort_unless(
            $transaction->user_id === auth()->id(),
            403
        );

        $accounts = Account::query()
            ->where('user_id', auth()->id())
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $categories = Category::query()
            ->where('user_id', auth()->id())
            ->withCount('transactions')
            ->withSum([
                'transactions as total_expense' => function ($query) {
                    $query->where('type', 'expense');
                },
            ], 'amount')
            ->orderBy('name')
            ->get();

        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
            'accounts' => $accounts,
            'categories' => $categories,
            'breadcrumbLabels' => [
                (string) $transaction->id => $transaction->title,
            ],
        ]);
    }

    /**
     * Display the user's transactions.
     */
    public function index(Request $request): Response
    {
        $transactions = Transaction::query()
            ->where('user_id', auth()->id())
            ->with([
                'account:id,name,currency',
                'category:id,name',

                /*
                 * Used by the transaction page to determine
                 * whether a transaction is referenced by a
                 * DPS payment.
                 */
                'dpsPayment.dps.investment',
            ])
            ->latest('transaction_date')
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Store a new transaction.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'account_id' => [
                'required',
                'integer',
            ],

            'category_id' => [
                'nullable',
                'integer',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'type' => [
                'required',
                'in:income,expense,investment,lending,borrowing',
            ],

            'amount' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'transaction_date' => [
                'required',
                'date',
            ],

            'note' => [
                'nullable',
                'string',
            ],

            'reference' => [
                'nullable',
                'string',
            ],

            'reference' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        DB::transaction(function () use ($validated) {
            /*
             * Make sure the account belongs to the
             * authenticated user.
             */
            $account = Account::query()
                ->where('user_id', auth()->id())
                ->lockForUpdate()
                ->findOrFail(
                    $validated['account_id']
                );

            /*
             * Make sure the category belongs to the
             * authenticated user.
             */
            if (!empty($validated['category_id'])) {
                Category::query()
                    ->where('user_id', auth()->id())
                    ->findOrFail(
                        $validated['category_id']
                    );
            }

            /*
             * Create the transaction.
             */
            Transaction::create([
                ...$validated,
                'user_id' => auth()->id(),
            ]);

            /*
             * Update account balance.
             */
            $account->balance = $this->calculateNewBalance(
                $account->balance,
                $validated['type'],
                $validated['amount']
            );

            $account->save();
        });

        return redirect()
            ->route('transactions.index')
            ->with(
                'success',
                'Transaction created successfully.'
            );
    }

    /**
     * Update an existing transaction.
     */
    public function update(
        Request $request,
        Transaction $transaction
    ): RedirectResponse {
        $this->authorizeTransaction($transaction);

        $validated = $request->validate([
            'account_id' => [
                'required',
                'integer',
            ],

            'category_id' => [
                'nullable',
                'integer',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'type' => [
                'required',
                'in:income,expense,investment,lending,borrowing',
            ],

            'amount' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'transaction_date' => [
                'required',
                'date',
            ],

            'note' => [
                'nullable',
                'string',
            ],

            'reference' => [
                'nullable',
                'string',
            ],

            'reference' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        DB::transaction(function () use (
            $transaction,
            $validated
        ) {
            /*
             * Lock the old account.
             */
            $oldAccount = Account::query()
                ->where('user_id', auth()->id())
                ->lockForUpdate()
                ->findOrFail(
                    $transaction->account_id
                );

            /*
             * Validate the new account.
             */
            $newAccount = Account::query()
                ->where('user_id', auth()->id())
                ->lockForUpdate()
                ->findOrFail(
                    $validated['account_id']
                );

            /*
             * Validate category ownership.
             */
            if (!empty($validated['category_id'])) {
                Category::query()
                    ->where('user_id', auth()->id())
                    ->findOrFail(
                        $validated['category_id']
                    );
            }

            /*
             * First reverse the effect of the old transaction.
             */
            $oldAccount->balance = $this->reverseBalanceEffect(
                $oldAccount->balance,
                $transaction->type,
                $transaction->amount
            );

            $oldAccount->save();

            /*
             * Apply the new transaction effect.
             */
            $newAccount->balance = $this->calculateNewBalance(
                $newAccount->balance,
                $validated['type'],
                $validated['amount']
            );

            $newAccount->save();

            /*
             * Update transaction itself.
             */
            $transaction->update($validated);
        });

        return redirect()
            ->route('transactions.index')
            ->with(
                'success',
                'Transaction updated successfully.'
            );
    }

    /**
     * Delete a transaction.
     */
    public function destroy(
        Transaction $transaction
    ): RedirectResponse {
        $this->authorizeTransaction($transaction);

        /*
         * A transaction referenced by another record must be
         * deleted from that related record instead.
         *
         * For example, a DPS payment owns its transaction.
         */
        if ($transaction->dpsPayment()->exists()) {
            return back()->with(
                'error',
                'This transaction is referenced by an investment record. '
                . 'Please delete the related investment record first.'
            );
        }

        DB::transaction(function () use ($transaction) {
            /*
             * Lock the account before changing its balance.
             */
            $account = Account::query()
                ->where('user_id', auth()->id())
                ->lockForUpdate()
                ->findOrFail(
                    $transaction->account_id
                );

            /*
             * Remove the transaction's financial effect.
             */
            $account->balance = $this->reverseBalanceEffect(
                $account->balance,
                $transaction->type,
                $transaction->amount
            );

            $account->save();

            /*
             * Finally delete the transaction.
             */
            $transaction->delete();
        });

        return redirect()
            ->route('transactions.index')
            ->with(
                'success',
                'Transaction deleted successfully.'
            );
    }

    /**
     * Delete multiple transactions.
     */
    public function bulkDestroy(
        Request $request
    ): RedirectResponse {
        $validated = $request->validate([
            'transaction_ids' => [
                'required',
                'array',
                'min:1',
            ],

            'transaction_ids.*' => [
                'required',
                'integer',
                'exists:transactions,id',
            ],
        ]);

        /*
         * Only work with transactions belonging to the
         * authenticated user.
         */
        $transactions = Transaction::query()
            ->where('user_id', auth()->id())
            ->whereIn(
                'id',
                $validated['transaction_ids']
            )
            ->with('dpsPayment')
            ->get();

        /*
         * Do not delete transactions that are referenced
         * by another record.
         */
        $referencedTransactions = $transactions->filter(
            fn (Transaction $transaction) =>
                $transaction->dpsPayment !== null
        );

        if ($referencedTransactions->isNotEmpty()) {
            return back()->with(
                'error',
                'Some selected transactions are referenced by '
                . 'investment records and cannot be deleted directly.'
            );
        }

        DB::transaction(function () use ($transactions) {
            /*
             * Group transactions by account so that each
             * affected account is locked only once.
             */
            $transactionsByAccount = $transactions
                ->groupBy('account_id');

            foreach (
                $transactionsByAccount
                as $accountId => $accountTransactions
            ) {
                $account = Account::query()
                    ->where('user_id', auth()->id())
                    ->lockForUpdate()
                    ->findOrFail($accountId);

                /*
                 * Reverse every transaction's financial effect.
                 */
                foreach (
                    $accountTransactions
                    as $transaction
                ) {
                    $account->balance =
                        $this->reverseBalanceEffect(
                            $account->balance,
                            $transaction->type,
                            $transaction->amount
                        );
                }

                $account->save();
            }

            /*
             * Delete the transactions after all account
             * balances have been updated.
             */
            Transaction::query()
                ->where('user_id', auth()->id())
                ->whereIn(
                    'id',
                    $transactions->pluck('id')
                )
                ->delete();
        });

        return back()->with(
            'success',
            'Selected transactions deleted successfully.'
        );
    }

    /**
     * Calculate the account balance after adding a transaction.
     */
    private function calculateNewBalance(
        $currentBalance,
        string $type,
        $amount
    ) {
        return match ($type) {
            'income',
            'borrowing' => bcadd(
                (string) $currentBalance,
                (string) $amount,
                2
            ),

            'expense',
            'investment',
            'lending' => bcsub(
                (string) $currentBalance,
                (string) $amount,
                2
            ),

            default => $currentBalance,
        };
    }

    /**
     * Reverse the financial effect of an existing transaction.
     */
    private function reverseBalanceEffect(
        $currentBalance,
        string $type,
        $amount
    ) {
        return match ($type) {
            'income',
            'borrowing' => bcsub(
                (string) $currentBalance,
                (string) $amount,
                2
            ),

            'expense',
            'investment',
            'lending' => bcadd(
                (string) $currentBalance,
                (string) $amount,
                2
            ),

            default => $currentBalance,
        };
    }

    /**
     * Make sure the transaction belongs to the
     * authenticated user.
     */
    private function authorizeTransaction(
        Transaction $transaction
    ): void {
        abort_unless(
            $transaction->user_id === auth()->id(),
            403
        );
    }
}