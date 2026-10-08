<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transfer;
use App\Support\Money;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TransferController extends Controller
{
    /**
     * Display transfers.
     */
    public function index(): Response
    {
        $transfers = Transfer::query()
            ->where('user_id', auth()->id())
            ->with([
                'fromAccount:id,name,currency',
                'toAccount:id,name,currency',
            ])
            ->latest('transfer_date')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Transfers/Index', [
            'transfers' => $transfers,
        ]);
    }

    /**
     * Show transfer form.
     */
    public function create(): Response
    {
        $accounts = Account::query()
            ->where('user_id', auth()->id())
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Transfers/Create', [
            'accounts' => $accounts,
        ]);
    }

    /**
     * Store a transfer.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'from_account_id' => [
                'required',
                'integer',
            ],

            'to_account_id' => [
                'required',
                'integer',
                'different:from_account_id',
            ],

            'amount' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'transfer_date' => [
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
                'max:255',
            ],
        ]);

        $userId = auth()->id();

        /*
         * Make sure the source account belongs
         * to the authenticated user.
         */
        $fromAccount = Account::query()
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->findOrFail($validated['from_account_id']);

        /*
         * Make sure the destination account belongs
         * to the authenticated user.
         */
        $toAccount = Account::query()
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->findOrFail($validated['to_account_id']);

        if ($fromAccount->currency !== $toAccount->currency) {
            throw ValidationException::withMessages([
                'to_account_id' => 'Transfers are only allowed between accounts with the same currency.',
            ]);
        }

        /*
         * Don't allow transferring more than
         * the source account contains.
         */
        if (Money::compare($fromAccount->balance, $validated['amount']) < 0) {
            throw ValidationException::withMessages([
                'amount' => 'Insufficient balance in the source account.',
            ]);
        }

        DB::transaction(function () use (
            $validated,
            $userId,
            $fromAccount,
            $toAccount
        ) {
            /*
             * Create transfer record.
             */
            Transfer::create([
                'user_id' => $userId,
                'from_account_id' => $fromAccount->id,
                'to_account_id' => $toAccount->id,
                'amount' => $validated['amount'],
                'transfer_date' => $validated['transfer_date'],
                'note' => $validated['note'] ?? null,
                'reference' => $validated['reference'] ?? null,
            ]);

            /*
             * Remove money from source.
             */
            $fromAccount->decrement(
                'balance',
                $validated['amount']
            );

            /*
             * Add money to destination.
             */
            $toAccount->increment(
                'balance',
                $validated['amount']
            );
        });

        return redirect()
            ->route('transfers.index')
            ->with('success', 'Transfer completed successfully.');
    }

    /**
     * Show transfer.
     */
    public function show(Transfer $transfer): Response
    {
        $this->authorizeTransfer($transfer);

        $transfer->load([
            'fromAccount',
            'toAccount',
        ]);

        return Inertia::render('Transfers/Show', [
            'transfer' => $transfer,
        ]);
    }

    /**
     * Show edit form.
     */
    public function edit(Transfer $transfer): Response
    {
        $this->authorizeTransfer($transfer);

        $accounts = Account::query()
            ->where('user_id', auth()->id())
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Transfers/Edit', [
            'transfer' => $transfer,
            'accounts' => $accounts,
        ]);
    }

    /**
     * Update transfer.
     */
    public function update(
        Request $request,
        Transfer $transfer
    ): RedirectResponse {
        $this->authorizeTransfer($transfer);

        $validated = $request->validate([
            'from_account_id' => [
                'required',
                'integer',
            ],

            'to_account_id' => [
                'required',
                'integer',
                'different:from_account_id',
            ],

            'amount' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'transfer_date' => [
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
                'max:255',
            ],
        ]);

        $userId = auth()->id();

        DB::transaction(function () use (
            $transfer,
            $validated,
            $userId
        ) {
            /*
            |--------------------------------------------------------------------------
            | Get the original accounts
            |--------------------------------------------------------------------------
            */

            $oldFromAccount = Account::query()
                ->where('user_id', $userId)
                ->lockForUpdate()
                ->findOrFail($transfer->from_account_id);

            $oldToAccount = Account::query()
                ->where('user_id', $userId)
                ->lockForUpdate()
                ->findOrFail($transfer->to_account_id);

            /*
            |--------------------------------------------------------------------------
            | Reverse the original transfer
            |--------------------------------------------------------------------------
            |
            | Example:
            |
            | Original:
            | Bank  - 5,000
            | Cash  + 5,000
            |
            | We restore those balances before applying
            | the new transfer.
            |
            */

            $oldFromAccount->increment(
                'balance',
                $transfer->amount
            );

            $oldToAccount->decrement(
                'balance',
                $transfer->amount
            );

            /*
            |--------------------------------------------------------------------------
            | Get the new accounts
            |--------------------------------------------------------------------------
            */

            $newFromAccount = Account::query()
                ->where('user_id', $userId)
                ->where('is_active', true)
                ->lockForUpdate()
                ->findOrFail($validated['from_account_id']);

            $newToAccount = Account::query()
                ->where('user_id', $userId)
                ->where('is_active', true)
                ->lockForUpdate()
                ->findOrFail($validated['to_account_id']);

            /*
            |--------------------------------------------------------------------------
            | Check source account balance
            |--------------------------------------------------------------------------
            */

            if (
                Money::compare($newFromAccount->balance, $validated['amount']) < 0
            ) {
                throw ValidationException::withMessages([
                    'amount' => 'Insufficient balance in the source account.',
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Apply the new transfer
            |--------------------------------------------------------------------------
            */

            $newFromAccount->decrement(
                'balance',
                $validated['amount']
            );

            $newToAccount->increment(
                'balance',
                $validated['amount']
            );

            /*
            |--------------------------------------------------------------------------
            | Update transfer record
            |--------------------------------------------------------------------------
            */

            $transfer->update([
                'from_account_id' => $newFromAccount->id,
                'to_account_id' => $newToAccount->id,
                'amount' => $validated['amount'],
                'transfer_date' => $validated['transfer_date'],
                'note' => $validated['note'] ?? null,
                'reference' => $validated['reference'] ?? null,
            ]);
        });

        return redirect()
            ->route('transfers.index')
            ->with('success', 'Transfer updated successfully.');
    }

    /**
     * Delete transfer.
     */
    public function destroy(
        Transfer $transfer
    ): RedirectResponse {
        $this->authorizeTransfer($transfer);

        DB::transaction(function () use ($transfer) {
            $fromAccount = Account::query()
                ->where('user_id', auth()->id())
                ->findOrFail($transfer->from_account_id);

            $toAccount = Account::query()
                ->where('user_id', auth()->id())
                ->findOrFail($transfer->to_account_id);

            /*
             * Reverse the transfer.
             */
            $fromAccount->increment(
                'balance',
                $transfer->amount
            );

            $toAccount->decrement(
                'balance',
                $transfer->amount
            );

            $transfer->delete();
        });

        return redirect()
            ->route('transfers.index')
            ->with('success', 'Transfer deleted successfully.');
    }

    /**
     * Make sure the transfer belongs to the user.
     */
    private function authorizeTransfer(
        Transfer $transfer
    ): void {
        abort_unless(
            $transfer->user_id === auth()->id(),
            403
        );
    }
}