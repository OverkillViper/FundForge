<?php

namespace App\Services\IncomeTax;

use App\Models\IncomeTax;
use App\Models\User;
use App\Services\SavingsCertificateService;
use Carbon\Carbon;

class TotalIncomeCalculator
{
    public function __construct(
        protected SavingsCertificateService $savingsCertificateService
    ) {}

    /**
     * Calculate total income for a July-June income year.
     *
     * Calculation:
     *
     * Salary Income
     *      ↓
     * Salary Exemption
     *      ↓
     * Taxable Salary Income
     *
     * Taxable Total Income
     * = Taxable Salary Income
     * + Bank Income
     * + Gross Savings Certificate Interest
     */
    public function calculate(
        User $user,
        IncomeTax $incomeTax
    ): array {
        /*
         * Calculate total salary income first.
         */
        $salary = $this->calculateSalaryIncome(
            $user,
            $incomeTax
        );

        /*
         * Calculate salary exemption.
         *
         * Exemption =
         * lower of:
         *
         * - 1/3 of salary income
         * - ৳500,000
         */
        $salaryExemption =
            $this->calculateSalaryExemption(
                $salary
            );

        /*
         * Taxable salary income is salary income
         * after applying the exemption.
         */
        $taxableSalary =
            round(
                $salary - $salaryExemption,
                2
            );

        /*
         * Calculate bank income.
         */
        $bank = $this->calculateBankIncome(
            $incomeTax
        );

        /*
         * Calculate gross Savings Certificate interest.
         *
         * Gross interest is used because total income
         * is calculated before TDS.
         */
        $savingsCertificate =
            $this->calculateSavingsCertificateInterest(
                $user,
                $incomeTax
            );

        $warnings = $savingsCertificate['warnings'];

        /*
         * If any Savings Certificate is missing its
         * final-year rate, the taxable total income
         * cannot be calculated completely.
         */
        $taxableTotal = null;

        if ($savingsCertificate['gross_interest'] !== null) {
            $taxableTotal = round(
                $taxableSalary
                + $bank
                + $savingsCertificate['gross_interest'],
                2
            );
        }

        return [
            /*
             * Salary section.
             */
            'salary' => round(
                $salary,
                2
            ),

            'salary_exemption' => round(
                $salaryExemption,
                2
            ),

            'taxable_salary' => round(
                $taxableSalary,
                2
            ),

            /*
             * Other income.
             */
            'bank' => round(
                $bank,
                2
            ),

            'savings_certificate_interest' =>
                $savingsCertificate['gross_interest'],

            /*
             * Final taxable income.
             */
            'taxable_total' => $taxableTotal,

            /*
             * Keep total as an alias for compatibility
             * if the frontend currently expects `total`.
             */
            'total' => $taxableTotal,

            'warnings' => $warnings,
        ];
    }

    /**
     * Calculate salary exemption.
     *
     * Exemption =
     * lower of:
     *
     * - 1/3 of salary income
     * - ৳500,000
     */
    private function calculateSalaryExemption(
        float $salary
    ): float {
        if ($salary <= 0) {
            return 0.0;
        }

        $oneThird =
            $salary / 3;

        return round(
            min(
                $oneThird,
                500000
            ),
            2
        );
    }

    /**
     * Calculate total salary income.
     *
     * Salary income consists of:
     *
     * - Previous salary
     * - Current salary
     * - Festival bonus
     * - Other bonus
     * - Employer provident fund contribution
     */
    private function calculateSalaryIncome(
        User $user,
        IncomeTax $incomeTax
    ): float {
        $salaryMonths = $this->getSalaryMonths($user);

        $previousSalary =
            (float) $incomeTax->previous_salary;

        $currentSalary =
            (float) $incomeTax->current_salary;

        $festivalBonus =
            (float) $incomeTax->festival_bonus;

        $otherBonus =
            (float) $incomeTax->other_bonus;

        $salaryIncome =
            ($previousSalary * $salaryMonths['previous'])
            + ($currentSalary * $salaryMonths['current'])
            + $festivalBonus
            + $otherBonus;

        $employerPfContribution =
            $this->calculateEmployerPfContribution(
                $user,
                $incomeTax
            );

        return round(
            $salaryIncome + $employerPfContribution,
            2
        );
    }

