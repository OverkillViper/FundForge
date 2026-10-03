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
        Schema::create('savings_certificates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('investment_id')
                ->constrained('investments')
                ->cascadeOnDelete();

            $table->date('issue_date');

            $table->unsignedInteger('duration_years');

            $table->decimal('principal_value', 15, 2);

            $table->unsignedInteger('interest_interval_months');

            $table->timestamps();

            $table->unique('investment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savings_certificates');
    }
};
