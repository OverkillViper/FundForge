<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'asifemon66@gmail.com')->first();

        if (!$user) {
            $this->command->error(
                "User with email 'asifemon66@gmail.com' not found."
            );

            return;
        }

        $user->settings()->updateOrCreate(
            [],
            [
                'salary_effective_month' => 1,
                'provident_fund_percentage' => 10,
            ]
        );

        $this->command->info(
            "User settings seeded successfully for {$user->email}."
        );
    }
}