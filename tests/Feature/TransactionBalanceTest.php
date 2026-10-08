<?php

use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('creating and deleting a transaction adjusts the account balance without BCMath', function () {
    $user = User::factory()->create();
    $account = Account::create([
        'user_id' => $user->id,
        'name' => 'Main account',
        'type' => 'cash',
        'opening_balance' => '100.00',
        'balance' => '100.00',
        'currency' => 'BDT',
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->post(route('transactions.store'), [
            'account_id' => $account->id,
            'title' => 'Lunch',
            'type' => 'expense',
            'amount' => '10.25',
            'transaction_date' => now()->toDateString(),
        ])
        ->assertRedirect(route('transactions.index'));

    expect($account->fresh()->balance)->toBe('89.75');

    $transaction = Transaction::query()->where('user_id', $user->id)->firstOrFail();

    $this->delete(route('transactions.destroy', $transaction))
        ->assertRedirect();

    expect($account->fresh()->balance)->toBe('100.00');
});