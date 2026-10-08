<?php

use App\Models\User;
use App\Models\Account;
use App\Models\Budget;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as AssertableInertia;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard reuses transaction data without changing financial summaries', function () {
    $user = User::factory()->create();
    $account = Account::create([
        'user_id' => $user->id,
        'name' => 'Main account',
        'type' => 'cash',
        'opening_balance' => 1000,
        'balance' => 1100,
        'currency' => 'BDT',
        'is_active' => true,
    ]);

    $today = Carbon::today();
    $lastMonth = $today->copy()->subMonth()->startOfMonth();
    $createTransaction = function (string $type, float $amount, Carbon $date) use ($user, $account) {
        Transaction::create([
            'user_id' => $user->id,
            'account_id' => $account->id,
            'title' => ucfirst($type),
            'type' => $type,
            'amount' => $amount,
            'transaction_date' => $date->toDateString(),
        ]);
    };

    $createTransaction('income', 100, $lastMonth->copy()->addDays(1));
    $createTransaction('expense', 25, $lastMonth->copy()->addDays(2));
    $createTransaction('income', 80, $today);
    $createTransaction('expense', 20, $today);
    $createTransaction('investment', 15, $today);

    Budget::create([
        'user_id' => $user->id,
        'period' => 'daily',
        'amount' => 100,
        'start_date' => $today->copy()->startOfYear()->toDateString(),
    ]);
    Budget::create([
        'user_id' => $user->id,
        'period' => 'monthly',
        'amount' => 200,
        'start_date' => $today->copy()->startOfYear()->toDateString(),
    ]);
    Budget::create([
        'user_id' => $user->id,
        'period' => 'quarterly',
        'amount' => 500,
        'start_date' => $today->copy()->startOfYear()->toDateString(),
    ]);

    DB::enableQueryLog();
    DB::flushQueryLog();
    try {
        $response = $this->actingAs($user)->get(route('dashboard'));
        $transactionQueryCount = collect(DB::getQueryLog())
            ->filter(fn ($query) => str_contains(strtolower($query['query']), 'transactions'))
            ->count();
    } finally {
        DB::disableQueryLog();
    }

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Dashboard')
        ->where('totalBalance.balance', 1100.0)
        ->where('totalBalance.account_count', 1)
        ->where('totalBalance.percentage_change', 2.33)
        ->where('transactionSummary.income.amount', 80.0)
        ->where('transactionSummary.expense.amount', 20.0)
        ->where('transactionSummary.savings.amount', 60.0)
        ->where('transactionSummary.investment.amount', 15.0)
        ->where('recentTransactions.0.account', 'Main account')
        ->where('expenseCategories.categories.0.name', 'Uncategorized')
        ->where('expenseCategories.categories.0.amount', 20.0)
        ->where('budgets.daily.spent', 20.0)
        ->where('budgets.monthly.spent', 20.0)
        ->where('budgets.quarterly.spent', 20.0)
    );

    expect($transactionQueryCount)->toBeLessThan(5);
});