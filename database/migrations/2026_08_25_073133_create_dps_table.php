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
        Schema::create('dps', function (Blueprint $table) {
            $table->id();

            $table->foreignId('investment_id')
                ->constrained('investments')
                ->cascadeOnDelete();

            $table->string('bank_name');

            $table->decimal('installment_amount', 15, 2);

            $table->unsignedInteger('duration_years');

            $table->decimal('interest_rate', 5, 2);

            $table->decimal('tax_rate', 5, 2);

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->unique('investment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dps');
    }
};
