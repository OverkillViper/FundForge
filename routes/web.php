<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    require __DIR__.'/accounts.php';
    require __DIR__.'/transactions.php';
    require __DIR__.'/transfers.php';
    require __DIR__.'/budgets.php';
    require __DIR__.'/investments.php';
    require __DIR__.'/obligations.php';
    require __DIR__.'/incometax.php';
});

require __DIR__.'/settings.php';

Route::get('/transactions/debug', [TransactionController::class, 'debug'])->name('transactions.debug');