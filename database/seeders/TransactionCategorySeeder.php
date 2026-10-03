<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\User;

class TransactionCategorySeeder extends Seeder
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
        
        $categories = [
            ['name' => 'Food & essentials', 'icon' => 'soup'],
            ['name' => 'Clothing',          'icon' => 'shirt'],
            ['name' => 'Transport',         'icon' => 'car'],
            ['name' => 'Utility',           'icon' => 'zap'],
            ['name' => 'Education',         'icon' => 'graduation-cap'],
            ['name' => 'Travel & Vacation', 'icon' => 'plane'],
            ['name' => 'Festival',          'icon' => 'balloon'],
        ];

        foreach ($categories as $category) {
            $this->command->info("    Creating category: {$category['name']}");
            
            Category::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'name' => $category['name'],
                    'icon' => $category['icon'],
                ],
            );
        }

        $this->command->info("  Category seeded successfully for {$user->email}.");
    }
}
