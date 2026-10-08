<?php

use App\Models\Investment;
use App\Models\SavingsCertificate;
use App\Models\SavingsCertificateTaxBracket;
use App\Models\User;
use App\Services\SavingsCertificateService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

test('interest schedules reuse user data and preserve certificate calculation rules', function () {
    $user = User::factory()->create();

    $createCertificate = function (
        string $name,
        string $issueDate,
        int $durationYears,
        float $principal,
        array $rates
    ) use ($user): SavingsCertificate {
        $investment = Investment::create([
            'user_id' => $user->id,
            'type' => 'savings_certificate',
            'name' => $name,
            'start_date' => $issueDate,
        ]);

        $certificate = SavingsCertificate::create([
            'investment_id' => $investment->id,
            'issue_date' => $issueDate,
            'duration_years' => $durationYears,
            'principal_value' => $principal,
            'interest_interval_months' => 12,
        ]);

        foreach ($rates as $rate) {
            $certificate->rates()->create($rate);
        }

        return $certificate;
    };

    $firstCertificate = $createCertificate(
        'First',
        '2020-01-01',
        1,
        600000,
        [
            ['tier' => 'lower', 'year' => 1, 'interest_rate' => 3],
        ]
    );

    $secondCertificate = $createCertificate(
        'Second',
        '2021-01-01',
        3,
        400000,
        [
            ['tier' => 'lower', 'year' => 1, 'interest_rate' => 1.5],
            ['tier' => 'upper', 'year' => 1, 'interest_rate' => 2.5],
            ['tier' => 'lower', 'year' => 3, 'interest_rate' => 4],
            ['tier' => 'upper', 'year' => 3, 'interest_rate' => 6],
        ]
    );
    $createCertificate(
        'Third',
        '2021-01-01',
        5,
        100000,
        []
    );

    SavingsCertificateTaxBracket::create([
        'user_id' => $user->id,
        'minimum_investment' => 0,
        'tax_percent' => 5,
    ]);
    SavingsCertificateTaxBracket::create([
        'user_id' => $user->id,
        'minimum_investment' => 900000,
        'tax_percent' => 10,
    ]);

    $service = app(SavingsCertificateService::class);
    $calculationData = $service->getUserCalculationData($user->id);
    $loadedSecondCertificate = $calculationData['certificates']
        ->firstWhere('id', $secondCertificate->id);

    $maturityDate = Carbon::parse('2021-01-01 12:00');

    expect($service->getCumulativeInvestmentOnDate(
        $user->id,
        $maturityDate,
        true,
        true,
        $calculationData
    ))->toBe(1100000.0);

    expect($service->getCumulativeInvestmentOnDate(
        $user->id,
        $maturityDate,
        true,
        false,
        $calculationData
    ))->toBe(500000.0);

    expect($service->getHighestCumulativeInvestmentOnDate(
        $user->id,
        Carbon::parse('2023-01-01'),
        $calculationData
    ))->toBe(1100000.0);

    DB::enableQueryLog();
    DB::flushQueryLog();
    $schedule = $service->buildInterestSchedule(
        $loadedSecondCertificate,
        $calculationData
    );
    $scheduleQueries = DB::getQueryLog();
    DB::disableQueryLog();

    expect($scheduleQueries)->toBe([])
        ->and($schedule['history'][0]['cumulative_investment'])->toBe(500000.0)
        ->and($schedule['history'][0]['tax_basis'])->toBe(1100000.0)
        ->and($schedule['history'][0]['tax_percent'])->toBe(10.0)
        ->and($schedule['history'][0]['rate_breakdown'])->toBe([
            [
                'tier' => 'lower',
                'principal' => 150000.0,
                'annual_rate' => 4.0,
                'minimum_investment' => 0.0,
                'maximum_investment' => 750000.0,
            ],
            [
                'tier' => 'upper',
                'principal' => 250000.0,
                'annual_rate' => 6.0,
                'minimum_investment' => 750000.0,
                'maximum_investment' => null,
            ],
        ])
        ->and($schedule['history'][0]['gross_interest'])->toBe(21000.0)
        ->and($schedule['history'][0]['tax'])->toBe(2100.0)
        ->and($schedule['history'][0]['net_interest'])->toBe(18900.0);
});