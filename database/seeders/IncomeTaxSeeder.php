<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\IncomeTax;

class IncomeTaxSeeder extends Seeder
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

        IncomeTax::firstOrCreate([
            'user_id'            => $user->id,
            'from_year'          => 2025,
            'to_year'            => 2026,
            'current_salary'     => 109120,
            'previous_salary'    => 88000,
            'festival_bonus'     => 109120,
            'other_bonus'        => 7000,
            'net_bank_interest'  => 1181,
            'net_bank_tds'       => 239,
            'net_bank_charges'   => 0,
        ]);
    }
}
