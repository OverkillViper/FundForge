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
    public function calculate(float $taxableIncome, int $userId): array
    {
        if ($taxableIncome < 0) {
            throw new InvalidArgumentException('Taxable income cannot be negative.');
        }

        $slabs = $this->getSlabs($userId);

        if ($slabs->isEmpty()) {
            throw new InvalidArgumentException('No income tax slabs have been configured.');
        }

        $totalTax = 0.0;
        $breakdown = [];

        foreach ($slabs as $slab) {
            $incomeFrom = (float) $slab->income_from;
            $incomeTo = $slab->income_to !== null ? (float) $slab->income_to : null;

            if ($taxableIncome <= $incomeFrom) {
                break;
            }

            $slabAmount = $incomeTo === null
                ? $taxableIncome - $incomeFrom
                : min($taxableIncome, $incomeTo) - $incomeFrom;

            if ($slabAmount <= 0) {
                continue;
            }

            $taxPercent = (float) $slab->tax_percent;
            $taxAmount = round($slabAmount * ($taxPercent / 100), 2);

            $totalTax += $taxAmount;

            $breakdown[] = [
                'income_from' => $incomeFrom,
                'income_to' => $incomeTo,
                'taxable_amount' => round($slabAmount, 2),
                'tax_percent' => $taxPercent,
                'tax_amount' => $taxAmount,
            ];
        }

        $lastSlab = $slabs->last();

        if ($lastSlab->income_to !== null && $taxableIncome > (float) $lastSlab->income_to) {
            throw new InvalidArgumentException('Income tax slabs do not cover the complete taxable income.');
        }

        return [
            'taxable_income' => round($taxableIncome, 2),
            'tax_liability' => round($totalTax, 2),
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
    private function getSlabs(int $userId): Collection
    {
        return IncomeTaxSlab::query()
            ->where('user_id', $userId)
            ->orderBy('income_from')
            ->get();
    }
}