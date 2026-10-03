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
        Schema::create('income_taxes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->unsignedInteger('from_year');
            $table->unsignedInteger('to_year');

            $table->decimal('current_salary', 15, 2)->default(0);
            $table->decimal('previous_salary', 15, 2)->default(0);

            $table->decimal('festival_bonus', 15, 2)->default(0);
            $table->decimal('other_bonus', 15, 2)->default(0);

            $table->decimal('net_bank_interest', 15, 2)->default(0);
            $table->decimal('net_bank_tds', 15, 2)->default(0);
            $table->decimal('net_bank_charges', 15, 2)->default(0);

            $table->timestamps();

            $table->unique([
                'user_id',
                'from_year',
                'to_year',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('income_taxes');
    }
};
