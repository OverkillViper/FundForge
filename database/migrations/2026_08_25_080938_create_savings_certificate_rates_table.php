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
        Schema::create('savings_certificate_rates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('savings_certificate_id')
                ->constrained('savings_certificates')
                ->cascadeOnDelete();

            $table->string('tier', 50);

            $table->unsignedInteger('year');

            $table->decimal('interest_rate', 5, 2);

            $table->timestamps();

            $table->unique([
                'savings_certificate_id',
                'tier',
                'year',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savings_certificate_rates');
    }
};
