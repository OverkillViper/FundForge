<?php

use App\Http\Controllers\ObligationController;

Route::get(
    'obligations',
    [ObligationController::class, 'index']
)->name('obligations.index');

Route::get(
    'obligations/create',
    [ObligationController::class, 'create']
)->name('obligations.create');

Route::get(
    'obligations/settled',
    [ObligationController::class, 'settled']
)->name('obligations.settled');

Route::post(
    'obligations',
    [ObligationController::class, 'store']
)->name('obligations.store');

Route::get(
    'obligations/{obligation}/edit',
    [ObligationController::class, 'edit']
)->name('obligations.edit');

Route::put(
    'obligations/{obligation}',
    [ObligationController::class, 'update']
)->name('obligations.update');

Route::post(
    'obligations/{obligation}/settle',
    [ObligationController::class, 'settle']
)->name('obligations.settle');

Route::delete(
    'obligations/{obligation}',
    [ObligationController::class, 'destroy']
)->name('obligations.destroy');