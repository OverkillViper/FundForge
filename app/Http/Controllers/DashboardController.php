<?php

namespace App\Http\Controllers;

use App\Services\SavingsCertificateService;
use Carbon\Carbon;
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

        return Inertia::render('Dashboard', [
            'totalBalance' => $this->getTotalBalance($user, $today, $lastMonth),
            'transactionSummary' => $this->getTransactionSummary($user, $thisMonth, $today, $lastMonth),
            'expenseCategories' => $this->getExpenseCategories($user, $today),
            'recentTransactions' => $this->getRecentTransactions($user),
            'budgets' => $this->getBudgets($user, $today),
            'obligations' => $this->getObligations($user),
        ]);
    }

    private function getTotalBalance($user, Carbon $today, Carbon $lastMonth): array
    {
        $accounts = $user->accounts()
            ->where('is_active', true)
            ->get();

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

        $hasPreviousMonthActivity = $user->transactions()
            ->whereBetween('transaction_date', [
                $lastMonth->toDateString(),
                $lastMonth->copy()->endOfMonth()->toDateString(),
            ])
            ->exists();

        $lastMonthBalance = $hasPreviousMonthActivity
            ? (float) $accounts->sum(
                fn ($account) => $this->getAccountBalanceAtDate(
                    $account,
                    $lastMonth->copy()->endOfMonth()
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

    private function getAccountBalanceAtDate($account, Carbon $date): float
    {
        $transactions = $account->transactions()
            ->whereDate('transaction_date', '<=', $date)
            ->get(['type', 'amount']);

        $balance = (float) $account->opening_balance;

        foreach ($transactions as $transaction) {
            $amount = (float) $transaction->amount;

            $balance += match ($transaction->type) {
                'income', 'borrowing' => $amount,
                'expense', 'investment', 'lending' => -$amount,
                default => 0,
            };
        }

        return round($balance, 2);
    }

    private function getTransactionSummary($user, Carbon $thisMonth, Carbon $today, Carbon $lastMonth): array
    {
        $lastMonthEnd = $lastMonth->copy()->endOfMonth();

        $income = $this->getIncome($user, $thisMonth, $today);
        $lastIncome = $this->getIncome($user, $lastMonth, $lastMonthEnd);

        $expense = $this->getExpense($user, $thisMonth, $today);
        $lastExpense = $this->getExpense($user, $lastMonth, $lastMonthEnd);

        $investment = $this->getInvestment($user, $thisMonth, $today);
        $lastInvestment = $this->getInvestment($user, $lastMonth, $lastMonthEnd);

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

    private function getIncome($user, Carbon $from, Carbon $to): float
    {
        $transactionIncome = (float) $user->transactions()
            ->where('type', 'income')
            ->whereBetween('transaction_date', [
                $from->toDateString(),
                $to->toDateString(),
            ])
            ->sum('amount');

        $interest = $this->savingsCertificateService
            ->getCurrentMonthInterestSummary(
                $user->id,
                $from
            );

        return round($transactionIncome + $interest['net_interest'], 2);
    }

    private function getExpense($user, Carbon $from, Carbon $to): float
    {
        return round(
            (float) $user->transactions()
                ->where('type', 'expense')
                ->whereBetween('transaction_date', [
                    $from->toDateString(),
                    $to->toDateString(),
                ])
                ->sum('amount'),
            2
        );
    }

    private function getInvestment($user, Carbon $from, Carbon $to): float
    {
        return round(
            (float) $user->transactions()
                ->where('type', 'investment')
                ->whereBetween('transaction_date', [
                    $from->toDateString(),
                    $to->toDateString(),
                ])
                ->sum('amount'),
            2
        );
    }

    private function getExpenseCategories($user, Carbon $today): array
    {
        $monthStart = $today->copy()->startOfMonth();
        $yearStart = $today->copy()->startOfYear();

        $monthly = $this->getExpense($user, $monthStart, $today);
        $yearly = $this->getExpense($user, $yearStart, $today);

        $categories = $user->transactions()
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [
                $monthStart->toDateString(),
                $today->toDateString(),
            ])
            ->with('category')
            ->selectRaw('category_id, SUM(amount) as amount')
            ->groupBy('category_id')
            ->orderByDesc('amount')
            ->get()
            ->map(function ($item) use ($monthly) {
                $amount = (float) $item->amount;

                return [
                    'id' => $item->category_id,
                    'name' => $item->category?->name ?? 'Uncategorized',
                    'amount' => round($amount, 2),
                    'percentage' => $monthly > 0
                        ? round(($amount / $monthly) * 100, 2)
                        : 0,
                ];
            })
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

    private function getRecentTransactions($user): array
    {
        return $user->transactions()
            ->with(['category', 'account'])
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->limit(4)
            ->get()
            ->map(fn ($transaction) => [
                'id' => $transaction->id,
                'title' => $transaction->title,
                'date' => Carbon::parse($transaction->transaction_date)->format('d M Y'),
                'category' => $transaction->category?->name,
                'account' => $transaction->account?->name,
                'account_type' => $transaction->account?->type,
                'amount' => (float) $transaction->amount,
                'currency' => $transaction->account?->currency ?? 'BDT',
                'type' => $transaction->type,
            ])
            ->all();
    }

    private function getBudgets($user, Carbon $today): array
    {
        $daily = $this->getActiveBudget($user, 'daily', $today);
        $monthly = $this->getActiveBudget($user, 'monthly', $today);
        $quarterly = $this->getActiveBudget($user, 'quarterly', $today);

        $dailySpent = $this->getExpense(
            $user,
            $today->copy()->startOfDay(),
            $today
        );

        $monthlySpent = $this->getExpense(
            $user,
            $today->copy()->startOfMonth(),
            $today
        );

        $quarterlyStart = $today->copy()->startOfQuarter();

        $quarterlySpent = $this->getExpense(
            $user,
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

    private function getActiveBudget($user, string $period, Carbon $date)
    {
        return $user->budgets()
            ->where('period', $period)
            ->whereDate('start_date', '<=', $date)
            ->where(function ($query) use ($date) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $date);
            })
            ->latest('start_date')
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

    private function getObligations($user): array
    {
        $obligations = $user->obligations()
            ->where('is_settled', false)
            ->get();

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