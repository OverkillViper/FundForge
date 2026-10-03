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
        Schema::create('provident_fund_employer_rates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('provident_fund_id')
                ->constrained('provident_funds')
                ->cascadeOnDelete();

            $table->unsignedInteger('boundary_years');

            $table->decimal('employer_rate', 5, 2);

            $table->timestamps();

            $table->unique([
                'provident_fund_id',
                'boundary_years',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('provident_fund_employer_rates');
    }
};
