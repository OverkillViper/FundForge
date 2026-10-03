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
        Schema::create('salary_tds', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // Store the first day of the relevant month.
            // Example: 2026-09-01 represents September 2026.
            $table->date('date');

            $table->decimal('amount', 15, 2);

            $table->timestamps();

            $table->unique([
                'user_id',
                'date',
            ]);

            $table->index([
                'user_id',
                'date',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salary_tds');
    }
};
