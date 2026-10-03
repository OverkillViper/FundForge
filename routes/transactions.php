<?php

use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CategoryController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete( '/transactions/bulk-destroy', [TransactionController::class, 'bulkDestroy'] )->name('transactions.bulk-destroy');    
    Route::resource('/transactions', TransactionController::class)->except(['show']);
    Route::get('/transactions/categories', [CategoryController::class, 'index'])->name('transactions.categories.index');
    Route::post('/transactions/categories', [CategoryController::class, 'store'])->name('transactions.categories.store');
    Route::put('/transactions/categories/{category}', [CategoryController::class, 'update'])->name('transactions.categories.update');
    Route::delete('/transactions/categories/{category}', [CategoryController::class, 'destroy'])->name('transactions.categories.destroy');
});