    /**
     * Determine the number of previous/current salary months
     * in the July-June income year.
     *
     * Example:
     *
     * Salary effective month = January
     *
     * July-December = previous salary = 6 months
     * January-June   = current salary  = 6 months
     */
    private function getSalaryMonths(
        User $user
    ): array {
        $salaryEffectiveMonth =
            $user->settings?->salary_effective_month;

        /*
         * If no salary-effective month is configured,
         * treat the entire year as previous salary.
         */
        if (!$salaryEffectiveMonth) {
            return [
                'previous' => 12,
                'current' => 0,
            ];
        }

        $effectivePosition =
            $this->incomeYearMonthPosition(
                (int) $salaryEffectiveMonth
            );

        return [
            'previous' => $effectivePosition,
            'current' => 12 - $effectivePosition,
        ];
    }

    /**
     * Calculate employer provident fund contribution
     * for the selected income year.
     *
     * Rules:
     *
     * - No PF record => no employer contribution.
     * - PF starts after the selected income year => no contribution.
     * - PF starts before the income year => all 12 months covered.
     * - Basic salary = 50% of salary.
     * - Employer PF = basic salary × PF percentage.
     * - Salary can change during the income year.
     */
    private function calculateEmployerPfContribution(
        User $user,
        IncomeTax $incomeTax
    ): float {
        $providentFund = $user->providentFund;
        $settings = $user->settings;

        if (!$providentFund || !$settings) {
            return 0.0;
        }

        $pfStartDate = Carbon::parse(
            $providentFund->start_date
        );

        $incomeYearStart = Carbon::create(
            (int) $incomeTax->from_year,
            7,
            1
        );

        $incomeYearEnd = Carbon::create(
            (int) $incomeTax->to_year,
            6,
            30
        );

        /*
         * PF starts after this income year.
         */
        if ($pfStartDate->gt($incomeYearEnd)) {
            return 0.0;
        }

        /*
         * Determine the first income-year month covered
         * by the PF.
         *
         * If PF started before the income year,
         * all 12 months are covered.
         */
        if ($pfStartDate->lt($incomeYearStart)) {
            $pfStartPosition = 0;
        } else {
            $pfStartPosition =
                $this->incomeYearMonthPosition(
                    $pfStartDate->month
                );
        }

        $salaryEffectivePosition =
            $this->incomeYearMonthPosition(
                (int) $settings->salary_effective_month
            );

        /*
         * Salary months covered by PF before the
         * salary-effective month.
         */
        $previousSalaryMonths = 0;

        if (
            $salaryEffectivePosition >
            $pfStartPosition
        ) {
            $previousSalaryMonths =
                $salaryEffectivePosition
                - $pfStartPosition;
        }

        /*
         * Salary months covered by PF from the
         * salary-effective month through June.
         */
        $currentSalaryMonths =
            12 - max(
                $salaryEffectivePosition,
                $pfStartPosition
            );

        /*
         * If salary changed before PF started,
         * every PF-covered month uses current salary.
         */
        if (
            $salaryEffectivePosition <=
            $pfStartPosition
        ) {
            $previousSalaryMonths = 0;

            $currentSalaryMonths =
                12 - $pfStartPosition;
        }

        $previousSalary =
            (float) $incomeTax->previous_salary;

        $currentSalary =
            (float) $incomeTax->current_salary;

        /*
         * Basic salary is 50% of total salary.
         *
         * Salary values are annual amounts, therefore
         * divide by 12 to obtain the monthly salary.
         */
        $previousMonthlyBasic =
            ($previousSalary / 12) * 0.50;

        $currentMonthlyBasic =
            ($currentSalary / 12) * 0.50;

        $pfPercentage =
            (float) $settings->provident_fund_percentage;

        $previousEmployerContribution =
            $previousMonthlyBasic
            * ($pfPercentage / 100)
            * $previousSalaryMonths;

        $currentEmployerContribution =
            $currentMonthlyBasic
            * ($pfPercentage / 100)
            * $currentSalaryMonths;

        return round(
            $previousEmployerContribution
            + $currentEmployerContribution,
            2
        );
    }

