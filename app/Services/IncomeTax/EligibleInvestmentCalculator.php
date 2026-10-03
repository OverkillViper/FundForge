<?php

namespace App\Services\IncomeTax;

use App\Models\IncomeTax;
use App\Models\User;
use Carbon\Carbon;

class EligibleInvestmentCalculator
{
    /**
     * Calculate total eligible investment for a July-June income year.
     *
     * Eligible investment consists of:
     *
     * 1. DPS payments during the income year, subject to the
     *    user's annual DPS investment cap.
     *
     * 2. Employee provident fund contributions during the
     *    income year.
     *
     * 3. Employer provident fund contributions during the
     *    income year.
     *
     * 4. Principal value of Savings Certificates issued during
     *    the income year.
     *
     * Savings Certificate interest rates are not considered
     * for eligible investment.
     *
     * @return array{
     *     dps_payment: float,
     *     dps_eligible: float,
     *     dps_investment_cap: float,
     *     pf_employee: float,
     *     pf_employer: float,
     *     pf_eligible: float,
     *     savings_certificate_principal: float,
     *     savings_certificate_count: int,
     *     eligible_total: float
     * }
     */
    public function calculate(User $user, IncomeTax $incomeTax): array
    {
        $incomeYearStart = Carbon::create((int) $incomeTax->from_year, 7, 1);
        $incomeYearEnd = Carbon::create((int) $incomeTax->to_year, 6, 30);

        $dps = $this->calculateDps($user, $incomeYearStart, $incomeYearEnd);
        $pf = $this->calculateProvidentFund($user, $incomeTax, $incomeYearStart, $incomeYearEnd);
        $savings = $this->calculateSavingsCertificate($user, $incomeYearStart, $incomeYearEnd);

        $eligibleTotal = round($dps['eligible'] + $pf['eligible'] + $savings['principal'], 2);

        return [
            'dps_payment' => $dps['payment'],
            'dps_eligible' => $dps['eligible'],
            'dps_investment_cap' => $dps['cap'],
            'pf_employee' => $pf['employee'],
            'pf_employer' => $pf['employer'],
            'pf_eligible' => $pf['eligible'],
            'savings_certificate_principal' => $savings['principal'],
            'savings_certificate_count' => $savings['count'],
            'eligible_total' => $eligibleTotal,
        ];
    }

    /**
     * Calculate DPS payments during the selected income year.
     *
     * Total eligible DPS investment is capped by the
     * user's configured annual DPS investment cap.
     */
    private function calculateDps(
        User $user,
        Carbon $incomeYearStart,
        Carbon $incomeYearEnd
    ): array {
        $dpsPayment = (float) $user->investments()
            ->whereHas('dps')
            ->with('dps.payments')
            ->get()
            ->sum(function ($investment) use ($incomeYearStart, $incomeYearEnd) {
                return $investment->dps->payments
                    ->filter(function ($payment) use ($incomeYearStart, $incomeYearEnd) {
                        $paymentDate = Carbon::parse($payment->payment_date);

                        return $paymentDate->gte($incomeYearStart) && $paymentDate->lte($incomeYearEnd);
                    })
                    ->sum(fn ($payment) => (float) $payment->amount);
            });

        $dpsCap = (float) ($user->settings?->dps_investment_cap ?? 0);
        $eligible = min($dpsPayment, $dpsCap);

        return [
            'payment' => round($dpsPayment, 2),
            'eligible' => round($eligible, 2),
            'cap' => round($dpsCap, 2),
        ];
    }

    /**
     * Calculate employee and employer provident fund
     * contributions during the selected income year.
     */
    private function calculateProvidentFund(
        User $user,
        IncomeTax $incomeTax,
        Carbon $incomeYearStart,
        Carbon $incomeYearEnd
    ): array {
        $providentFund = $user->providentFund;

        if (!$providentFund) {
            return [
                'employee' => 0.0,
                'employer' => 0.0,
                'eligible' => 0.0,
            ];
        }

        $employeeContribution = (float) $providentFund
            ->contributions()
            ->whereBetween('contribution_date', [$incomeYearStart->toDateString(), $incomeYearEnd->toDateString()])
            ->sum('amount');

        $employerContribution = $this->calculateEmployerPfContribution($user, $incomeTax);

        return [
            'employee' => round($employeeContribution, 2),
            'employer' => round($employerContribution, 2),
            'eligible' => round($employeeContribution + $employerContribution, 2),
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

        $pfStartDate = Carbon::parse($providentFund->start_date);
        $incomeYearStart = Carbon::create((int) $incomeTax->from_year, 7, 1);
        $incomeYearEnd = Carbon::create((int) $incomeTax->to_year, 6, 30);

        if ($pfStartDate->gt($incomeYearEnd)) {
            return 0.0;
        }

        if ($pfStartDate->lt($incomeYearStart)) {
            $pfStartPosition = 0;
        } else {
            $pfStartPosition = $this->incomeYearMonthPosition($pfStartDate->month);
        }

        $salaryEffectivePosition = $this->incomeYearMonthPosition((int) $settings->salary_effective_month);

        $previousSalaryMonths = 0;

        if ($salaryEffectivePosition > $pfStartPosition) {
            $previousSalaryMonths = $salaryEffectivePosition - $pfStartPosition;
        }

        $currentSalaryMonths = 12 - max($salaryEffectivePosition, $pfStartPosition);

        if ($salaryEffectivePosition <= $pfStartPosition) {
            $previousSalaryMonths = 0;
            $currentSalaryMonths = 12 - $pfStartPosition;
        }

        $previousSalary = (float) $incomeTax->previous_salary;
        $currentSalary = (float) $incomeTax->current_salary;

        $previousMonthlyBasic = ($previousSalary / 12) * 0.50;
        $currentMonthlyBasic = ($currentSalary / 12) * 0.50;
        $pfPercentage = (float) $settings->provident_fund_percentage;

        $previousEmployerContribution = $previousMonthlyBasic * ($pfPercentage / 100) * $previousSalaryMonths;
        $currentEmployerContribution = $currentMonthlyBasic * ($pfPercentage / 100) * $currentSalaryMonths;

        return round($previousEmployerContribution + $currentEmployerContribution, 2);
    }

    /**
     * Calculate Savings Certificate principal issued
     * during the selected income year.
     *
     * Only the issue date is considered.
     * Interest rates and interest payments are not considered
     * for eligible investment.
     */
    private function calculateSavingsCertificate(
        User $user,
        Carbon $incomeYearStart,
        Carbon $incomeYearEnd
    ): array {
        $certificates = $user->investments()
            ->whereHas('savingsCertificate')
            ->with('savingsCertificate')
            ->get()
            ->pluck('savingsCertificate')
            ->filter(function ($certificate) use ($incomeYearStart, $incomeYearEnd) {
                $issueDate = Carbon::parse($certificate->issue_date);

                return $issueDate->gte($incomeYearStart) && $issueDate->lte($incomeYearEnd);
            });

        $principal = $certificates->sum(fn ($certificate) => (float) $certificate->principal_value);

        return [
            'principal' => round($principal, 2),
            'count' => $certificates->count(),
        ];
    }

    private function incomeYearMonthPosition(int $month): int
    {
        return $month >= 7 ? $month - 7 : $month + 5;
    }
}