<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Obligation;
use App\Models\Transaction;
use App\Support\Money;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ObligationController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $outstandingObligations = $user
            ->obligations()
            ->where('is_settled', false)
            ->with('transaction.account')
            ->orderByDesc('date')
            ->get();

        $accounts = $user
            ->accounts()
            ->where('is_active', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'account_number',
                'type',
                'balance',
                'currency',
                'is_active',
            ]);

        return Inertia::render(
            'Obligations/Index',
            [
                'outstandingObligations' => $outstandingObligations,
                'accounts' => $accounts,
            ]
        );
    }

    public function create(): Response
    {
        $accounts = Account::query()
            ->where('user_id', auth()->id())
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render(
            'Obligations/Create',
            [
                'accounts' => $accounts,
            ]
        );
    }

    public function settled(): Response
    {
        $settledObligations = auth()->user()
            ->obligations()
            ->where('is_settled', true)
            ->with('transaction.account')
            ->orderByDesc('date')
            ->get();

        return Inertia::render(
            'Obligations/SettledObligation',
            [
                'settledObligations' => $settledObligations,
            ]
        );
    }

    public function store(Request $request): RedirectResponse
    {
        if (! auth()->user()->exists()) {
            abort(403);
        }

        $validated = $request->validate([
            'account_id' => [
                'required',
                'integer',
                'exists:accounts,id',
            ],

            'type' => [
                'required',
                'in:lending,borrowing',
            ],

            'person' => [
                'required',
                'string',
                'max:255',
            ],

            'amount' => [
                'required',
                'numeric',
                'min:0.01',
                'max:9999999999999.99',
            ],

            'date' => [
                'required',
                'date',
            ],

            'due_date' => [
                'nullable',
                'date',
                'after_or_equal:date',
            ],

            'note' => [
                'nullable',
                'string',
            ],
        ]);

        $account = auth()->user()
            ->accounts()
            ->whereKey($validated['account_id'])
            ->where('is_active', true)
            ->firstOrFail();

        DB::transaction(function () use (
            $validated,
            $account
        ) {
            $transactionType = $validated['type'];

            $transactionTitle = match ($validated['type']) {
                'lending' => 'Lent to ' . $validated['person'],
                'borrowing' => 'Borrowed from ' . $validated['person'],
            };

            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'account_id' => $account->id,
                'category_id' => null,
                'title' => $transactionTitle,
                'type' => $transactionType,
                'amount' => $validated['amount'],
                'transaction_date' => $validated['date'],
                'note' => $validated['note'] ?? null,
                'reference' => null,
            ]);

            $newBalance = $this->calculateNewBalance(
                $account->balance,
                $transactionType,
                $validated['amount']
            );

            $account->update([
                'balance' => $newBalance,
            ]);

            Obligation::create([
                'user_id' => auth()->id(),
                'transaction_id' => $transaction->id,
                'type' => $validated['type'],
                'person' => $validated['person'],
                'amount' => $validated['amount'],
                'date' => $validated['date'],
                'due_date' => $validated['due_date'] ?? null,
                'note' => $validated['note'] ?? null,
                'is_settled' => false,
            ]);
        });

        return redirect()
            ->route('obligations.index')
            ->with(
                'success',
                'Obligation created successfully.'
            );
    }

    public function edit(
        Obligation $obligation
    ): Response {
        $this->authorizeObligation($obligation);

        if ($obligation->is_settled) {
            abort(
                422,
                'A settled obligation cannot be edited.'
            );
        }

        $obligation->load([
            'transaction:id,account_id',
        ]);

        $accounts = auth()->user()
            ->accounts()
            ->where('is_active', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'account_number',
                'type',
                'balance',
                'currency',
                'is_active',
            ]);

        return Inertia::render(
            'Obligations/Edit',
            [
                'obligation' => $obligation,
                'accounts' => $accounts,
                'breadcrumbLabels' => [
                    (string) $obligation->id => ($obligation->type == 'lending' ? 'To' : 'From') . ' ' . $obligation->person,
                ],
            ]
        );
    }

    public function update(
        Request $request,
        Obligation $obligation
    ): RedirectResponse {
        $this->authorizeObligation($obligation);

        if ($obligation->is_settled) {
            abort(
                422,
                'A settled obligation cannot be edited.'
            );
        }

        $validated = $request->validate([
            'account_id' => [
                'required',
                'integer',
                'exists:accounts,id',
            ],

            'type' => [
                'required',
                'in:lending,borrowing',
            ],

            'person' => [
                'required',
                'string',
                'max:255',
            ],

            'amount' => [
                'required',
                'numeric',
                'min:0.01',
                'max:9999999999999.99',
            ],

            'date' => [
                'required',
                'date',
            ],

            'due_date' => [
                'nullable',
                'date',
                'after_or_equal:date',
            ],

            'note' => [
                'nullable',
                'string',
            ],
        ]);

        $newAccount = auth()->user()
            ->accounts()
            ->whereKey($validated['account_id'])
            ->where('is_active', true)
            ->firstOrFail();

        DB::transaction(function () use (
            $obligation,
            $validated,
            $newAccount
        ) {
            $transaction = $obligation->transaction()
                ->lockForUpdate()
                ->firstOrFail();

            $oldAccount = Account::query()
                ->whereKey($transaction->account_id)
                ->lockForUpdate()
                ->firstOrFail();

            /*
             * Reverse the original transaction
             * from the old account.
             */
            $oldBalance = $this->reverseBalanceEffect(
                $oldAccount->balance,
                $transaction->type,
                $transaction->amount
            );

            $oldAccount->update([
                'balance' => $oldBalance,
            ]);

            $transactionType = $validated['type'];

            $transactionTitle = match ($transactionType) {
                'lending' => 'Lent to ' . $validated['person'],
                'borrowing' => 'Borrowed from ' . $validated['person'],
            };

            /*
             * Update the original transaction.
             */
            $transaction->update([
                'account_id' => $newAccount->id,
                'title' => $transactionTitle,
                'type' => $transactionType,
                'amount' => $validated['amount'],
                'transaction_date' => $validated['date'],
                'note' => $validated['note'] ?? null,
                'category_id' => null,
            ]);

            /*
             * Apply the updated transaction
             * to the new account.
             */
            $newBalance = $this->calculateNewBalance(
                $newAccount->balance,
                $transactionType,
                $validated['amount']
            );

            $newAccount->update([
                'balance' => $newBalance,
            ]);

            $obligation->update([
                'type' => $validated['type'],
                'person' => $validated['person'],
                'amount' => $validated['amount'],
                'date' => $validated['date'],
                'due_date' => $validated['due_date'] ?? null,
                'note' => $validated['note'] ?? null,
            ]);
        });

        return redirect()
            ->route('obligations.index')
            ->with(
                'success',
                'Obligation updated successfully.'
            );
    }

    public function settle(
        Request $request,
        Obligation $obligation
    ): RedirectResponse {
        $this->authorizeObligation($obligation);

        if ($obligation->is_settled) {
            abort(422, 'This obligation is already settled.');
        }

        $validated = $request->validate([
            'account_id' => [
                'required',
                'integer',
                'exists:accounts,id',
            ],
            'date' => [
                'required',
                'date',
            ],
        ]);

        $account = auth()->user()
            ->accounts()
            ->whereKey($validated['account_id'])
            ->where('is_active', true)
            ->firstOrFail();

        try {
            DB::transaction(function () use (
                $obligation,
                $validated,
                $account
            ) {
                /*
                * Lending:
                *   Money comes back to us -> income.
                *
                * Borrowing:
                *   We pay the money back -> expense.
                */
                $transactionType = match ($obligation->type) {
                    'lending' => 'income',
                    'borrowing' => 'expense',
                };

                /*
                * Keep the settlement transaction title concise.
                */
                $transactionTitle = match ($obligation->type) {
                    'lending' => 'Received from ' . $obligation->person,
                    'borrowing' => 'Repaid to ' . $obligation->person,
                };

                /*
                * The note identifies the original obligation.
                */
                $transactionNote = match ($obligation->type) {
                    'lending' => sprintf(
                        'For the money lent on %s.',
                        $obligation->date->format('d-M-Y')
                    ),
                    'borrowing' => sprintf(
                        'For the money borrowed on %s.',
                        $obligation->date->format('d-M-Y')
                    ),
                };

                Transaction::create([
                    'user_id' => auth()->id(),
                    'account_id' => $account->id,
                    'category_id' => null,
                    'title' => $transactionTitle,
                    'type' => $transactionType,
                    'amount' => $obligation->amount,
                    'transaction_date' => $validated['date'],
                    'note' => $transactionNote,
                    'reference' => null,
                ]);

                /*
                * Apply the settlement transaction
                * to the selected account.
                */
                $newBalance = $this->calculateNewBalance(
                    $account->balance,
                    $transactionType,
                    $obligation->amount
                );

                $account->update([
                    'balance' => $newBalance,
                ]);

                $obligation->update([
                    'is_settled' => true,
                ]);
            });
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error(
                'Obligation settlement failed',
                [
                    'obligation_id' => $obligation->id,
                    'exception' => get_class($e),
                    'message' => $e->getMessage(),
                    'sql_state' => $e instanceof \Illuminate\Database\QueryException
                        ? ($e->errorInfo[0] ?? null)
                        : null,
                    'driver_message' => $e instanceof \Illuminate\Database\QueryException
                        ? ($e->errorInfo[2] ?? null)
                        : null,
                ]
            );

            throw $e;
        }

        return back()->with(
            'success',
            'Obligation settled successfully.'
        );
    }

    public function destroy(
        Obligation $obligation
    ): RedirectResponse {
        $this->authorizeObligation($obligation);

        if ($obligation->is_settled) {
            abort(
                422,
                'A settled obligation cannot be deleted.'
            );
        }

        DB::transaction(function () use ($obligation) {
            $transaction = $obligation->transaction()
                ->lockForUpdate()
                ->firstOrFail();

            $account = Account::query()
                ->whereKey($transaction->account_id)
                ->lockForUpdate()
                ->firstOrFail();

            /*
             * Reverse the original transaction.
             */
            $newBalance = $this->reverseBalanceEffect(
                $account->balance,
                $transaction->type,
                $transaction->amount
            );

            $account->update([
                'balance' => $newBalance,
            ]);

            /*
             * Delete the obligation first because
             * it references the transaction.
             */
            $obligation->delete();

            $transaction->delete();
        });

        return back()->with(
            'success',
            'Obligation deleted successfully.'
        );
    }

    private function calculateNewBalance(
        $currentBalance,
        string $type,
        $amount
    ) {
        return match ($type) {
            'income', 'borrowing' => Money::add($currentBalance, $amount),

            'expense', 'investment', 'lending' => Money::subtract($currentBalance, $amount),

            default => $currentBalance,
        };
    }

    private function reverseBalanceEffect(
        $currentBalance,
        string $type,
        $amount
    ) {
        return match ($type) {
            'income', 'borrowing' => Money::subtract($currentBalance, $amount),

            'expense', 'investment', 'lending' => Money::add($currentBalance, $amount),

            default => $currentBalance,
        };
    }

    private function authorizeObligation(
        Obligation $obligation
    ): void {
        if ($obligation->user_id !== auth()->id()) {
            abort(403);
        }
    }
}