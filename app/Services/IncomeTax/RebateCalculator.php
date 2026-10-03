<?php

namespace App\Services\IncomeTax;

use App\Models\UserSetting;
use InvalidArgumentException;

class RebateCalculator
{
    /**
     * Calculate income-tax rebate.
     *
     * Rebate is the lowest of:
     *
     * 1. 3% of taxable income
     * 2. Configured percentage of eligible investment
     * 3. Maximum rebate cap
     *
     * @return array{
     *     taxable_income: float,
     *     taxable_income_rebate_limit: float,
     *     eligible_investment: float,
     *     rebate_percentage: float,
     *     investment_rebate_limit: float,
     *     max_rebate_cap: float,
     *     rebate: float,
     *     limiting_factor: string,
     *     breakdown: array<int, array{
     *         type: string,
     *         amount: float
     *     }>
     * }
     */
    public function calculate(
        float $taxableIncome,
        float $eligibleInvestment,
        UserSetting $settings
    ): array {
        if ($taxableIncome < 0) {
            throw new InvalidArgumentException('Taxable income cannot be negative.');
        }

        if ($eligibleInvestment < 0) {
            throw new InvalidArgumentException('Eligible investment cannot be negative.');
        }

        $rebatePercentage = (float) $settings->rebate_percentage;
        $maxRebateCap = (float) $settings->max_rebate_cap;

        if ($rebatePercentage < 0 || $rebatePercentage > 100) {
            throw new InvalidArgumentException('Rebate percentage must be between 0 and 100.');
        }

        if ($maxRebateCap < 0) {
            throw new InvalidArgumentException('Maximum rebate cap cannot be negative.');
        }

        /*
         * Limit 1:
         *
         * 3% of taxable income.
         */
        $taxableIncomeRebateLimit = round($taxableIncome * 0.03, 2);

        /*
         * Limit 2:
         *
         * Configured percentage of eligible investment.
         */
        $investmentRebateLimit = round($eligibleInvestment * ($rebatePercentage / 100), 2);

        /*
         * Limit 3:
         *
         * Maximum rebate cap.
         */
        $maxRebateLimit = round($maxRebateCap, 2);

        /*
         * Final rebate:
         *
         * Lowest of the three limits.
         */
        $rebate = round(min($taxableIncomeRebateLimit, $investmentRebateLimit, $maxRebateLimit), 2);

        return [
            'taxable_income' => round($taxableIncome, 2),
            'taxable_income_rebate_limit' => $taxableIncomeRebateLimit,
            'eligible_investment' => round($eligibleInvestment, 2),
            'rebate_percentage' => $rebatePercentage,
            'investment_rebate_limit' => $investmentRebateLimit,
            'max_rebate_cap' => $maxRebateLimit,
            'rebate' => $rebate,
            'limiting_factor' => $this->getLimitingFactor($rebate, $taxableIncomeRebateLimit, $investmentRebateLimit, $maxRebateLimit),
            'breakdown' => [
                [
                    'type' => 'taxable_income_3_percent',
                    'amount' => $taxableIncomeRebateLimit,
                ],
                [
                    'type' => 'eligible_investment_rebate',
                    'amount' => $investmentRebateLimit,
                ],
                [
                    'type' => 'maximum_rebate_cap',
                    'amount' => $maxRebateLimit,
                ],
            ],
        ];
    }

    /**
     * Determine which rebate limit determines the final rebate.
     */
    private function getLimitingFactor(float $rebate, float $taxableIncomeLimit, float $investmentLimit, float $maximumLimit): string
    {
        if (abs($rebate - $taxableIncomeLimit) < 0.005) {
            return 'taxable_income';
        }

        if (abs($rebate - $investmentLimit) < 0.005) {
            return 'eligible_investment';
        }

        return 'maximum_rebate_cap';
    }
}