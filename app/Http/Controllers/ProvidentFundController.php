<?php

namespace App\Http\Controllers;

use App\Models\ProvidentFund;
use App\Models\ProvidentFundContribution;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProvidentFundController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Provident Fund
    |--------------------------------------------------------------------------
    */

    public function show(): Response
    {
        $providentFund = auth()->user()
            ->providentFund()
            ->with([
                'employerRates' => function ($query) {
                    $query->orderBy('boundary_years');
                },

                'contributions' => function ($query) {
                    $query->orderByDesc('contribution_date');
                },
            ])
            ->withSum('contributions', 'amount')
            ->withCount('contributions')
            ->first();

        if (! $providentFund) {
            return Inertia::render(
                'Investments/ProvidentFund/Create'
            );
        }

        $calculation = $this->calculateProvidentFundValue(
            $providentFund
        );

        return Inertia::render(
            'Investments/ProvidentFund/Show',
            [
                'providentFund' => $providentFund,
                'calculation' => $calculation,
            ]
        );
    }

    public function store(Request $request): RedirectResponse
    {
        if (
            auth()->user()
                ->providentFund()
                ->exists()
        ) {
            abort(
                409,
                'You already have a provident fund.'
            );
        }

        $validated = $request->validate([
            'start_date' => [
                'required',
                'date',
            ],

            'employer_rates' => [
                'required',
                'array',
                'min:1',
            ],

            'employer_rates.*.boundary_years' => [
                'required',
                'integer',
                'min:0',
            ],

            'employer_rates.*.employer_rate' => [
                'required',
                'numeric',
                'min:0',
                'max:100',
            ],
        ]);

        $this->validateEmployerRates(
            $validated['employer_rates']
        );

        DB::transaction(function () use ($validated) {
            $providentFund = auth()->user()
                ->providentFund()
                ->create([
                    'start_date' => $validated['start_date'],
                ]);

            $providentFund
                ->employerRates()
                ->createMany(
                    $validated['employer_rates']
                );
        });

        return redirect()
            ->route('investments.provident-fund.show')
            ->with(
                'success',
                'Provident fund created successfully.'
            );
    }

    public function edit(): Response
    {
        $providentFund = auth()->user()
            ->providentFund()
            ->with([
                'employerRates' => fn ($query) =>
                    $query->orderBy('boundary_years'),
            ])
            ->firstOrFail();

        return Inertia::render(
            'Investments/ProvidentFund/Edit',
            [
                'providentFund' => $providentFund,
            ]
        );
    }

    public function update(
        Request $request
    ): RedirectResponse {
        $providentFund = $this->getProvidentFund();

        $validated = $request->validate([
            'start_date' => [
                'required',
                'date',
            ],
        ]);

        $providentFund->update([
            'start_date' => $validated['start_date'],
        ]);

        return redirect()
            ->route('investments.provident-fund.show')
            ->with(
                'success',
                'Provident fund updated successfully.'
            );
    }

    public function destroy(): RedirectResponse
    {
        $providentFund = $this->getProvidentFund();

        $providentFund->delete();

        return redirect()
            ->route('investments.index')
            ->with(
                'success',
                'Provident fund deleted successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Contributions
    |--------------------------------------------------------------------------
    */

    public function storeContribution(
        Request $request
    ): RedirectResponse {
        $providentFund = $this->getProvidentFund();

        $validated = $request->validate([
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
            ],

            'contribution_date' => [
                'required',
                'date',
            ],
        ]);

        $providentFund
            ->contributions()
            ->create([
                'amount' => $validated['amount'],
                'contribution_date' => $validated['contribution_date'],
            ]);

        return back()->with(
            'success',
            'Provident fund contribution recorded successfully.'
        );
    }

    public function updateContribution(
        Request $request,
        ProvidentFundContribution $contribution
    ): RedirectResponse {
        $providentFund = $this->getProvidentFund();

        abort_unless(
            $contribution->provident_fund_id === $providentFund->id,
            403
        );

        $validated = $request->validate([
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
            ],

            'contribution_date' => [
                'required',
                'date',
            ],
        ]);

        $contribution->update([
            'amount' => $validated['amount'],
            'contribution_date' => $validated['contribution_date'],
        ]);

        return back()->with(
            'success',
            'Provident fund contribution updated successfully.'
        );
    }

    public function destroyContribution(
        ProvidentFundContribution $contribution
    ): RedirectResponse {
        $providentFund = $this->getProvidentFund();

        abort_unless(
            $contribution->provident_fund_id === $providentFund->id,
            403
        );

        $contribution->delete();

        return back()->with(
            'success',
            'Provident fund contribution deleted successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Employer Rates
    |--------------------------------------------------------------------------
    */

    public function rates(): Response
    {
        $providentFund = $this->getProvidentFund();

        $providentFund->load([
            'employerRates' => function ($query) {
                $query->orderBy('boundary_years');
            },
        ]);

        return Inertia::render(
            'Investments/ProvidentFund/Rates',
            [
                'providentFund' => $providentFund,
            ]
        );
    }

    public function updateRates(
        Request $request
    ): RedirectResponse {
        $providentFund = $this->getProvidentFund();

        $validated = $request->validate([
            'employer_rates' => [
                'required',
                'array',
                'min:1',
            ],

            'employer_rates.*.boundary_years' => [
                'required',
                'integer',
                'min:0',
            ],

            'employer_rates.*.employer_rate' => [
                'required',
                'numeric',
                'min:0',
                'max:100',
            ],
        ]);

        $this->validateEmployerRates(
            $validated['employer_rates']
        );

        DB::transaction(function () use (
            $providentFund,
            $validated
        ) {
            $providentFund
                ->employerRates()
                ->delete();

            $providentFund
                ->employerRates()
                ->createMany(
                    $validated['employer_rates']
                );
        });

        return back()->with(
            'success',
            'Provident fund employer rates updated successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Calculations
    |--------------------------------------------------------------------------
    */

    private function calculateProvidentFundValue(ProvidentFund $providentFund): array
    {
        $providentFund->loadMissing([
            'contributions',
            'employerRates',
        ]);

        $employeeContribution = round(
            (float) $providentFund->contributions->sum('amount'),
            2
        );

        // Completed whole years only.
        $elapsedYears = (int) $providentFund->start_date->diffInYears(now());

        $employerRate = (float) (
            $providentFund
                ->employerRates()
                ->where('boundary_years', '<=', $elapsedYears)
                ->orderByDesc('boundary_years')
                ->value('employer_rate')
            ?? 0
        );

        $employerContribution = round(
            $employeeContribution * ($employerRate / 100),
            2
        );

        $totalContribution = round(
            $employeeContribution + $employerContribution,
            2
        );

        return [
            'employee_contribution' => $employeeContribution,
            'employer_rate' => $employerRate,
            'employer_contribution' => $employerContribution,
            'total_contribution' => $totalContribution,
            'total_value' => $totalContribution,
            'elapsed_years' => $elapsedYears,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    private function validateEmployerRates(
        array $rates
    ): void {
        $boundaries = array_column(
            $rates,
            'boundary_years'
        );

        /*
         * Every boundary must be unique.
         */
        if (
            count($boundaries) !== count(
                array_unique($boundaries)
            )
        ) {
            abort(
                422,
                'Each employer-rate boundary must be unique.'
            );
        }

        /*
         * A 0-year boundary establishes the
         * default rate before the first threshold.
         *
         * Example:
         *
         * 0  -> 0%
         * 2  -> 100%
         * 3  -> 50%
         */

        foreach ($rates as $rate) {
            if (
                ! isset($rate['boundary_years'])
                || ! isset($rate['employer_rate'])
            ) {
                abort(
                    422,
                    'Invalid employer-rate configuration.'
                );
            }
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    private function getProvidentFund(): ProvidentFund
    {
        $providentFund = auth()->user()
            ->providentFund()
            ->first();

        abort_unless(
            $providentFund,
            404,
            'Provident fund not found.'
        );

        return $providentFund;
    }
}