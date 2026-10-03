<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalaryTdsController;
use App\Http\Controllers\IncomeTaxController;

Route::resource('income-taxes', IncomeTaxController::class)
    ->only(['index', 'store']);


Route::resource(
    'income-taxes/salary-tds',
    SalaryTdsController::class
)
    ->parameters([
        'salary-tds' => 'salaryTds',
    ])
    ->except([
        'show',
    ]);