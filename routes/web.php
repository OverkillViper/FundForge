<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::inertia('/', 'Welcome')->name('home');

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

Route::get('/debug-scheme', function (Illuminate\Http\Request $request) {
    return response()->json([
        'secure' => $request->isSecure(),
        'scheme' => $request->getScheme(),
        'host' => $request->getHost(),
        'url' => $request->url(),
        'full_url' => $request->fullUrl(),
        'forwarded_proto' => $request->header('X-Forwarded-Proto'),
        'forwarded_host' => $request->header('X-Forwarded-Host'),
        'app_url' => config('app.url'),
    ]);
});
