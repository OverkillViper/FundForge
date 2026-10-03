<?php

namespace Database\Seeders;

use App\Models\IncomeTaxSlab;
use Illuminate\Database\Seeder;
use App\Models\User;

class IncomeTaxSlabSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'asifemon66@gmail.com')->first();

        if (!$user) {
            $this->command->error("User with email 'asifemon66@gmail.com' not found.");
            return;
        }

        $slabs = [
            [ 'income_from' => 0,        'income_to' => 400000,     'tax_percent' => 0,  ],
            [ 'income_from' => 400000,   'income_to' => 700000,     'tax_percent' => 10, ],
            [ 'income_from' => 700000,   'income_to' => 1100000,    'tax_percent' => 15, ],
            [ 'income_from' => 1100000,  'income_to' => 1600000,    'tax_percent' => 20, ],
            [ 'income_from' => 1600000,  'income_to' => 21600000,   'tax_percent' => 25, ],
            [ 'income_from' => 21600000, 'income_to' => null,       'tax_percent' => 30, ],
        ];

        foreach ($slabs as $slab) {
            IncomeTaxSlab::firstOrCreate(
                [
                    'user_id'     => $user->id,
                    'income_from' => $slab['income_from'],
                    'income_to'   => $slab['income_to'],
                ],
                [
                    'tax_percent' => $slab['tax_percent'],
                ]
            );
        }
    }
}