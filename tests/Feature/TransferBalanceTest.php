<?php

use App\Models\Account;
use App\Models\User;
use App\Models\Transfer;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('creating and editing a transfer adjusts balances without BCMath', function () {
    $user = User::factory()->create();
    $fromAccount = Account::create([
        'user_id' => $user->id,
        'name' => 'Source',
        'type' => 'cash',
        'opening_balance' => '100.00',
        'balance' => '100.00',
        'currency' => 'BDT',
        'is_active' => true,
    ]);
    $toAccount = Account::create([
        'user_id' => $user->id,
        'name' => 'Destination',
        'type' => 'cash',
        'opening_balance' => '20.00',
        'balance' => '20.00',
        'currency' => 'BDT',
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->post(route('transfers.store'), [
            'from_account_id' => $fromAccount->id,
            'to_account_id' => $toAccount->id,
            'amount' => '10.25',
            'transfer_date' => now()->toDateString(),
        ])
        ->assertRedirect(route('transfers.index'));

    $transfer = Transfer::query()->where('user_id', $user->id)->firstOrFail();
    expect($fromAccount->fresh()->balance)->toBe('89.75')
        ->and($toAccount->fresh()->balance)->toBe('30.25');

    $this->put(route('transfers.update', $transfer), [
        'from_account_id' => $fromAccount->id,
        'to_account_id' => $toAccount->id,
        'amount' => '15.50',
        'transfer_date' => now()->toDateString(),
    ])->assertRedirect(route('transfers.index'));

    expect($fromAccount->fresh()->balance)->toBe('84.50')
        ->and($toAccount->fresh()->balance)->toBe('35.50')
        ->and($transfer->fresh()->amount)->toBe('15.50');
});