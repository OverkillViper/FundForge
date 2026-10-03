<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('income_tax_slabs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->decimal('income_from', 15, 2);
            $table->decimal('income_to', 15, 2)->nullable();

            $table->decimal('tax_percent', 5, 2);

            $table->timestamps();

            $table->unique('income_from');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('income_tax_slabs');
    }
};
