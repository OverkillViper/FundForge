<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    /**
     * Display all accounts.
     */
    public function index(): Response
    {
        $accounts = Account::query()
            ->where('user_id', auth()->id())
            ->orderBy('name')
            ->get();

        return Inertia::render('Accounts/Index', [
            'accounts' => $accounts,
        ]);
    }

    /**
     * Show the create account page.
     */
    public function create(): Response
    {
        return Inertia::render('Accounts/Create');
    }

    /**
     * Store a new account.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'type' => [
                'required',
                Rule::in([
                    'bank',
                    'cash',
                    'mobile_walllet',
                    'other',
                ]),
            ],

            'opening_balance' => [
                'required',
                'numeric',
                'min:0',
            ],

            'currency' => [
                'required',
                'string',
                'size:3',
            ],

            'account_number' => [
                'required',
                'string',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $account = Account::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'type' => $validated['type'],
            'opening_balance' => $validated['opening_balance'],
            'balance' => $validated['opening_balance'],
            'currency' => strtoupper($validated['currency']),
            'is_active' => $validated['is_active'] ?? true,
            'account_number' => $validated['account_number'],
        ]);

        return redirect()
            ->route('accounts.index')
            ->with('success', 'Account created successfully.');
    }

    /**
     * Show the edit account page.
     */
    public function edit(Account $account): Response
    {
        $this->authorizeAccount($account);

        return Inertia::render('Accounts/Edit', [
            'account' => $account,
        ]);
    }

    /**
     * Update an account.
     */
    public function update(
        Request $request,
        Account $account
    ): RedirectResponse {
        $this->authorizeAccount($account);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'type' => [
                'required',
                Rule::in([
                    'bank',
                    'cash',
                    'mobile_wallet',
                    'credit_card',
                    'other',
                ]),
            ],

            'currency' => [
                'required',
                'string',
                'size:3',
            ],

            'account_number' => [
                'required',
                'string',
            ],

            'is_active' => [
                'required',
                'boolean',
            ],
        ]);

        $account->update([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'currency' => strtoupper($validated['currency']),
            'is_active' => $validated['is_active'],
            'account_number' => $validated['account_number'],
        ]);

        return redirect()
            ->route('accounts.index')
            ->with('success', 'Account updated successfully.');
    }

    /**
     * Toggle the active status of an account.
     */
    public function toggleActive(
        Request $request,
        Account $account
    ): RedirectResponse {
        $this->authorizeAccount($account);

        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $account->update([
            'is_active' => $validated['is_active'],
        ]);

        return redirect()
            ->route('accounts.index')
            ->with('success', 'Account status updated successfully.');
    }

    /**
     * Delete an account.
     */
    public function destroy(Account $account): RedirectResponse
    {
        $this->authorizeAccount($account);

        if ($account->transactions()->exists()) {
            return back()->with(
                'error',
                'This account cannot be deleted because it has transactions.'
            );
        }

        if (
            $account->outgoingTransfers()->exists() ||
            $account->incomingTransfers()->exists()
        ) {
            return back()->with(
                'error',
                'This account cannot be deleted because it has transfers.'
            );
        }

        $account->delete();

        return redirect()
            ->route('accounts.index')
            ->with('success', 'Account deleted successfully.');
    }

    /**
     * Ensure the account belongs to the authenticated user.
     */
    private function authorizeAccount(Account $account): void
    {
        abort_unless(
            $account->user_id === auth()->id(),
            403
        );
    }
}