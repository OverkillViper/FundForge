<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Transaction;
use App\Models\Budget;


class BudgetController extends Controller
{
    /**
     * Display all budgets.
     */
    public function index(): Response
    {
        $today = Carbon::today();
        $userId = auth()->id();

        $budgets = Budget::query()
            ->where('user_id', $userId)
            ->orderByDesc('start_date')
            ->get();

        $currentBudgets = [
            'daily' => $this->prepareCurrentBudget(
                $budgets->first(fn ($budget) =>
                    $budget->period === 'daily' &&
                    Carbon::parse($budget->start_date)->lte($today) &&
                    ($budget->end_date === null || Carbon::parse($budget->end_date)->gte($today))
                )
            ),

            'monthly' => $this->prepareCurrentBudget(
                $budgets->first(fn ($budget) =>
                    $budget->period === 'monthly' &&
                    Carbon::parse($budget->start_date)->lte($today) &&
                    ($budget->end_date === null || Carbon::parse($budget->end_date)->gte($today))
                )
            ),

            'quarterly' => $this->prepareCurrentBudget(
                $budgets->first(fn ($budget) =>
                    $budget->period === 'quarterly' &&
                    Carbon::parse($budget->start_date)->lte($today) &&
                    ($budget->end_date === null || Carbon::parse($budget->end_date)->gte($today))
                )
            ),
        ];

        return Inertia::render('Budget/Index', [
            'currentBudgets' => $currentBudgets,
        ]);
    }

    private function prepareCurrentBudget(?Budget $budget): ?array
    {
        if (!$budget) {
            return null;
        }

        $today = Carbon::today();

        if ($budget->period === 'daily') {
            $spentFrom = $today;
            $spentTo = $today;
        } else {
            $spentFrom = Carbon::parse($budget->start_date);
            $spentTo = Carbon::parse($budget->end_date);
        }

        $spent = Transaction::query()
            ->where('user_id', auth()->id())
            ->where('type', 'expense')
            ->whereDate('transaction_date', '>=', $spentFrom)
            ->whereDate('transaction_date', '<=', $spentTo)
            ->sum('amount');

        $amount = (float) $budget->amount;
        $spent = (float) $spent;

        return [
            'id' => $budget->id,
            'period' => $budget->period,
            'amount' => $amount,
            'start_date' => $budget->start_date,
            'end_date' => $budget->end_date,
            'spent' => $spent,
            'remaining' => $amount - $spent,
        ];
    }

    /**
     * Show the form for creating a new budget.
     */
    public function create(int $serial): Response
    {
        return Inertia::render('Budget/Create', [
            'serial' => $serial,
        ]);
    }

    /**
     * Store a new budget or overwrite an existing budget
     * for the same period and start date.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'period' => ['required', 'in:daily,monthly,quarterly'],
            'amount' => ['required', 'numeric', 'gt:0'],
        ]);

        $today = Carbon::today();

        switch ($validated['period']) {
            case 'daily':
                $startDate = $today;
                $endDate = null;
                break;

            case 'monthly':
                $startDate = $today->copy()->startOfMonth();
                $endDate = $today->copy()->endOfMonth();
                break;

            case 'quarterly':
                $startDate = $today->copy()->startOfQuarter();
                $endDate = $today->copy()->endOfQuarter();
                break;

            default:
                abort(422);
        }

        if ($validated['period'] === 'daily') {
            Budget::updateOrCreate(
                [
                    'user_id' => auth()->id(),
                    'period' => 'daily',
                    'end_date' => null,
                ],
                [
                    'start_date' => $startDate->toDateString(),
                    'amount' => $validated['amount'],
                ]
            );
        } else {
            Budget::updateOrCreate(
                [
                    'user_id' => auth()->id(),
                    'period' => $validated['period'],
                    'start_date' => $startDate->toDateString(),
                ],
                [
                    'amount' => $validated['amount'],
                    'end_date' => $endDate?->toDateString(),
                ]
            );
        }

        return redirect()
            ->route('budgets.index')
            ->with(
                'success',
                ucfirst($validated['period']) . ' budget saved successfully.'
            );
    }

    /**
     * Show the form for editing a budget.
     */
    public function edit(Budget $budget): Response
    {
        abort_unless(
            $budget->user_id === auth()->id(),
            404
        );

        return Inertia::render('Budget/Edit', [
            'budget' => $budget,
        ]);
    }

    /**
     * Update an existing budget.
     */
    public function update(Request $request, Budget $budget): RedirectResponse
    {
        abort_unless($budget->user_id === auth()->id(), 404);

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'gt:0'],
        ]);

        $budget->update([
            'amount' => $validated['amount'],
        ]);

        return redirect()
            ->route('budgets.index')
            ->with(
                'success',
                ucfirst($budget->period) . ' budget updated successfully.'
            );
    }

    /**
     * Delete a budget.
     */
    public function destroy(Budget $budget): RedirectResponse
    {
        abort_unless(
            $budget->user_id === auth()->id(),
            404
        );

        $budget->delete();

        return redirect()
            ->route('budgets.index')
            ->with(
                'success',
                ucfirst($budget->period) . ' budget deleted successfully.'
            );
    }
}