    /**
     * Calculate net bank income.
     *
     * Income Tax stores:
     *
     * net_bank_interest
     * net_bank_tds
     * net_bank_charges
     *
     * Therefore:
     *
     * Net Bank Income
     * = Interest - TDS - Charges
     */
    private function calculateBankIncome(
        IncomeTax $incomeTax
    ): float {
        return round(
            (float) $incomeTax->net_bank_interest
            - (float) $incomeTax->net_bank_tds
            - (float) $incomeTax->net_bank_charges,
            2
        );
    }

    /**
     * Calculate gross Savings Certificate interest
     * belonging to the selected July-June income year.
     *
     * The amount used for total income is the
     * GROSS interest BEFORE TDS.
     *
     * The SavingsCertificateService is the authoritative
     * source for:
     *
     * - final/maturity-year rate
     * - interest interval
     * - payout date
     * - gross interest
     * - point-in-time cumulative investment
     * - point-in-time tax rate
     * - tax
     * - net interest
     */
    private function calculateSavingsCertificateInterest(
        User $user,
        IncomeTax $incomeTax
    ): array {
        $incomeYearStart = Carbon::create(
            (int) $incomeTax->from_year,
            7,
            1
        );

        $incomeYearEnd = Carbon::create(
            (int) $incomeTax->to_year,
            6,
            30
        );

        $calculationData = $this->savingsCertificateService
            ->getUserCalculationData($user->id);
        $certificates = $calculationData['certificates'];

        /*
         * Total GROSS interest before TDS.
         */
        $totalGrossInterest = 0.0;

        $warnings = [];

        foreach ($certificates as $certificate) {
            /*
             * The SavingsCertificateService uses the
             * maturity-year rate:
             *
             * rates[duration_years]
             *
             * Make sure that rate exists before using
             * the result for Income Tax.
             */
            $finalRateExists = $certificate
                ->rates
                ->contains(
                    'year',
                    $certificate->duration_years
                );

            if (!$finalRateExists) {
                $investmentName =
                    $certificate->investment?->name
                    ?? 'Savings Certificate';

                $warnings[] = [
                    'type' =>
                        'missing_savings_certificate_rate',

                    'name' =>
                        $investmentName,

                    'message' =>
                        'Final-year interest rate is missing.',
                ];

                continue;
            }

            /*
             * Use exactly the same schedule that is
             * displayed on the Savings Certificate
             * Show page.
             */
            $schedule =
                $this->savingsCertificateService
                    ->buildInterestSchedule($certificate, $calculationData);

            foreach ($schedule['history'] as $item) {
                /*
                 * A null gross_interest means there was no
                 * usable final-year rate. This should
                 * normally already be caught above.
                 */
                if ($item['gross_interest'] === null) {
                    continue;
                }

                $interestDate =
                    Carbon::parse($item['date']);

                /*
                 * Include interest payouts whose payout
                 * date falls inside the July-June income year.
                 */
                if (
                    $interestDate->gte($incomeYearStart)
                    && $interestDate->lte($incomeYearEnd)
                ) {
                    /*
                     * IMPORTANT:
                     *
                     * Total income uses gross interest,
                     * BEFORE TDS.
                     */
                    $totalGrossInterest +=
                        (float) $item['gross_interest'];
                }
            }
        }

        /*
         * Do not return an incomplete Savings Certificate
         * total if one or more certificates are missing
         * their final-year rate.
         */
        if ($warnings !== []) {
            return [
                'gross_interest' => null,
                'warnings' => $warnings,
            ];
        }

        return [
            'gross_interest' =>
                round($totalGrossInterest, 2),

            'warnings' => [],
        ];
    }

    /**
     * Convert a calendar month into its position
     * within the July-June income year.
     *
     * July      = 0
     * August    = 1
     * September = 2
     * October   = 3
     * November  = 4
     * December  = 5
     * January   = 6
     * February  = 7
     * March     = 8
     * April     = 9
     * May       = 10
     * June      = 11
     */
    private function incomeYearMonthPosition(
        int $month
    ): int {
        return $month >= 7
            ? $month - 7
            : $month + 5;
    }
}