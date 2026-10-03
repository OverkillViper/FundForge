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
        Schema::create('dps_payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('dps_id')
                ->constrained('dps')
                ->cascadeOnDelete();

            $table->foreignId('transaction_id')
                ->constrained('transactions')
                ->cascadeOnDelete();

            $table->decimal('amount', 15, 2);

            $table->date('payment_date');

            $table->timestamps();

            $table->unique('transaction_id');

            $table->index(['dps_id', 'payment_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dps_payment');
    }
};
