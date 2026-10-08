<?php

namespace App\Http\Controllers;

use App\Models\Dps;
use App\Models\DpsPayment;
use App\Models\Investment;
use App\Models\Transaction;
use App\Models\Account;
use App\Support\Money;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DpsController extends Controller
{
    /**
     * Display the user's DPS investments.
     */
    public function index(): Response
    {
        $user = auth()->user();

        $dps = Dps::query()
            ->whereHas('investment', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with([
                'investment',
            ])
            ->withSum('payments', 'amount')
            ->withCount('payments')
            ->latest()
            ->get();

        return Inertia::render('Investments/Dps/Index', [
            'dps' => $dps,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Investments/Dps/Create');
    }

    public function edit(Dps $dps): Response
    {
        $dps->load('investment');
        return Inertia::render('Investments/Dps/Edit', [
            'dps' => $dps,
            'breadcrumbLabels' => [
                (string) $dps->id => $dps->investment->name,
            ],
        ]);
    }

    /**
     * Store a new DPS.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'issue_date' => ['required', 'date'],
            'bank_name' => ['required', 'string', 'max:255'],
            'installment_amount' => ['required', 'numeric', 'min:0.01'],
            'duration_years' => ['required', 'integer', 'min:1'],
            'interest_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        $dps = DB::transaction(function () use ($validated) {

            $investment = Investment::create([
                'user_id' => auth()->id(),
                'name' => $validated['name'],
                'start_date' => $validated['issue_date'],
                'type' => 'dps',
            ]);

            return Dps::create([
                'investment_id' => $investment->id,
                'bank_name' => $validated['bank_name'],
                'installment_amount' => $validated['installment_amount'],
                'duration_years' => $validated['duration_years'],
                'interest_rate' => $validated['interest_rate'],
                'tax_rate' => $validated['tax_rate'],
                'is_active' => true,
            ]);
        });

        return to_route('investments.dps.show', $dps)
                ->with('success', 'DPS created successfully.');
    }

    /**
     * Display a DPS with all payments.
     */
    public function show(Dps $dps): Response
    {
        $this->authorizeDps($dps);

        $dps->load([
            'investment',

            'payments' => function ($query) {
                $query
                    ->with([
                        'transaction.account',
                    ])
                    ->orderByDesc('payment_date');
            },
        ]);

        $dps->loadSum(
            'payments',
            'amount'
        );

        $dps->loadCount(
            'payments'
        );

        $accounts = Account::query()
            ->where('user_id', auth()->id())
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render(
            'Investments/Dps/Show',
            [
                'dps' => $dps,
                'accounts' => $accounts,
                'breadcrumbLabels' => [
                    (string) $dps->id => $dps->investment->name,
                ],
            ]
        );
    }

    /**
     * Update a DPS.
     */
    public function update(Request $request, Dps $dps): RedirectResponse
    {
        $this->authorizeDps($dps);

        $validated = $request->validate([
            'name'                => ['required', 'string', 'max:255'],
            'bank_name'           => ['required', 'string', 'max:255'],
            'installment_amount'  => ['required', 'numeric', 'min:0.01'],
            'duration_years'      => ['required', 'integer', 'min:1'],
            'interest_rate'       => ['required', 'numeric', 'min:0', 'max:100'],
            'tax_rate'            => ['required', 'numeric', 'min:0', 'max:100'],
            'issue_date'          => ['required', 'date'],
        ]);

        DB::transaction(function () use ($dps, $validated) {
            $dps->update([
                'bank_name' => $validated['bank_name'],
                'installment_amount' => $validated['installment_amount'],
                'duration_years' => $validated['duration_years'],
                'interest_rate' => $validated['interest_rate'],
                'tax_rate' => $validated['tax_rate'],
            ]);

            $dps->investment->update([
                'name'          => $validated['name'],
                'start_date'    => $validated['issue_date'],
            ]);
        });

        return redirect()
            ->route('investments.dps.show', $dps)
            ->with('success', 'DPS updated successfully.');
    }

    /**
     * Delete a DPS.
     */
    public function destroy(
        Dps $dps
    ): RedirectResponse {
        $this->authorizeDps($dps);

        $dps->load([
            'investment',
            'payments.transaction.account',
        ]);

        DB::transaction(function () use ($dps) {
            foreach ($dps->payments as $payment) {
                $transaction = $payment->transaction;

                if ($transaction) {
                    $account = $transaction->account;

                    if ($account) {
                        $account->balance = $this->reverseBalanceEffect(
                            $account->balance,
                            $transaction->type,
                            $transaction->amount
                        );

                        $account->save();
                    }

                    /*
                    * Delete the payment first because
                    * dps_payments.transaction_id uses
                    * restrictOnDelete().
                    */
                    $payment->delete();

                    $transaction->delete();
                }
            }

            $investment = $dps->investment;

            $dps->delete();

            $investment->delete();
        });

        return redirect()
            ->route('investments.dps.index')
            ->with(
                'success',
                'DPS deleted successfully.'
            );
    }

    public function toggleActive(
        Dps $dps,
        bool $isActive
    ): RedirectResponse {
        $this->authorizeDps($dps);

        $dps->update([
            'is_active' => $isActive,
        ]);

        return back()->with(
            'success',
            $isActive
                ? 'DPS activated successfully.'
                : 'DPS deactivated successfully.'
        );
    }

    /**
     * Store a DPS payment.
     *
     * Creates both:
     * - investment transaction
     * - DPS payment
     */
    public function storePayment(
        Request $request,
        Dps $dps
    ): RedirectResponse {
        $this->authorizeDps($dps);

        abort_unless(
            $dps->is_active,
            422,
            'This DPS is inactive.'
        );

        $validated = $request->validate([
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
            ],
            'payment_date' => [
                'required',
                'date',
            ],
            'account_id' => [
                'required',
                'integer',
                'exists:accounts,id',
            ],
        ]);

        // Make sure the selected account belongs to the user.
        $account = auth()->user()
            ->accounts()
            ->findOrFail(
                $validated['account_id']
            );

        DB::transaction(function () use (
            $dps,
            $validated,
            $account
        ) {
            $paymentDate = \Carbon\Carbon::parse(
                $validated['payment_date']
            );

            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'account_id' => $account->id,
                'category_id' => null,
                'type' => 'investment',
                'amount' => $validated['amount'],
                'transaction_date' => $validated['payment_date'],
                'title' => 'DPS Installment for '
                    . $dps->investment->name
                    . ' DPS',
                'reference' => 'Installment of '
                    . number_format(
                        $validated['amount'],
                        2
                    )
                    . ' BDT was paid for month '
                    . $paymentDate->format('F Y'),
            ]);

            DpsPayment::create([
                'dps_id' => $dps->id,
                'transaction_id' => $transaction->id,
                'amount' => $validated['amount'],
                'payment_date' => $validated['payment_date'],
            ]);

            // Investment transaction reduces the source account balance.
            $account->balance = $this->calculateNewBalance(
                $account->balance,
                'investment',
                $validated['amount']
            );

            $account->save();
        });

        return back()->with(
            'success',
            'DPS payment recorded successfully.'
        );
    }

    public function updatePayment(
        Request $request,
        DpsPayment $payment
    ): RedirectResponse {
        $payment->load(
            'dps.investment',
            'transaction.account'
        );

        $this->authorizeDps(
            $payment->dps
        );

        $validated = $request->validate([
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
            ],
            'payment_date' => [
                'required',
                'date',
            ],
            'account_id' => [
                'required',
                'integer',
                'exists:accounts,id',
            ],
        ]);

        // Make sure the new account belongs to the user.
        $newAccount = auth()->user()
            ->accounts()
            ->findOrFail(
                $validated['account_id']
            );

        DB::transaction(function () use (
            $payment,
            $validated,
            $newAccount
        ) {
            $transaction = $payment->transaction;

            $oldAccount = $transaction->account;
            $oldAmount = $payment->amount;
            $oldType = $transaction->type;

            /*
            * 1. Reverse the old transaction effect.
            *
            * Since the old transaction is an investment,
            * this adds the old payment amount back to
            * the old source account.
            */
            $oldAccount->balance = $this->reverseBalanceEffect(
                $oldAccount->balance,
                $oldType,
                $oldAmount
            );

            $oldAccount->save();

            /*
            * 2. Apply the new transaction effect.
            *
            * Investment reduces the new source account.
            */
            $newAccount->balance = $this->calculateNewBalance(
                $newAccount->balance,
                'investment',
                $validated['amount']
            );

            $newAccount->save();

            /*
            * 3. Update the DPS payment.
            */
            $payment->update([
                'amount' => $validated['amount'],
                'payment_date' => $validated['payment_date'],
            ]);

            /*
            * 4. Update the associated transaction.
            */
            $transaction->update([
                'account_id' => $newAccount->id,
                'amount' => $validated['amount'],
                'transaction_date' => $validated['payment_date'],
                'category_id' => null,
                'type' => 'investment',
            ]);
        });

        return back()->with(
            'success',
            'DPS payment updated successfully.'
        );
    }

    /**
     * Delete a DPS payment and its transaction.
     */

    public function destroyPayment(
        DpsPayment $payment
    ): RedirectResponse {
        $payment->load(
            'dps.investment',
            'transaction.account'
        );

        $this->authorizeDps(
            $payment->dps
        );

        DB::transaction(function () use ($payment) {
            $transaction = $payment->transaction;

            if ($transaction) {
                $account = $transaction->account;

                /*
                * Reverse the transaction effect before
                * deleting the transaction.
                *
                * Since this is an investment transaction,
                * the payment amount is added back to
                * the source account.
                */
                $account->balance = $this->reverseBalanceEffect(
                    $account->balance,
                    $transaction->type,
                    $transaction->amount
                );

                $account->save();
            }

            /*
            * Delete the DPS payment first because
            * dps_payments.transaction_id uses
            * restrictOnDelete().
            */
            $payment->delete();

            $transaction?->delete();
        });

        return back()->with(
            'success',
            'DPS payment deleted successfully.'
        );
    }

    /**
     * Calculate the new account balance based on transaction type.
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
     * Ensure the DPS belongs to the authenticated user.
     */
    private function authorizeDps(Dps $dps): void
    {
        abort_unless(
            $dps->investment->user_id === auth()->id(),
            403
        );
    }
}