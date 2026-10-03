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
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('from_account_id')
                ->constrained('accounts')
                ->restrictOnDelete();

            $table->foreignId('to_account_id')
                ->constrained('accounts')
                ->restrictOnDelete();

            $table->decimal('amount', 15, 2);

            $table->date('transfer_date');

            $table->text('note')->nullable();

            $table->string('reference')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'transfer_date']);
            $table->index(['from_account_id', 'transfer_date']);
            $table->index(['to_account_id', 'transfer_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
