<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->unsignedTinyInteger('salary_effective_month')->default(1);
            $table->unsignedTinyInteger('provident_fund_percentage')->default(10);
            $table->unsignedTinyInteger('rebate_percentage')->default(10);
            $table->unsignedInteger('dps_investment_cap')->default(120000);
            $table->unsignedInteger('max_rebate_cap')->default(750000);
            $table->unique('user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};
