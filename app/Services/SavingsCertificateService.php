<?php

namespace App\Services;

use App\Models\SavingsCertificate;
use App\Models\SavingsCertificateTaxBracket;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class SavingsCertificateService
{
    /**
     * Get the cumulative active investment on a date.
     *
     * By default, a certificate is considered inactive on
     * its maturity date. When $includeMaturityDate is true,
     * the certificate is still considered active on the
     * maturity date because that date contains its final
     * interest payment.
     */
    public function getCumulativeInvestmentOnDate(
        int $userId,
        Carbon $date,
        bool $onlyActive = true,
        bool $includeMaturityDate = false
    ): float {
        $query = SavingsCertificate::query()
            ->whereHas('investment', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->where(
                'issue_date',
                '<=',
                $date->toDateString()
            );

        if ($onlyActive) {
            if (config('database.default') === 'pgsql') {
                $operator = $includeMaturityDate
                    ? '>='
                    : '>';

                $query->whereRaw(
                    "issue_date + (duration_years || ' years')::interval {$operator} ?",
                    [
                        $date->toDateString(),
                    ]
                );
            } else {
                $operator = $includeMaturityDate
                    ? '>='
                    : '>';

                $query->whereRaw(
                    "DATE_ADD(issue_date, INTERVAL duration_years YEAR) {$operator} ?",
                    [
                        $date->toDateString(),
                    ]
                );
            }
        }

        return (float) $query->sum('principal_value');
    }

    /**
     * Get the highest cumulative investment reached up to a date.
     *
     * This prevents the applicable tax rate from decreasing merely
     * because an older certificate has matured.
     */
    public function getHighestCumulativeInvestmentOnDate(
        int $userId,
        Carbon $date
    ): float {
        $certificates = SavingsCertificate::query()
            ->whereHas('investment', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->where(
                'issue_date',
                '<=',
                $date->toDateString()
            )
            ->orderBy('issue_date')
            ->orderBy('id')
            ->get([
                'id',
                'issue_date',
                'principal_value',
            ]);

        $cumulativeInvestment = 0.0;
        $highestInvestment = 0.0;

        foreach ($certificates as $certificate) {
            $cumulativeInvestment +=
                (float) $certificate->principal_value;

            $highestInvestment = max(
                $highestInvestment,
                $cumulativeInvestment
            );
        }

        return $highestInvestment;
    }

    /**
     * Get the applicable tax percentage for a cumulative
     * investment amount.
     */
    public function getTaxPercentForInvestment(
        int $userId,
        float $cumulativeInvestment
    ): float {
        $taxBrackets = SavingsCertificateTaxBracket::where(
            'user_id',
            $userId
        )
            ->orderBy(
                'minimum_investment',
                'desc'
            )
            ->get();

        foreach ($taxBrackets as $bracket) {
            if (
                $cumulativeInvestment >=
                (float) $bracket->minimum_investment
            ) {
                return (float) $bracket->tax_percent;
            }
        }

        return 0.0;
    }

    /**
     * Get the current month's interest summary.
     */
    public function getCurrentMonthInterestSummary(
        int $userId,
        Carbon $month
    ): array {
        $certificates = SavingsCertificate::query()
            ->whereHas('investment', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->with([
                'rates',
                'investment',
            ])
            ->get();

        $totalGross = 0.0;
        $totalTax = 0.0;
        $totalNet = 0.0;

        $targetMonth = $month->format('Y-m');

        foreach ($certificates as $certificate) {
            $schedule =
                $this->buildInterestSchedule(
                    $certificate
                );

            foreach ($schedule['history'] as $item) {
                if (
                    $item['net_interest'] !== null
                    && Carbon::parse($item['date'])
                        ->format('Y-m') === $targetMonth
                ) {
                    $totalGross +=
                        $item['gross_interest'];

                    $totalTax +=
                        $item['tax'];

                    $totalNet +=
                        $item['net_interest'];
                }
            }
        }

        return [
            'month' =>
                $month->format('F Y'),

            'gross_interest' =>
                round($totalGross, 2),

            'tax_amount' =>
                round($totalTax, 2),

            'net_interest' =>
                round($totalNet, 2),
        ];
    }

    /**
     * Build the complete interest schedule for a certificate.
     *
     * The final-year rate is used for every interest payment.
     *
     * The certificate's rate-tier allocation is determined from
     * the certificate's position when it was issued and remains
     * fixed for the entire certificate lifetime.
     *
     * The tax rate can increase when cumulative investment
     * increases, but does not decrease merely because an older
     * certificate matures.
     */
    public function buildInterestSchedule(
        SavingsCertificate $certificate
    ): array {
        $certificate->loadMissing([
            'rates',
            'investment',
        ]);

        $userId =
            $certificate->investment->user_id;

        $issueDate =
            Carbon::parse(
                $certificate->issue_date
            );

        $maturityDate =
            $issueDate
                ->copy()
                ->addYears(
                    $certificate->duration_years
                );

        $intervalMonths =
            $certificate->interest_interval_months;

        /*
         * Calculate the certificate's fixed rate
         * allocation once.
         */
        $rateBreakdown =
            $this->calculateRateBreakdown(
                $certificate
            );

        /*
         * The tax rate can change during the certificate's
         * lifetime as the user's cumulative investment grows.
         *
         * We therefore calculate it separately for every
         * interest payment.
         */
        $history = [];

        $nextInterest = null;

        $interestDate =
            $issueDate
                ->copy()
                ->addMonths(
                    $intervalMonths
                );

        while (
            $interestDate->lte(
                $maturityDate
            )
        ) {
            /*
             * Include certificates on their maturity date.
             *
             * This is important for the final interest payment
             * of certificate 1 on 16 August 2026.
             */
            $currentInvestment =
                $this->getCumulativeInvestmentOnDate(
                    $userId,
                    $interestDate,
                    true,
                    true
                );

            /*
             * Once a higher cumulative investment level has
             * been reached, the tax rate must not fall merely
             * because an older certificate subsequently matures.
             */
            $highestInvestment =
                $this->getHighestCumulativeInvestmentOnDate(
                    $userId,
                    $interestDate
                );

            /*
             * Use whichever is higher.
             *
             * Normally highestInvestment will be the value
             * determining the tax bracket.
             */
            $taxBasis = max(
                $currentInvestment,
                $highestInvestment
            );

            $taxPercent =
                $this->getTaxPercentForInvestment(
                    $userId,
                    $taxBasis
                );

            $grossInterest = null;

            if ($rateBreakdown !== null) {
                $grossInterest = 0.0;

                foreach ($rateBreakdown as $portion) {
                    $grossInterest +=
                        $portion['principal']
                        * (
                            $portion['annual_rate']
                            / 100
                        )
                        * (
                            $intervalMonths
                            / 12
                        );
                }

                $grossInterest =
                    round(
                        $grossInterest,
                        2
                    );
            }

            $taxAmount = null;
            $netInterest = null;

            if ($grossInterest !== null) {
                $taxAmount =
                    round(
                        $grossInterest
                        * ($taxPercent / 100),
                        2
                    );

                $netInterest =
                    round(
                        $grossInterest
                        - $taxAmount,
                        2
                    );
            }

            $isPast =
                $interestDate->lt(
                    Carbon::today()
                );

            /*
             * A single annual rate is only displayed when
             * the certificate occupies one tier.
             *
             * For a split certificate, the frontend should
             * use rate_breakdown instead.
             */
            $annualRate = null;

            if ($rateBreakdown !== null && count($rateBreakdown) === 1) {
                $annualRate = $rateBreakdown[0]['annual_rate'];
            }

            $item = [
                'date' =>
                    $interestDate->toDateString(),

                'annual_rate' =>
                    $annualRate,

                'tax_percent' =>
                    $taxPercent,

                'cumulative_investment' =>
                    $currentInvestment,

                'tax_basis' =>
                    $taxBasis,

                'gross_interest' =>
                    $grossInterest,

                'tax' =>
                    $taxAmount,

                'net_interest' =>
                    $netInterest,

                /*
                 * Fixed allocation for this certificate.
                 */
                'rate_breakdown' =>
                    $rateBreakdown,

                'status' =>
                    $isPast
                        ? 'past'
                        : 'upcoming',
            ];

            $history[] = $item;

            if (
                !$isPast
                && $nextInterest === null
            ) {
                $nextInterest = $item;
            }

            $interestDate->addMonths(
                $intervalMonths
            );
        }

        return [
            'history' =>
                $history,

            'next' =>
                $nextInterest,
        ];
    }

    /**
     * Determine the rate allocation for this certificate.
     *
     * The allocation is based on the certificate's position
     * among certificates issued up to its own issue date.
     *
     * Once determined, this allocation remains fixed for the
     * lifetime of the certificate.
     */
    private function calculateRateBreakdown(
        SavingsCertificate $certificate
    ): ?array {
        $certificate->loadMissing(
            'investment'
        );

        $userId =
            $certificate->investment->user_id;

        $issueDate =
            Carbon::parse(
                $certificate->issue_date
            );

        /*
         * Get certificates that existed when this certificate
         * was issued.
         *
         * Ordering is deterministic:
         *
         * 1. issue_date
         * 2. id
         */
        $certificates =
            SavingsCertificate::query()
                ->whereHas(
                    'investment',
                    function ($query) use ($userId) {
                        $query->where(
                            'user_id',
                            $userId
                        );
                    }
                )
                ->where(
                    'issue_date',
                    '<=',
                    $issueDate->toDateString()
                )
                ->orderBy(
                    'issue_date'
                )
                ->orderBy(
                    'id'
                )
                ->get([
                    'id',
                    'issue_date',
                    'principal_value',
                    'duration_years',
                ]);

        $cumulativeBefore = 0.0;

        foreach ($certificates as $existingCertificate) {
            if (
                $existingCertificate->id ===
                $certificate->id
            ) {
                break;
            }

            $cumulativeBefore +=
                (float) $existingCertificate
                    ->principal_value;
        }

        $certificateStart =
            $cumulativeBefore;

        $certificateEnd =
            $certificateStart
            + (float) $certificate->principal_value;

        $tiers = collect(
            config(
                'savings_certificate.rate_tiers',
                []
            )
        )
            ->sortBy(
                'minimum_investment'
            )
            ->values();

        if ($tiers->isEmpty()) {
            return null;
        }

        /*
         * Always use the final-year rate.
         */
        $finalYear =
            (int) $certificate->duration_years;

        $ratesByTier =
            $certificate->rates
                ->where(
                    'year',
                    $finalYear
                )
                ->keyBy(
                    'tier'
                );

        $breakdown = [];

        foreach (
            $tiers as $index => $tier
        ) {
            $tierMinimum =
                (float) $tier[
                    'minimum_investment'
                ];

            $nextTier =
                $tiers->get(
                    $index + 1
                );

            $tierMaximum =
                $nextTier !== null
                    ? (float) $nextTier[
                        'minimum_investment'
                    ]
                    : null;

            /*
             * Find the intersection between:
             *
             * certificate range
             * and
             * tier range.
             */
            $overlapStart =
                max(
                    $certificateStart,
                    $tierMinimum
                );

            $overlapEnd =
                $tierMaximum === null
                    ? $certificateEnd
                    : min(
                        $certificateEnd,
                        $tierMaximum
                    );

            $portion =
                $overlapEnd
                - $overlapStart;

            if ($portion <= 0) {
                continue;
            }

            $tierKey =
                $tier['key'];

            $rateRecord =
                $ratesByTier->get(
                    $tierKey
                );

            /*
             * If a required final-year rate is missing,
             * the complete interest calculation cannot
             * be performed.
             */
            if (!$rateRecord) {
                return null;
            }

            $breakdown[] = [
                'tier' =>
                    $tierKey,

                'principal' =>
                    round(
                        $portion,
                        2
                    ),

                'annual_rate' =>
                    (float) $rateRecord
                        ->interest_rate,

                'minimum_investment' =>
                    $tierMinimum,

                'maximum_investment' =>
                    $tierMaximum,
            ];
        }

        return $breakdown;
    }

    /**
     * Get the currently active certificates on a date.
     *
     * Maturity date is inclusive because the certificate's
     * final interest payment occurs on that date.
     */
    private function getActiveCertificatesOnDate(
        int $userId,
        Carbon $date
    ): Collection {
        $query = SavingsCertificate::query()
            ->whereHas(
                'investment',
                function ($query) use ($userId) {
                    $query->where(
                        'user_id',
                        $userId
                    );
                }
            )
            ->where(
                'issue_date',
                '<=',
                $date->toDateString()
            )
            ->with([
                'investment',
                'rates',
            ])
            ->orderBy(
                'issue_date'
            )
            ->orderBy(
                'id'
            );

        if (
            config('database.default') === 'pgsql'
        ) {
            /*
             * Include a certificate on its maturity date
             * because its final interest payout occurs then.
             */
            $query->whereRaw(
                "issue_date + (duration_years || ' years')::interval >= ?",
                [
                    $date->toDateString(),
                ]
            );
        } else {
            $query->whereRaw(
                "DATE_ADD(issue_date, INTERVAL duration_years YEAR) >= ?",
                [
                    $date->toDateString(),
                ]
            );
        }

        return $query->get();
    }

    /**
     * Get the rate tiers that actually intersect this
     * certificate's fixed investment range.
     *
     * Used by the Rates.vue UI.
     */
    public function getApplicableRateTiers(
        SavingsCertificate $certificate
    ): Collection {
        $certificate->loadMissing(
            'investment'
        );

        $userId =
            $certificate->investment->user_id;

        $issueDate =
            Carbon::parse(
                $certificate->issue_date
            );

        $certificates =
            SavingsCertificate::query()
                ->whereHas(
                    'investment',
                    function ($query) use ($userId) {
                        $query->where(
                            'user_id',
                            $userId
                        );
                    }
                )
                ->where(
                    'issue_date',
                    '<=',
                    $issueDate->toDateString()
                )
                ->orderBy(
                    'issue_date'
                )
                ->orderBy(
                    'id'
                )
                ->get([
                    'id',
                    'principal_value',
                ]);

        $cumulativeBefore = 0.0;

        foreach ($certificates as $existingCertificate) {
            if (
                $existingCertificate->id ===
                $certificate->id
            ) {
                break;
            }

            $cumulativeBefore +=
                (float) $existingCertificate
                    ->principal_value;
        }

        $certificateEnd =
            $cumulativeBefore
            + (float) $certificate->principal_value;

        $tiers = collect(
            config(
                'savings_certificate.rate_tiers',
                []
            )
        )
            ->sortBy(
                'minimum_investment'
            )
            ->values();

        return $tiers
            ->filter(
                function (
                    array $tier,
                    int $index
                ) use (
                    $cumulativeBefore,
                    $certificateEnd,
                    $tiers
                ) {
                    $tierMinimum =
                        (float) $tier[
                            'minimum_investment'
                        ];

                    $nextTier =
                        $tiers->get(
                            $index + 1
                        );

                    $tierMaximum =
                        $nextTier !== null
                            ? (float) $nextTier[
                                'minimum_investment'
                            ]
                            : null;

                    $overlapStart =
                        max(
                            $cumulativeBefore,
                            $tierMinimum
                        );

                    $overlapEnd =
                        $tierMaximum === null
                            ? $certificateEnd
                            : min(
                                $certificateEnd,
                                $tierMaximum
                            );

                    return $overlapEnd >
                        $overlapStart;
                }
            )
            ->values();
    }
}