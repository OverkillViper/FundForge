<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Category;
use App\Models\IncomeTaxSlab;
use App\Models\SavingsCertificateTaxBracket;
use App\Models\User;
use App\Models\UserSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        return DB::transaction(function () use ($input) {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
            ]);

            UserSetting::create([
                'user_id' => $user->id,
            ]);

            $this->createDefaultIncomeTaxSlabs($user);
            $this->createDefaultSavingsCertificateTaxBrackets($user);
            $this->createDefaultCategories($user);

            return $user;
        });
    }

    private function createDefaultIncomeTaxSlabs(User $user): void
    {
        $slabs = [
            ['income_from' => 0, 'income_to' => 400000, 'tax_percent' => 0],
            ['income_from' => 400000, 'income_to' => 700000, 'tax_percent' => 10],
            ['income_from' => 700000, 'income_to' => 1100000, 'tax_percent' => 15],
            ['income_from' => 1100000, 'income_to' => 1600000, 'tax_percent' => 20],
            ['income_from' => 1600000, 'income_to' => 21600000, 'tax_percent' => 25],
            ['income_from' => 21600000, 'income_to' => null, 'tax_percent' => 30],
        ];

        foreach ($slabs as $slab) {
            IncomeTaxSlab::create([
                'user_id' => $user->id,
                'income_from' => $slab['income_from'],
                'income_to' => $slab['income_to'],
                'tax_percent' => $slab['tax_percent'],
            ]);
        }
    }

    private function createDefaultSavingsCertificateTaxBrackets(User $user): void
    {
        $taxBrackets = [
            ['minimum_investment' => 0, 'tax_percent' => 5],
            ['minimum_investment' => 750000, 'tax_percent' => 10],
        ];

        foreach ($taxBrackets as $bracket) {
            SavingsCertificateTaxBracket::create([
                'user_id' => $user->id,
                'minimum_investment' => $bracket['minimum_investment'],
                'tax_percent' => $bracket['tax_percent'],
            ]);
        }
    }

    private function createDefaultCategories(User $user): void
    {
        $categories = [
            ['name' => 'Food & essentials', 'icon' => 'soup'],
            ['name' => 'Clothing', 'icon' => 'shirt'],
            ['name' => 'Transport', 'icon' => 'car'],
            ['name' => 'Utility', 'icon' => 'zap'],
            ['name' => 'Education', 'icon' => 'graduation-cap'],
            ['name' => 'Travel & Vacation', 'icon' => 'plane'],
            ['name' => 'Festival', 'icon' => 'balloon'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'user_id' => $user->id,
                'name' => $category['name'],
                'icon' => $category['icon'],
            ]);
        }
    }
}