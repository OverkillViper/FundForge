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
        Schema::create('provident_fund_contributions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('provident_fund_id')
                ->constrained('provident_funds')
                ->cascadeOnDelete();

            $table->decimal('amount', 15, 2);

            $table->date('contribution_date');

            $table->timestamps();

            $table->index([
                'provident_fund_id',
                'contribution_date',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('provident_fund_contributions');
    }
};
