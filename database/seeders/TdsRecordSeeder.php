<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SalaryTds;

class TdsRecordSeeder extends Seeder
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

        $tds_records = [
            [ 'date' => '2025-07-01', 'amount' => 1103 ],
            [ 'date' => '2025-08-01', 'amount' => 1102 ],
            [ 'date' => '2025-09-01', 'amount' => 1103 ],
            [ 'date' => '2025-10-01', 'amount' => 1102 ],
            [ 'date' => '2025-11-01', 'amount' => 1103 ],
            [ 'date' => '2025-12-01', 'amount' => 1102 ],
            [ 'date' => '2026-01-01', 'amount' => 1663 ],
            [ 'date' => '2026-02-01', 'amount' => 3130 ],
            [ 'date' => '2026-03-01', 'amount' => 7494 ],
            [ 'date' => '2026-04-01', 'amount' => 3130 ],
            [ 'date' => '2026-05-01', 'amount' => 7495 ],
        ];

        foreach ($tds_records as $record) {
            SalaryTds::firstOrCreate([
                'user_id'  => $user->id,
                'date'     => $record['date'],
                'amount'   => $record['amount'],
            ]);
        }

        $this->command->info("  Salary TDS record seeded successfully for {$user->email}.");
    }
}
