<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Support\Money;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Transfer;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function create(Request $request): Response
    {
        $userId = auth()->id();

        $accounts = Account::query()
            ->where('user_id', $userId)
            ->withCount(['transactions as usage_count' => fn ($query) => $query->whereIn('type', ['expense', 'income'])])
            ->orderByDesc('usage_count')
            ->orderBy('name')
            ->get();

        $categories = Category::where('user_id', $userId)->get();

        $rankedTransactions = Transaction::query()
            ->where('user_id', $userId)
            ->whereIn('type', ['expense', 'income'])
            ->selectRaw('
                id,
                account_id,
                category_id,
                title,
                type,
                amount,
                note,
                reference,
                created_at,
                COUNT(*) OVER (
                    PARTITION BY title, type, account_id, category_id
                ) AS usage_count,
                ROW_NUMBER() OVER (
                    PARTITION BY title, type, account_id, category_id
                    ORDER BY created_at DESC, id DESC
                ) AS row_number
            ');

        $frequentTransactions = Transaction::query()
            ->fromSub($rankedTransactions, 'transactions')
            ->where('row_number', 1)
            ->with([
                'account:id,name,currency',
                'category:id,name',
            ])
            ->orderByDesc('usage_count')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get([
                'id',
                'account_id',
                'category_id',
                'title',
                'type',
                'amount',
                'note',
                'reference',
                'created_at',
            ]);

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

        DB::transaction(function () use ($transaction, $validated) {
            $oldAccount = Account::query()
                ->where('user_id', auth()->id())
                ->lockForUpdate()
                ->findOrFail($transaction->account_id);

            $newAccount = (int) $validated['account_id'] === (int) $oldAccount->id
                ? $oldAccount
                : Account::query()
                    ->where('user_id', auth()->id())
                    ->lockForUpdate()
                    ->findOrFail($validated['account_id']);

            if (!empty($validated['category_id'])) {
                Category::query()
                    ->where('user_id', auth()->id())
                    ->findOrFail($validated['category_id']);
            }

            $oldAccount->balance = $this->reverseBalanceEffect(
                $oldAccount->balance,
                $transaction->type,
                $transaction->amount
            );

            if ($oldAccount->id !== $newAccount->id) {
                $oldAccount->save();
            }

            $newAccount->balance = $this->calculateNewBalance(
                $newAccount->balance,
                $validated['type'],
                $validated['amount']
            );

            $newAccount->save();

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
            'borrowing' => Money::add($currentBalance, $amount),

            'expense',
            'investment',
            'lending' => Money::subtract($currentBalance, $amount),

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
            'borrowing' => Money::subtract($currentBalance, $amount),

            'expense',
            'investment',
            'lending' => Money::add($currentBalance, $amount),

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

    public function debug()
    {
        $userId = Auth::id();

        $accounts = Account::where('user_id', $userId)
            ->orderBy('id')
            ->get(['id', 'name', 'opening_balance', 'balance']);

        $accountNames = $accounts->pluck('name', 'id');
        $accountIds = $accounts->pluck('id')->map(fn ($id) => (int) $id)->all();

        $events = collect();

        $transactions = Transaction::where('user_id', $userId)
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->limit(20)
            ->get(['id', 'transaction_date', 'title', 'amount', 'type', 'account_id']);

        $transfers = Transfer::where('user_id', $userId)
            ->orderByDesc('transfer_date')
            ->orderByDesc('id')
            ->limit(20)
            ->get(['id', 'transfer_date', 'amount', 'from_account_id', 'to_account_id']);

        foreach ($transactions as $transaction) {
            $effect = in_array($transaction->type, ['income', 'borrowing'], true) ? 1 : -1;

            $events->push([
                'date' => $transaction->transaction_date->toDateString(),
                'priority' => 1,
                'id' => $transaction->id,
                'kind' => 'transaction',
                'title' => $transaction->title,
                'amount' => $effect * (float) $transaction->amount,
                'changes' => [
                    [
                        'account_id' => (int) $transaction->account_id,
                        'effect' => $effect,
                    ],
                ],
            ]);
        }

        foreach ($transfers as $transfer) {
            $events->push([
                'date' => $transfer->transfer_date->toDateString(),
                'priority' => 0,
                'id' => $transfer->id,
                'kind' => 'transfer',
                'title' => 'Transfer: '.($accountNames[$transfer->from_account_id] ?? 'Unknown')
                    .' → '.($accountNames[$transfer->to_account_id] ?? 'Unknown'),
                'amount' => (float) $transfer->amount,
                'changes' => [
                    [
                        'account_id' => (int) $transfer->from_account_id,
                        'effect' => -1,
                    ],
                    [
                        'account_id' => (int) $transfer->to_account_id,
                        'effect' => 1,
                    ],
                ],
            ]);
        }

        $events = $events
            ->sortByDesc(fn ($event) => $event['date'])
            ->take(20)
            ->sortBy(fn ($event) => $event['date'])
            ->values();

        $runningBalances = [];

        foreach ($accounts as $account) {
            $runningBalances[$account->id] = (float) $account->opening_balance;
        }

        $rows = [];

        foreach ($events as $event) {
            $accountBalances = [];

            foreach ($event['changes'] as $change) {
                $accountId = $change['account_id'];

                if (!in_array($accountId, $accountIds, true)) {
                    continue;
                }

                $runningBalances[$accountId] = round(
                    $runningBalances[$accountId] + $change['effect'] * abs($event['amount']),
                    2
                );

                $accountBalances[] = [
                    'account_id' => $accountId,
                    'balance' => $runningBalances[$accountId],
                ];
            }

            $rows[] = [
                'key' => $event['kind'].'-'.$event['id'],
                'date' => $event['date'],
                'kind' => $event['kind'],
                'title' => $event['title'],
                'amount' => $event['amount'],
                'balances' => $accountBalances,
            ];
        }

        return Inertia::render('Transactions/Debug', [
            'accounts' => $accounts->map(fn ($account) => [
                'id' => $account->id,
                'name' => $account->name,
                'opening_balance' => (float) $account->opening_balance,
                'stored_balance' => (float) $account->balance,
                'calculated_balance' => $runningBalances[$account->id],
            ]),
            'rows' => $rows,
        ]);
    }
}