<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SavingsCertificate;
use App\Models\SavingsCertificateRate;
use App\Models\User;
use App\Models\Investment;

class SavingsCertificateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'asifemon66@gmail.com')->first();

        if (!$user) {
            $this->command->error("User with email 'asifemon66@gmail.com' not found.");
            return;
        }

        $certificates = [
            ['name' => 'Savings Certificate 1', 'start_date' => '2023-08-16', 'duration_years' => 3, 'principal_value' => 400000, 'interest_interval_months' => 3 ],
            ['name' => 'Savings Certificate 2', 'start_date' => '2025-04-29', 'duration_years' => 3, 'principal_value' => 400000, 'interest_interval_months' => 3 ],
            ['name' => 'Savings Certificate 3', 'start_date' => '2026-04-29', 'duration_years' => 3, 'principal_value' => 400000, 'interest_interval_months' => 3 ],
        ];


        $rates = [
            [ 'savings_certificate_id' => 1, 'tier' => 'lower', 'year' => 1, 'interest_rate' =>	10.00, ],
            [ 'savings_certificate_id' => 1, 'tier' => 'lower', 'year' => 2, 'interest_rate' =>	10.50, ],
            [ 'savings_certificate_id' => 1, 'tier' => 'lower', 'year' => 3, 'interest_rate' =>	11.04, ],
            [ 'savings_certificate_id' => 2, 'tier' => 'lower', 'year' => 1, 'interest_rate' =>	11.04, ],
            [ 'savings_certificate_id' => 2, 'tier' => 'upper', 'year' => 1, 'interest_rate' =>	11.00, ],
            [ 'savings_certificate_id' => 2, 'tier' => 'lower', 'year' => 2, 'interest_rate' =>	11.65, ],
            [ 'savings_certificate_id' => 2, 'tier' => 'upper', 'year' => 2, 'interest_rate' =>	11.61, ],
            [ 'savings_certificate_id' => 2, 'tier' => 'lower', 'year' => 3, 'interest_rate' =>	12.30, ],
            [ 'savings_certificate_id' => 2, 'tier' => 'upper', 'year' => 3, 'interest_rate' =>	12.25, ],
            [ 'savings_certificate_id' => 3, 'tier' => 'upper', 'year' => 1, 'interest_rate' =>	10.60, ],
            [ 'savings_certificate_id' => 3, 'tier' => 'upper', 'year' => 2, 'interest_rate' =>	11.16, ],
            [ 'savings_certificate_id' => 3, 'tier' => 'upper', 'year' => 3, 'interest_rate' =>	11.77, ],
        ];

        foreach ($certificates as $certificate) {
            $investment = Investment::firstOrCreate([
                'user_id'     => $user->id,
                'type'        => 'savings_certificate',
                'name'        => $certificate['name'],
                'start_date'  => $certificate['start_date'],
            ]);

            SavingsCertificate::firstOrCreate([
                'investment_id'             => $investment->id,
                'issue_date'                => $certificate['start_date'],
                'duration_years'            => $certificate['duration_years'],
                'principal_value'           => $certificate['principal_value'],
                'interest_interval_months'  => $certificate['interest_interval_months'],
            ]);
        }

        foreach ($rates as $rate) {
            SavingsCertificateRate::firstOrCreate([
                'savings_certificate_id'  => $rate['savings_certificate_id'],
                'tier'                    => $rate['tier'],
                'year'                    => $rate['year'],
                'interest_rate'           => $rate['interest_rate'],
            ]);
        }

        $this->command->info("Savings certificate seeded successfully for {$user->email}.");
    }
}
