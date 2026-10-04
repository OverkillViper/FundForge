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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');

            $table->string('account_number')
                ->nullable();

            $table->enum('type', [
                'bank',
                'cash',
                'mobile_wallet',
                'other',
            ]);

            $table->decimal('opening_balance', 15, 2)
                ->default(0);

            $table->decimal('balance', 15, 2)
                ->default(0);

            $table->char('currency', 3)
                ->default('BDT');

            $table->boolean('is_active')
                ->default(true);

            $table->timestamps();

            $table->index(['user_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
