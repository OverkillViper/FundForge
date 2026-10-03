<?php

use App\Http\Controllers\AccountController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/accounts', [AccountController::class, 'index'])
        ->name('accounts.index');

    Route::post('/accounts', [AccountController::class, 'store'])
        ->name('accounts.store');

    Route::put('/accounts/{account}', [AccountController::class, 'update'])
        ->name('accounts.update');

    Route::patch('/accounts/{account}/status', [AccountController::class, 'toggleActive'])
        ->name('accounts.toggle-active');

    Route::delete('/accounts/{account}', [AccountController::class, 'destroy'])
        ->name('accounts.destroy');
});