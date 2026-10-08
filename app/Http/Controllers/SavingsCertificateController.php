<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use App\Models\SavingsCertificate;
use App\Services\SavingsCertificateService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SavingsCertificateController extends Controller
{
    public function __construct(
        protected SavingsCertificateService $savingsCertificateService
    ) {}

    public function index(): Response
    {
        $userId = auth()->id();
        $today = Carbon::today();
        $calculationData = $this->savingsCertificateService
            ->getUserCalculationData($userId);

        // Overall current total user investment
        $totalUserInvestment =
            $this->savingsCertificateService
                ->getCumulativeInvestmentOnDate(
                    $userId,
                    $today,
                    calculationData: $calculationData
                );

        $currentTaxPercent =
            $this->savingsCertificateService
                ->getTaxPercentForInvestment(
                    $userId,
                    $totalUserInvestment,
                    $calculationData
                );

        $currentMonthInterest =
            $this->savingsCertificateService
                ->getCurrentMonthInterestSummary(
                    $userId,
                    $today,
                    $calculationData
                );

        $certificates = $calculationData['certificates']
            ->sortByDesc('issue_date')
            ->values();

        $certificates->transform(
            function ($certificate) use ($currentTaxPercent) {
                $certificate->tax_percent =
                    $currentTaxPercent;
                $certificate->unsetRelation('rates');

                return $certificate;
            }
        );

        return Inertia::render(
            'Investments/SavingsCertificate/Index',
            [
                'certificates'            => $certificates,
                'total_investment'        => $totalUserInvestment,
                'current_tax_percent'     => $currentTaxPercent,
                'current_month_interest'  => $currentMonthInterest,
            ]
        );
    }

    public function create(): Response
    {
        return Inertia::render(
            'Investments/SavingsCertificate/Create'
        );
    }

    public function store(
        Request $request
    ): RedirectResponse {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'issue_date' => [
                'required',
                'date',
            ],

            'duration_years' => [
                'required',
                'integer',
                'min:1',
            ],

            'principal_value' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'interest_interval_months' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);

        $savingsCertificate = DB::transaction(
            function () use ($validated) {
                $investment = Investment::create([
                    'user_id' =>
                        auth()->id(),

                    'type' =>
                        'savings_certificate',

                    'name' =>
                        $validated['name'],

                    'start_date' =>
                        $validated['issue_date'],
                ]);

                return $investment
                    ->savingsCertificate()
                    ->create([
                        'issue_date' =>
                            $validated['issue_date'],

                        'duration_years' =>
                            $validated['duration_years'],

                        'principal_value' =>
                            $validated['principal_value'],

                        'interest_interval_months' =>
                            $validated[
                                'interest_interval_months'
                            ],
                    ]);
            }
        );

        return to_route(
            'investments.savings-certificates.show',
            $savingsCertificate
        )->with(
            'success',
            'Savings certificate created successfully.'
        );
    }

    public function show(
        SavingsCertificate $savingsCertificate
    ): Response {
        $this->authorizeOwnership(
            $savingsCertificate
        );

        $savingsCertificate->load([
            'investment',
            'rates',
        ]);

        $userId = auth()->id();
        $calculationData = $this->savingsCertificateService
            ->getUserCalculationData($userId);

        /*
         * Current cumulative investment.
         *
         * This is used only for displaying the current
         * tax rate in the certificate header.
         */
        $totalUserInvestment =
            $this->savingsCertificateService
                ->getCumulativeInvestmentOnDate(
                    $userId,
                    Carbon::today(),
                    calculationData: $calculationData
                );

        $savingsCertificate->tax_percent =
            $this->savingsCertificateService
                ->getTaxPercentForInvestment(
                    $userId,
                    $totalUserInvestment,
                    $calculationData
                );

        /*
         * Build the complete interest schedule.
         *
         * Rate-tier allocation and historical tax
         * calculations are handled by the service.
         */
        $interestSchedule =
            $this->savingsCertificateService
                ->buildInterestSchedule(
                    $savingsCertificate,
                    $calculationData
                );

        $rateTiers = $this->savingsCertificateService
                          ->getApplicableRateTiers(
                              $savingsCertificate,
                              $calculationData
                          );

        return Inertia::render(
            'Investments/SavingsCertificate/Show',
            [
                'certificate'      => $savingsCertificate,
                'interestHistory'  => $interestSchedule['history'],
                'nextInterest'     => $interestSchedule['next'],
                'rateTiers'        => $rateTiers->values()->all(),
                'breadcrumbLabels' => [
                    (string) $savingsCertificate->id => $savingsCertificate->investment->name,
                ],
            ]
        );
    }

    public function edit(
        SavingsCertificate $savingsCertificate
    ): Response {
        $this->authorizeOwnership(
            $savingsCertificate
        );

        $savingsCertificate->load(
            'investment'
        );

        return Inertia::render(
            'Investments/SavingsCertificate/Edit',
            [
                'certificate' => $savingsCertificate,
                'breadcrumbLabels' => [
                    (string) $savingsCertificate->id => $savingsCertificate->investment->name,
                ],
            ]
        );
    }

    public function update(
        Request $request,
        SavingsCertificate $savingsCertificate
    ): RedirectResponse {
        $this->authorizeOwnership(
            $savingsCertificate
        );

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'issue_date' => [
                'required',
                'date',
            ],

            'duration_years' => [
                'required',
                'integer',
                'min:1',
            ],

            'principal_value' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'interest_interval_months' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);

        DB::transaction(
            function () use (
                $validated,
                $savingsCertificate
            ) {
                $savingsCertificate
                    ->investment
                    ->update([
                        'name' =>
                            $validated['name'],

                        'start_date' =>
                            $validated['issue_date'],
                    ]);

                $savingsCertificate->update([
                    'issue_date' =>
                        $validated['issue_date'],

                    'duration_years' =>
                        $validated['duration_years'],

                    'principal_value' =>
                        $validated['principal_value'],

                    'interest_interval_months' =>
                        $validated[
                            'interest_interval_months'
                        ],
                ]);

                /*
                 * Remove rates belonging to years that
                 * are now outside the certificate duration.
                 *
                 * Both lower and upper tier rates are
                 * removed automatically.
                 */
                $savingsCertificate
                    ->rates()
                    ->where(
                        'year',
                        '>',
                        $validated['duration_years']
                    )
                    ->delete();
            }
        );

        return redirect()
            ->route(
                'investments.savings-certificates.show',
                $savingsCertificate->id
            )
            ->with(
                'success',
                'Savings certificate updated successfully.'
            );
    }

    public function destroy(
        SavingsCertificate $savingsCertificate
    ): RedirectResponse {
        $this->authorizeOwnership(
            $savingsCertificate
        );

        $savingsCertificate
            ->investment
            ->delete();

        return redirect()
            ->route(
                'investments.savings-certificates.index'
            )
            ->with(
                'success',
                'Savings certificate deleted successfully.'
            );
    }

    public function updateRates(
        Request $request,
        SavingsCertificate $savingsCertificate
    ): RedirectResponse {
        $this->authorizeOwnership(
            $savingsCertificate
        );

        /*
         * Get the government-defined tiers from config.
         */
        $configuredTiers = collect(
            config(
                'savings_certificate.rate_tiers',
                []
            )
        );

        $tierKeys = $configuredTiers
            ->pluck('key')
            ->values()
            ->all();

        /*
         * Expected request structure:
         *
         * rates:
         *   1:
         *     lower: 11.04
         *     upper: 11.00
         *
         *   2:
         *     lower: 11.65
         *     upper: 11.61
         *
         *   3:
         *     lower: 12.30
         *     upper: 12.25
         */
        $validated = $request->validate([
            'rates' => [
                'required',
                'array',
            ],

            'rates.*' => [
                'required',
                'array',
            ],

            'rates.*.*' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],
        ]);

        /*
         * Validate that only configured tiers were
         * submitted.
         */
        foreach ($validated['rates'] as $year => $tierRates) {
            foreach ($tierRates as $tier => $rate) {
                if (!in_array($tier, $tierKeys, true)) {
                    abort(
                        422,
                        "Invalid savings certificate rate tier: {$tier}"
                    );
                }
            }
        }

        DB::transaction(
            function () use (
                $validated,
                $savingsCertificate,
                $tierKeys
            ) {
                foreach (
                    $validated['rates']
                    as $year => $tierRates
                ) {
                    /*
                     * Do not allow rates for years beyond
                     * the certificate duration.
                     */
                    if (
                        (int) $year >
                        (int) $savingsCertificate->duration_years
                    ) {
                        continue;
                    }

                    foreach ($tierKeys as $tier) {
                        $rate =
                            $tierRates[$tier]
                            ?? null;

                        /*
                         * Empty rate means delete the
                         * existing rate.
                         */
                        if (
                            $rate === null
                            || $rate === ''
                        ) {
                            $savingsCertificate
                                ->rates()
                                ->where(
                                    'year',
                                    $year
                                )
                                ->where(
                                    'tier',
                                    $tier
                                )
                                ->delete();

                            continue;
                        }

                        /*
                         * Create/update:
                         *
                         * certificate + tier + year
                         */
                        $savingsCertificate
                            ->rates()
                            ->updateOrCreate(
                                [
                                    'year' =>
                                        $year,

                                    'tier' =>
                                        $tier,
                                ],
                                [
                                    'interest_rate' =>
                                        $rate,
                                ]
                            );
                    }
                }
            }
        );

        return back()->with(
            'success',
            'Interest rates saved successfully.'
        );
    }

    private function authorizeOwnership(
        SavingsCertificate $savingsCertificate
    ): void {
        $savingsCertificate->loadMissing(
            'investment'
        );

        abort_unless(
            $savingsCertificate
                ->investment
                ->user_id === auth()->id(),
            404
        );
    }
}