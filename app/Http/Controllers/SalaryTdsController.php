<?php

namespace App\Http\Controllers;

use App\Models\SalaryTds;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;

class SalaryTdsController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $startIncomeYear = 2023;
        $selectedIncomeYear = $request->integer('year', now()->year - 1);
        $toYear = $selectedIncomeYear + 1;

        $salaryTds = $user->salaryTds()
            ->whereBetween('date', [
                "{$selectedIncomeYear}-07-01",
                "{$toYear}-06-30",
            ])
            ->orderBy('date')
            ->get();

        return Inertia::render('IncomeTaxes/SalaryTds/Index', [
            'startIncomeYear' => $startIncomeYear,
            'selectedIncomeYear' => $selectedIncomeYear,
            'salaryTds' => $salaryTds,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render(
            'IncomeTaxes/SalaryTds/Create'
        );
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => [
                'required',
                'date',
                Rule::unique('salary_tds', 'date')
                    ->where('user_id', auth()->id()),
            ],
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
            ],
        ]);

        /*
         * TDS is monthly, so always normalize the
         * date to the first day of the month.
         */
        $date = \Carbon\Carbon::parse($validated['date'])
            ->startOfMonth()
            ->toDateString();

        auth()->user()
            ->salaryTds()
            ->create([
                'date' => $date,
                'amount' => $validated['amount'],
            ]);

        return redirect()
            ->route('salary-tds.index')
            ->with('success', 'Salary TDS added successfully.');
    }

    public function edit(SalaryTds $salaryTds): Response
    {
        $this->authorizeSalaryTds($salaryTds);

        return Inertia::render(
            'IncomeTaxes/SalaryTds/Edit',
            [
                'salaryTds' => $salaryTds,
            ]
        );
    }

    public function update(
        Request $request,
        SalaryTds $salaryTds
    ): RedirectResponse {
        $this->authorizeSalaryTds($salaryTds);

        $validated = $request->validate([
            'date' => [
                'required',
                'date',
                Rule::unique('salary_tds', 'date')
                    ->where('user_id', auth()->id())
                    ->ignore($salaryTds->id),
            ],
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
            ],
        ]);

        $date = \Carbon\Carbon::parse($validated['date'])
            ->startOfMonth()
            ->toDateString();

        $salaryTds->update([
            'date' => $date,
            'amount' => $validated['amount'],
        ]);

        return redirect()
            ->route('salary-tds.index')
            ->with('success', 'Salary TDS updated successfully.');
    }

    public function destroy(
        SalaryTds $salaryTds
    ): RedirectResponse {
        $this->authorizeSalaryTds($salaryTds);

        $salaryTds->delete();

        return redirect()
            ->route('salary-tds.index')
            ->with('success', 'Salary TDS deleted successfully.');
    }

    private function authorizeSalaryTds(
        SalaryTds $salaryTds
    ): void {
        abort_unless(
            $salaryTds->user_id === auth()->id(),
            403
        );
    }
}