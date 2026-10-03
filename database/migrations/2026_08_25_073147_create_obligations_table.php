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
        Schema::create('obligations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('transaction_id')
                ->unique()
                ->constrained('transactions')
                ->restrictOnDelete();

            $table->enum('type', [
                'lending',
                'borrowing',
            ]);

            $table->string('person');

            $table->decimal('amount', 15, 2);

            $table->date('date');

            $table->date('due_date')->nullable();

            $table->text('note')->nullable();

            $table->boolean('is_settled')
                ->default(false);

            $table->timestamps();

            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'is_settled']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obligations');
    }
};
