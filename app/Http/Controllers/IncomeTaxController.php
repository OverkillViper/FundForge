<?php

namespace App\Http\Controllers;

use App\Services\IncomeTax\IncomeTaxCalculator;
use App\Services\IncomeTax\TotalIncomeCalculator;
use App\Services\IncomeTax\RebateCalculator;
use App\Services\IncomeTax\EligibleInvestmentCalculator;
use App\Services\IncomeTax\FinalTaxCalculator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;

class IncomeTaxController extends Controller
{
    public function __construct(
        private TotalIncomeCalculator $totalIncomeCalculator,
        private IncomeTaxCalculator $incomeTaxCalculator,
        private RebateCalculator $rebateCalculator,
        private EligibleInvestmentCalculator $eligibleInvestmentCalculator,
        private FinalTaxCalculator $finalTaxCalculator,
    ) {}


    public function index(Request $request): Response
    {
        $user = $request->user();

        /*
        |--------------------------------------------------------------------------
        | Income Year
        |--------------------------------------------------------------------------
        */

        $startIncomeYear = 2023;
        $selectedIncomeYear = $request->integer('year', now()->year - 1);
        $toYear = $selectedIncomeYear + 1;

        /*
        |--------------------------------------------------------------------------
        | Existing Income Tax Record
        |--------------------------------------------------------------------------
        */

        $incomeTax = $user->incomeTaxes()
            ->where('from_year', $selectedIncomeYear)
            ->where('to_year', $toYear)
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Initialize Calculations
        |--------------------------------------------------------------------------
        */

        $totalIncome = null;
        $tax = null;
        $eligibleInvestment = null;
        $rebate = null;
        $finalTax = null;

        /*
        |--------------------------------------------------------------------------
        | Total Income
        |--------------------------------------------------------------------------
        */

        if ($incomeTax) {
            $totalIncome = $this->totalIncomeCalculator->calculate($user, $incomeTax);
        }

        /*
        |--------------------------------------------------------------------------
        | Gross Tax Liability
        |--------------------------------------------------------------------------
        */

        if ($totalIncome !== null && $totalIncome['taxable_total'] !== null) {
            $taxableIncome = (float) $totalIncome['taxable_total'];

            $tax = $this->incomeTaxCalculator->calculate(
                taxableIncome: $taxableIncome
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Eligible Investment
        |--------------------------------------------------------------------------
        */

        if ($incomeTax) {
            $eligibleInvestment = $this->eligibleInvestmentCalculator->calculate(
                $user,
                $incomeTax
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Tax Rebate
        |--------------------------------------------------------------------------
        */

        if (
            $totalIncome !== null
            && $totalIncome['taxable_total'] !== null
            && $eligibleInvestment !== null
            && $user->settings
        ) {
            $taxableIncome = (float) $totalIncome['taxable_total'];

            $rebate = $this->rebateCalculator->calculate(
                taxableIncome: $taxableIncome,
                eligibleInvestment: (float) $eligibleInvestment['eligible_total'],
                settings: $user->settings
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Final Tax
        |--------------------------------------------------------------------------
        |
        | Final tax is:
        |
        | Gross tax liability
        | - tax rebate
        | - salary TDS
        | - Savings Certificate TDS
        | - bank TDS
        |
        */

        if (
            $incomeTax
            && $tax !== null
            && $rebate !== null
        ) {
            $finalTax = $this->finalTaxCalculator->calculate(
                user: $user,
                incomeTax: $incomeTax,
                taxLiability: (float) $tax['tax_liability'],
                taxRebate: (float) $rebate['rebate']
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Inertia Response
        |--------------------------------------------------------------------------
        */

        return Inertia::render('IncomeTaxes/Index', [
            'startIncomeYear' => $startIncomeYear,
            'selectedIncomeYear' => $selectedIncomeYear,
            'incomeTax' => $incomeTax,
            'salaryEffectiveMonth' => $user->settings?->salary_effective_month,
            'providentFundPercentage' => $user->settings?->provident_fund_percentage,
            'rebatePercentage' => $user->settings?->rebate_percentage,
            'dpsInvestmentCap' => $user->settings?->dps_investment_cap,
            'maxRebateCap' => $user->settings?->max_rebate_cap,
            'providentFund' => $user->providentFund,
            'totalIncome' => $totalIncome,
            'tax' => $tax,
            'eligibleInvestment' => $eligibleInvestment,
            'rebate' => $rebate,
            'finalTax' => $finalTax,
        ]);
    }

    public function store(Request $request): RedirectResponse 
    {
        $user = $request->user();

        $validated = $request->validate([
            'from_year' => [
                'required',
                'integer',
                'min:2000',
            ],

            'to_year' => [
                'required',
                'integer',
                'gte:from_year',
            ],

            'previous_salary' => [
                'required',
                'numeric',
                'min:0',
            ],

            'current_salary' => [
                'required',
                'numeric',
                'min:0',
            ],

            'festival_bonus' => [
                'required',
                'numeric',
                'min:0',
            ],

            'other_bonus' => [
                'required',
                'numeric',
                'min:0',
            ],

            'net_bank_interest' => [
                'required',
                'numeric',
                'min:0',
            ],

            'net_bank_tds' => [
                'required',
                'numeric',
                'min:0',
            ],

            'net_bank_charges' => [
                'required',
                'numeric',
                'min:0',
            ],
        ]);

        $incomeTax = DB::transaction(function () use (
            $user,
            $validated
        ) {
            return $user->incomeTaxes()->updateOrCreate(
                [
                    'from_year' => $validated['from_year'],
                    'to_year' => $validated['to_year'],
                ],
                [
                    'previous_salary' =>
                        $validated['previous_salary'],

                    'current_salary' =>
                        $validated['current_salary'],

                    'festival_bonus' =>
                        $validated['festival_bonus'],

                    'other_bonus' =>
                        $validated['other_bonus'],

                    'net_bank_interest' =>
                        $validated['net_bank_interest'],

                    'net_bank_tds' =>
                        $validated['net_bank_tds'],

                    'net_bank_charges' =>
                        $validated['net_bank_charges'],
                ]
            );
        });

        return redirect()
            ->route(
                'income-taxes.index',
                [
                    'year' => $incomeTax->from_year,
                ]
            )
            ->with(
                'success',
                'Income tax information saved successfully.'
            );
    }
}