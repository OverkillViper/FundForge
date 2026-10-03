<?php

use App\Http\Controllers\BudgetController;

Route::resource('budgets', BudgetController::class)->except('create');
Route::get('budgets/create/{serial}', [BudgetController::class, 'create'])->name('budgets.create');