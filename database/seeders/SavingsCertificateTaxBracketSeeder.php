<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SavingsCertificateTaxBracket;

class SavingsCertificateTaxBracketSeeder extends Seeder
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

        // Define your tax bracket data
        $taxBrackets = [
            [
                'minimum_investment' => 0.00,
                'tax_percent' => 5.00,
            ],
            [
                'minimum_investment' => 750000.00,
                'tax_percent' => 10.00,
            ],
        ];

        foreach ($taxBrackets as $bracket) {
            SavingsCertificateTaxBracket::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'minimum_investment' => $bracket['minimum_investment'],
                ],
                [
                    'tax_percent' => $bracket['tax_percent'],
                ]
            );
        }

        $this->command->info("Savings certificate tax brackets seeded successfully for {$user->email}.");
    }
}
