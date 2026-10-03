<?php

use App\Http\Controllers\InvestmentController;
use App\Http\Controllers\SavingsCertificateController;
use App\Http\Controllers\DpsController;
use App\Http\Controllers\ProvidentFundController;
use App\Models\ProvidentFundContribution;

// Investments
Route::get('investments', [InvestmentController::class, 'index'])->name('investments.index');

// SavingsCertificate
Route::get(
    'investments/savings-certificates',
    [SavingsCertificateController::class, 'index'])
    ->name('investments.savings-certificates.index');
Route::get(
    'investments/savings-certificates/create',
    [SavingsCertificateController::class, 'create'])
    ->name('investments.savings-certificates.create');
Route::get(
    'investments/savings-certificates/{savingsCertificate}',
    [SavingsCertificateController::class, 'show'])
    ->name('investments.savings-certificates.show');
Route::post(
    'investments/savings-certificates',
    [SavingsCertificateController::class, 'store'])
    ->name('investments.savings-certificates.store');
Route::get(
    'investments/savings-certificates/edit/{savingsCertificate}',
    [SavingsCertificateController::class, 'edit'])
    ->name('investments.savings-certificates.edit');
Route::put(
    'investments/savings-certificates/{savingsCertificate}',
    [SavingsCertificateController::class, 'update'])
    ->name('investments.savings-certificates.update');
Route::delete(
    'investments/savings-certificates/{savingsCertificate}',
    [SavingsCertificateController::class, 'destroy'])
    ->name('investments.savings-certificates.destroy');
Route::get(
    'investments/savings-certificates/{savingsCertificate}/rates',
    [SavingsCertificateController::class, 'rates'])
    ->name('savings-certificates.rates');

Route::put(
    'investments/savings-certificates/{savingsCertificate}/rates',
    [SavingsCertificateController::class, 'updateRates'])
    ->name('savings-certificates.rates.update');

// DPS
Route::get(
    'investments/dps',
    [DpsController::class, 'index']
)->name('investments.dps.index');

Route::get(
    'investments/dps/create',
    [DpsController::class, 'create']
)->name('investments.dps.create');

Route::post(
    'investments/dps/store',
    [DpsController::class, 'store']
)->name('investments.dps.store');

Route::get(
    'investments/dps/{dps}',
    [DpsController::class, 'show']
)->name('investments.dps.show');
Route::get(
    'investments/dps/edit/{dps}',
    [DpsController::class, 'edit']
)->name('investments.dps.edit');
Route::delete(
    'investments/dps/{dps}',
    [DpsController::class, 'destroy']
)->name('investments.dps.destroy');

Route::put(
    'investments/dps/update/{dps}',
    [DpsController::class, 'update']
)->name('investments.dps.update');

// DPS Payments

Route::post(
    'investments/dps/{dps}/payment',
    [DpsController::class, 'storePayment']
)->name('investments.dps.payment.store');

Route::put(
    'investments/dps/payment/{payment}',
    [DpsController::class, 'updatePayment']
)->name('investments.dps.payment.update');

Route::delete(
    'investments/dps/payment/{payment}',
    [DpsController::class, 'destroyPayment']
)->name('investments.dps.payment.destroy');

// ProvidentFund
Route::get(
    'investments/provident-fund',
    [ProvidentFundController::class, 'show']
)->name('investments.provident-fund.show');

Route::post(
    'investments/provident-fund',
    [ProvidentFundController::class, 'store']
)->name('investments.provident-fund.store');

Route::get(
    'investments/provident-fund/edit',
    [ProvidentFundController::class, 'edit']
)->name('investments.provident-fund.edit');

Route::put(
    'investments/provident-fund',
    [ProvidentFundController::class, 'update']
)->name('investments.provident-fund.update');

Route::delete(
    'investments/provident-fund',
    [ProvidentFundController::class, 'destroy']
)->name('investments.provident-fund.destroy');


// Provident Fund Interest Rates

Route::get(
    'investments/provident-fund/rates',
    [ProvidentFundController::class, 'rates']
)->name('investments.provident-fund.rates');

Route::put(
    'investments/provident-fund/rates',
    [ProvidentFundController::class, 'updateRates']
)->name('investments.provident-fund.rates.update');

// Provident Fund Contributions

Route::model(
    'contribution',
    ProvidentFundContribution::class
);

Route::post(
    'investments/provident-fund/contribution',
    [ProvidentFundController::class, 'storeContribution']
)->name('investments.provident-fund.contribution.store');

Route::put(
    'investments/provident-fund/contribution/{contribution}',
    [ProvidentFundController::class, 'updateContribution']
)->name('investments.provident-fund.contribution.update');

Route::delete(
    'investments/provident-fund/contribution/{contribution}',
    [ProvidentFundController::class, 'destroyContribution']
)->name('investments.provident-fund.contribution.destroy');