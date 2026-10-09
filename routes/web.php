<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
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

Route::get('/debug-scheme', function (Request $request) {
    return response()->json([
        'secure' => $request->isSecure(),
        'scheme' => $request->getScheme(),
        'request_url' => $request->url(),
        'generated_url' => url('/dashboard'),
        'app_url' => config('app.url'),
    ]);
});