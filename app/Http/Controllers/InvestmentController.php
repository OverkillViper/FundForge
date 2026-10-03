<?php

namespace App\Http\Controllers;

use App\Models\Dps;
use App\Models\ProvidentFund;
use App\Models\SavingsCertificate;
use App\Models\Investment;
use Inertia\Inertia;
use Inertia\Response;


class InvestmentController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();

        return Inertia::render('Investments/Index', [
            'counts' => [
                'savings_certificates' => Investment::where('user_id', $userId)
                    ->where('type', 'savings_certificate')
                    ->count(),

                'dps' => Investment::where('user_id', $userId)
                    ->where('type', 'dps')
                    ->count(),
            ],

            'hasProvidentFund' => ProvidentFund::where('user_id', $userId)->exists(),
        ]);


    }
}