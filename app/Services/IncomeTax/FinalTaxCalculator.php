<?php

namespace App\Services\IncomeTax;

use App\Models\IncomeTax;
use App\Models\User;
use App\Services\SavingsCertificateService;
use Carbon\Carbon;
use InvalidArgumentException;

class FinalTaxCalculator
{
    public function __construct(
        protected SavingsCertificateService $savingsCertificateService
    ) {}

    /**
     * Calculate final tax for the selected July-June income year.
     *
     * Final tax is:
     *
     * Gross tax liability
     * - tax rebate
     * - salary TDS
     * - Savings Certificate TDS
     * - bank TDS
     *
     * A negative final tax means the taxpayer has excess
     * tax paid and is in a refundable position.
     *
     * @return array{
     *     tax_liability: float,
     *     tax_rebate: float,
     *     salary_tds: float,
     *     savings_certificate_tds: float,
     *     bank_tds: float,
     *     total_tds: float,
     *     final_tax: float,
     *     tax_payable: float,
     *     tax_refundable: float
     * }
     */
    public function calculate(
        User $user,
        IncomeTax $incomeTax,
        float $taxLiability,
        float $taxRebate
    ): array {
        if ($taxLiability < 0) {
            throw new InvalidArgumentException('Tax liability cannot be negative.');
        }

        if ($taxRebate < 0) {
            throw new InvalidArgumentException('Tax rebate cannot be negative.');
        }

        $incomeYearStart = Carbon::create((int) $incomeTax->from_year, 7, 1);
        $incomeYearEnd = Carbon::create((int) $incomeTax->to_year, 6, 30);

        $salaryTds = $this->calculateSalaryTds($user, $incomeYearStart, $incomeYearEnd);
        $savingsCertificateTds = $this->calculateSavingsCertificateTds($user, $incomeYearStart, $incomeYearEnd);
        $bankTds = (float) $incomeTax->net_bank_tds;

        $totalTds = round($salaryTds + $savingsCertificateTds + $bankTds, 2);
        $finalTax = round($taxLiability - $taxRebate - $totalTds, 2);

        $discountPercentage = 5.0;
        $discountAmount = $finalTax > 0 ? round($finalTax * ($discountPercentage / 100), 2) : 0.0;
        $finalTaxAfterDiscount = round($finalTax - $discountAmount, 2);

        return [ 
            'tax_liability'             => round($taxLiability, 2),
            'tax_rebate'                => round($taxRebate, 2),
            'salary_tds'                => round($salaryTds, 2),
            'savings_certificate_tds'   => round($savingsCertificateTds, 2),
            'bank_tds'                  => round($bankTds, 2),
            'total_tds'                 => $totalTds,
            'final_tax'                 => $finalTax,
            'discount_amount'           => $discountAmount,
            'final_tax_after_discount'  => $finalTaxAfterDiscount,
            'tax_payable'               => max($finalTax, 0),
            'tax_refundable'            => max(-$finalTax, 0),
        ];
    }

    /**
     * Calculate salary TDS during the selected income year.
     *
     * salary_tds.date represents the first day of the
     * relevant month, so July 2025 is stored as 2025-07-01.
     */
    private function calculateSalaryTds(
        User $user,
        Carbon $incomeYearStart,
        Carbon $incomeYearEnd
    ): float {
        return round(
            (float) $user->salaryTds()
                ->whereBetween('date', [
                    $incomeYearStart->toDateString(),
                    $incomeYearEnd->toDateString(),
                ])
                ->sum('amount'),
            2
        );
    }

    /**
     * Calculate total Savings Certificate TDS during
     * the selected income year.
     *
     * SavingsCertificateService calculates the tax for
     * each interest installment. We only sum installments
     * whose payment date falls within the income year.
     */
    private function calculateSavingsCertificateTds(
        User $user,
        Carbon $incomeYearStart,
        Carbon $incomeYearEnd
    ): float {
        $calculationData = $this->savingsCertificateService
            ->getUserCalculationData($user->id);
        $certificates = $calculationData['certificates'];

        $totalTax = 0.0;

        foreach ($certificates as $certificate) {
            $schedule = $this->savingsCertificateService
                ->buildInterestSchedule($certificate, $calculationData);

            foreach ($schedule['history'] as $item) {
                if ($item['tax'] === null) {
                    continue;
                }

                $interestDate = Carbon::parse($item['date']);

                if ($interestDate->gte($incomeYearStart) && $interestDate->lte($incomeYearEnd)) {
                    $totalTax += (float) $item['tax'];
                }
            }
        }

        return round($totalTax, 2);
    }
}