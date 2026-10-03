<?php

namespace App\Services\IncomeTax;

use App\Models\IncomeTaxSlab;
use Illuminate\Support\Collection;
use InvalidArgumentException;

class IncomeTaxCalculator
{
    /**
     * Calculate gross income tax liability using
     * progressive current-year tax slabs.
     *
     * Example:
     *
     * Taxable income = 960,170
     *
     * First 400,000      @ 0%  = 0
     * Next 300,000       @ 10% = 30,000
     * Remaining 260,170  @ 15% = 39,025.50
     *
     * Total tax = 69,025.50
     *
     * @return array{
     *     taxable_income: float,
     *     tax_liability: float,
     *     breakdown: array<int, array{
     *         income_from: float,
     *         income_to: float|null,
     *         taxable_amount: float,
     *         tax_percent: float,
     *         tax_amount: float
     *     }>
     * }
     */
    public function calculate(
        float $taxableIncome
    ): array {
        if ($taxableIncome < 0) {
            throw new InvalidArgumentException(
                'Taxable income cannot be negative.'
            );
        }

        $slabs = $this->getSlabs();

        if ($slabs->isEmpty()) {
            throw new InvalidArgumentException(
                'No income tax slabs have been configured.'
            );
        }

        $remainingIncome = $taxableIncome;
        $totalTax = 0.0;
        $breakdown = [];

        foreach ($slabs as $slab) {
            if ($remainingIncome <= 0) {
                break;
            }

            $incomeFrom = (float) $slab->income_from;

            $incomeTo = $slab->income_to !== null
                ? (float) $slab->income_to
                : null;

            /*
             * Determine how much of the remaining income
             * belongs to this slab.
             */
            if ($incomeTo === null) {
                $slabAmount = $remainingIncome;
            } else {
                $slabAmount = min(
                    $remainingIncome,
                    $incomeTo - $incomeFrom
                );
            }

            if ($slabAmount <= 0) {
                continue;
            }

            $taxPercent = (float) $slab->tax_percent;

            $taxAmount = round(
                $slabAmount * ($taxPercent / 100),
                2
            );

            $totalTax += $taxAmount;
            $remainingIncome -= $slabAmount;

            $breakdown[] = [
                'income_from' => $incomeFrom,

                'income_to' => $incomeTo,

                'taxable_amount' => round(
                    $slabAmount,
                    2
                ),

                'tax_percent' => $taxPercent,

                'tax_amount' => $taxAmount,
            ];
        }

        /*
         * The final slab should have income_to = NULL,
         * meaning that it covers all remaining income.
         */
        if ($remainingIncome > 0.005) {
            throw new InvalidArgumentException(
                'Income tax slabs do not cover the complete taxable income.'
            );
        }

        return [
            'taxable_income' => round(
                $taxableIncome,
                2
            ),

            'tax_liability' => round(
                $totalTax,
                2
            ),

            'breakdown' => $breakdown,
        ];
    }

    /**
     * Get the current income-tax slabs.
     *
     * The slabs are not tied to an income year.
     * They represent the tax rules currently configured
     * in the application.
     */
    private function getSlabs(): Collection
    {
        return IncomeTaxSlab::query()
            ->orderBy('income_from')
            ->get();
    }
}