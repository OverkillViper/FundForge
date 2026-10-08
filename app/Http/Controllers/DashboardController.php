<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\SavingsCertificateService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private SavingsCertificateService $savingsCertificateService
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today();

        $thisMonth = $today->copy()->startOfMonth();
        $lastMonth = $today->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $lastMonth->copy()->endOfMonth();
        $yearStart = $today->copy()->startOfYear();
        $transactionStart = $yearStart->lt($lastMonth)
            ? $yearStart
            : $lastMonth;

        $allAccounts = $user->accounts()
            ->get([
                'id',
                'name',
                'type',
                'currency',
                'balance',
                'opening_balance',
                'is_active',
            ]);
        $accounts = $allAccounts
            ->where('is_active', true)
            ->values();

        $transactions = $user->transactions()
            ->whereBetween('transaction_date', [
                $transactionStart->toDateString(),
                $today->toDateString(),
            ])
            ->with('category:id,name')
            ->get([
                'id',
                'account_id',
                'category_id',
                'title',
                'type',
                'amount',
                'transaction_date',
            ]);

        $balanceChanges = $accounts->isEmpty()
            ? collect()
            : Transaction::query()
                ->whereIn('account_id', $accounts->modelKeys())
                ->whereDate('transaction_date', '<=', $lastMonthEnd)
                ->selectRaw("account_id, SUM(CASE WHEN type IN ('income', 'borrowing') THEN amount WHEN type IN ('expense', 'investment', 'lending') THEN -amount ELSE 0 END) AS balance_change")
                ->groupBy('account_id')
                ->pluck('balance_change', 'account_id');

        $budgets = $user->budgets()
            ->whereIn('period', ['daily', 'monthly', 'quarterly'])
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->get(['id', 'period', 'amount', 'start_date']);

        $obligations = $user->obligations()
            ->where('is_settled', false)
            ->get(['type', 'amount']);

        $calculationData = $this->savingsCertificateService
            ->getUserCalculationData($user->id);
        $currentMonthInterest = $this->savingsCertificateService
            ->getCurrentMonthInterestSummary(
                $user->id,
                $thisMonth,
                $calculationData
            );
        $lastMonthInterest = $this->savingsCertificateService
            ->getCurrentMonthInterestSummary(
                $user->id,
                $lastMonth,
                $calculationData
            );

        return Inertia::render('Dashboard', [
            'totalBalance' => $this->getTotalBalance(
                $accounts,
                $balanceChanges,
                $transactions->contains(fn ($transaction) =>
                    $transaction->transaction_date->gte($lastMonth)
                    && $transaction->transaction_date->lte($lastMonthEnd)
                )
            ),
            'transactionSummary' => $this->getTransactionSummary(
                $transactions,
                $thisMonth,
                $today,
                $lastMonth,
                $lastMonthEnd,
                $currentMonthInterest['net_interest'],
                $lastMonthInterest['net_interest']
            ),
            'expenseCategories' => $this->getExpenseCategories(
                $transactions,
                $today,
                $yearStart
            ),
            'recentTransactions' => $this->getRecentTransactions($user, $allAccounts),
            'budgets' => $this->getBudgets($budgets, $transactions, $today),
            'obligations' => $this->getObligations($obligations),
        ]);
    }

    private function getTotalBalance(
        EloquentCollection $accounts,
        $balanceChanges,
        bool $hasPreviousMonthActivity
    ): array
    {
        $totalBalance = (float) $accounts->sum('balance');

        $topAccounts = $accounts
            ->sortByDesc('balance')
            ->take(2)
            ->values()
            ->map(fn ($account) => [
                'id' => $account->id,
                'name' => $account->name,
                'type' => $account->type,
                'currency' => $account->currency,
                'balance' => (float) $account->balance,
            ])
            ->all();

        $lastMonthBalance = $hasPreviousMonthActivity
            ? (float) $accounts->sum(
                fn ($account) => round(
                    (float) $account->opening_balance
                    + (float) ($balanceChanges[$account->id] ?? 0),
                    2
                )
            )
            : null;

        return [
            'balance' => round($totalBalance, 2),
            'accounts' => $topAccounts,
            'account_count' => $accounts->count(),
            'percentage_change' => $lastMonthBalance !== null
                ? $this->percentageChange($lastMonthBalance, $totalBalance)
                : null,
        ];
    }

    private function getTransactionSummary(
        EloquentCollection $transactions,
        Carbon $thisMonth,
        Carbon $today,
        Carbon $lastMonth,
        Carbon $lastMonthEnd,
        float $currentMonthInterest,
        float $lastMonthInterest
    ): array
    {
        $income = $this->sumTransactions($transactions, 'income', $thisMonth, $today)
            + $currentMonthInterest;
        $lastIncome = $this->sumTransactions($transactions, 'income', $lastMonth, $lastMonthEnd)
            + $lastMonthInterest;
        $expense = $this->sumTransactions($transactions, 'expense', $thisMonth, $today);
        $lastExpense = $this->sumTransactions($transactions, 'expense', $lastMonth, $lastMonthEnd);
        $investment = $this->sumTransactions($transactions, 'investment', $thisMonth, $today);
        $lastInvestment = $this->sumTransactions($transactions, 'investment', $lastMonth, $lastMonthEnd);

        $savings = $income - $expense;
        $lastSavings = $lastIncome - $lastExpense;

        return [
            'income' => [
                'amount' => round($income, 2),
                'percentage_change' => $this->percentageChange($lastIncome, $income),
            ],

            'expense' => [
                'amount' => round($expense, 2),
                'percentage_change' => $this->percentageChange($lastExpense, $expense),
            ],

            'savings' => [
                'amount' => round($savings, 2),
                'percentage_change' => $this->percentageChange($lastSavings, $savings),
            ],

            'investment' => [
                'amount' => round($investment, 2),
                'percentage_change' => $this->percentageChange($lastInvestment, $investment),
            ],

            'savings_invested_percentage' => $savings > 0
                ? round(($investment / $savings) * 100, 2)
                : 0,
        ];
    }

    private function sumTransactions(
        EloquentCollection $transactions,
        string $type,
        Carbon $from,
        Carbon $to
    ): float
    {
        return round((float) $transactions
            ->where('type', $type)
            ->filter(fn ($transaction) =>
                $transaction->transaction_date->gte($from)
                && $transaction->transaction_date->lte($to)
            )
            ->sum(fn ($transaction) => (float) $transaction->amount), 2);
    }

    private function getExpenseCategories(
        EloquentCollection $transactions,
        Carbon $today,
        Carbon $yearStart
    ): array
    {
        $monthStart = $today->copy()->startOfMonth();
        $monthlyExpenses = $transactions
            ->where('type', 'expense')
            ->filter(fn ($transaction) =>
                $transaction->transaction_date->gte($monthStart)
                && $transaction->transaction_date->lte($today)
            );
        $monthly = (float) $monthlyExpenses
            ->sum(fn ($transaction) => (float) $transaction->amount);
        $yearly = $this->sumTransactions($transactions, 'expense', $yearStart, $today);

        $categories = $monthlyExpenses
            ->groupBy('category_id')
            ->map(function ($items, $categoryId) use ($monthly) {
                $amount = (float) $items
                    ->sum(fn ($item) => (float) $item->amount);

                return [
                    'id' => $categoryId === '' ? null : $categoryId,
                    'name' => $items->first()->category?->name ?? 'Uncategorized',
                    'amount' => round($amount, 2),
                    'percentage' => $monthly > 0
                        ? round(($amount / $monthly) * 100, 2)
                        : 0,
                ];
            })
            ->sortByDesc('amount')
            ->values()
            ->all();

        $elapsedDays = $yearStart->diffInDays($today) + 1;
        $elapsedMonths = $yearStart->diffInMonths($today) + 1;

        return [
            'categories' => $categories,
            'average_daily' => $elapsedDays > 0 ? round($yearly / $elapsedDays, 2) : 0,
            'average_monthly' => $elapsedMonths > 0 ? round($yearly / $elapsedMonths, 2) : 0,
            'ytd_yearly' => $yearly,
        ];
    }

    private function getRecentTransactions($user, EloquentCollection $accounts): array
    {
        return $user->transactions()
            ->with('category')
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->limit(4)
            ->get()
            ->map(function ($transaction) use ($accounts) {
                $account = $accounts->firstWhere('id', $transaction->account_id);

                return [
                    'id' => $transaction->id,
                    'title' => $transaction->title,
                    'date' => Carbon::parse($transaction->transaction_date)->format('d M Y'),
                    'category' => $transaction->category?->name,
                    'account' => $account?->name,
                    'account_type' => $account?->type,
                    'amount' => (float) $transaction->amount,
                    'currency' => $account?->currency ?? 'BDT',
                    'type' => $transaction->type,
                ];
            })
            ->all();
    }

    private function getBudgets(
        EloquentCollection $budgets,
        EloquentCollection $transactions,
        Carbon $today
    ): array
    {
        $daily = $this->getActiveBudget($budgets, 'daily');
        $monthly = $this->getActiveBudget($budgets, 'monthly');
        $quarterly = $this->getActiveBudget($budgets, 'quarterly');

        $dailySpent = $this->sumTransactions(
            $transactions,
            'expense',
            $today->copy()->startOfDay(),
            $today
        );

        $monthlySpent = $this->sumTransactions(
            $transactions,
            'expense',
            $today->copy()->startOfMonth(),
            $today
        );

        $quarterlyStart = $today->copy()->startOfQuarter();

        $quarterlySpent = $this->sumTransactions(
            $transactions,
            'expense',
            $quarterlyStart,
            $today
        );

        return [
            'daily' => $this->formatBudget(
                (float) ($daily?->amount ?? 0),
                $dailySpent
            ),

            'monthly' => $this->formatBudget(
                (float) ($monthly?->amount ?? 0),
                $monthlySpent
            ),

            'quarterly' => $this->formatBudget(
                (float) ($quarterly?->amount ?? 0),
                $quarterlySpent
            ),
        ];
    }

    private function getActiveBudget(EloquentCollection $budgets, string $period)
    {
        return $budgets
            ->where('period', $period)
            ->sortByDesc('start_date')
            ->first();
    }

    private function formatBudget(float $budget, float $spent): array
    {
        $remaining = $budget - $spent;

        return [
            'budget' => round($budget, 2),
            'spent' => round($spent, 2),
            'remaining' => round($remaining, 2),
            'spent_percentage' => $budget > 0
                ? round(($spent / $budget) * 100, 2)
                : 0,
        ];
    }

    private function getObligations(EloquentCollection $obligations): array
    {
        return [
            'lent' => round(
                (float) $obligations
                    ->where('type', 'lending')
                    ->sum('amount'),
                2
            ),

            'borrowed' => round(
                (float) $obligations
                    ->where('type', 'borrowing')
                    ->sum('amount'),
                2
            ),
        ];
    }

    private function percentageChange(float $previous, float $current): float
    {
        if ($previous == 0) {
            if ($current == 0) {
                return 0;
            }

            return $current > 0 ? 100 : -100;
        }

        return round((($current - $previous) / abs($previous)) * 100, 2);
    }
}