<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\IncomeTaxSlab;
use App\Models\SavingsCertificateTaxBracket;
use App\Models\UserSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $settings = UserSetting::firstOrCreate(
            ['user_id' => $user->id],
            [
                'salary_effective_month' => 1,
                'provident_fund_percentage' => 10,
                'rebate_percentage' => 10,
                'dps_investment_cap' => 120000,
                'max_rebate_cap' => 750000,
            ]
        );

        return Inertia::render('settings/Settings', [
            'settings' => $settings,
            'savingsCertificateTaxBrackets' => SavingsCertificateTaxBracket::where('user_id', $user->id)->orderBy('minimum_investment')->get(),
            'incomeTaxSlabs' => IncomeTaxSlab::where('user_id', $user->id)->orderBy('income_from')->get(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'salary_effective_month' => ['required', 'integer', 'between:1,12'],
            'provident_fund_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'rebate_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'dps_investment_cap' => ['required', 'numeric', 'min:0'],
            'max_rebate_cap' => ['required', 'numeric', 'min:0'],
        ]);

        UserSetting::updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return back()->with('success', 'Settings updated successfully.');
    }

    public function updateSavingsCertificateTaxBrackets(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'brackets' => ['required', 'array', 'min:1'],
            'brackets.*.minimum_investment' => ['required', 'numeric', 'min:0'],
            'brackets.*.tax_percent' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $userId = $request->user()->id;

            SavingsCertificateTaxBracket::where('user_id', $userId)->delete();

            foreach ($validated['brackets'] as $bracket) {
                SavingsCertificateTaxBracket::create([
                    'user_id' => $userId,
                    'minimum_investment' => $bracket['minimum_investment'],
                    'tax_percent' => $bracket['tax_percent'],
                ]);
            }
        });

        return back()->with('success', 'Savings certificate tax brackets updated successfully.');
    }

    public function updateIncomeTaxSlabs(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'slabs' => ['required', 'array', 'min:1'],
            'slabs.*.income_from' => ['required', 'numeric', 'min:0'],
            'slabs.*.income_to' => ['nullable', 'numeric', 'min:0'],
            'slabs.*.tax_percent' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $userId = $request->user()->id;

            IncomeTaxSlab::where('user_id', $userId)->delete();

            foreach ($validated['slabs'] as $slab) {
                IncomeTaxSlab::create([
                    'user_id' => $userId,
                    'income_from' => $slab['income_from'],
                    'income_to' => $slab['income_to'],
                    'tax_percent' => $slab['tax_percent'],
                ]);
            }
        });

        return back()->with('success', 'Income tax slabs updated successfully.');
    }

    public function restoreDefaults(Request $request): RedirectResponse
    {
        $user = $request->user();

        DB::transaction(function () use ($user) {
            UserSetting::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'salary_effective_month' => 1,
                    'provident_fund_percentage' => 10,
                    'rebate_percentage' => 10,
                    'dps_investment_cap' => 120000,
                    'max_rebate_cap' => 750000,
                ]
            );

            IncomeTaxSlab::where('user_id', $user->id)->delete();

            $incomeTaxSlabs = [
                ['income_from' => 0, 'income_to' => 400000, 'tax_percent' => 0],
                ['income_from' => 400000, 'income_to' => 700000, 'tax_percent' => 10],
                ['income_from' => 700000, 'income_to' => 1100000, 'tax_percent' => 15],
                ['income_from' => 1100000, 'income_to' => 1600000, 'tax_percent' => 20],
                ['income_from' => 1600000, 'income_to' => 21600000, 'tax_percent' => 25],
                ['income_from' => 21600000, 'income_to' => null, 'tax_percent' => 30],
            ];

            foreach ($incomeTaxSlabs as $slab) {
                IncomeTaxSlab::create([
                    'user_id' => $user->id,
                    'income_from' => $slab['income_from'],
                    'income_to' => $slab['income_to'],
                    'tax_percent' => $slab['tax_percent'],
                ]);
            }

            SavingsCertificateTaxBracket::where('user_id', $user->id)->delete();

            $savingsCertificateTaxBrackets = [
                ['minimum_investment' => 0, 'tax_percent' => 5],
                ['minimum_investment' => 750000, 'tax_percent' => 10],
            ];

            foreach ($savingsCertificateTaxBrackets as $bracket) {
                SavingsCertificateTaxBracket::create([
                    'user_id' => $user->id,
                    'minimum_investment' => $bracket['minimum_investment'],
                    'tax_percent' => $bracket['tax_percent'],
                ]);
            }
        });

        return back()->with('success', 'Tax settings restored to defaults.');
    }
}