<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\Response;

class NormalizeIsoDates
{
    /**
     * Common fields across forms that contain JS ISO Date strings.
     */
    protected array $dateFields = [
        'transaction_date',
        'purchase_date',
        'maturity_date',
        'issue_date',
        'date',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        foreach ($this->dateFields as $field) {
            if ($request->has($field) && is_string($request->input($field))) {
                try {
                    // Check if value looks like a full ISO timestamp from JS (e.g., "2025-08-28T18:00:00.000Z")
                    if (str_contains($request->input($field), 'T')) {
                        $input[$field] = Carbon::parse($request->input($field))
                            ->setTimezone(config('app.timezone', 'Asia/Dhaka'))
                            ->format('Y-m-d');
                    }
                } catch (\Exception $e) {
                    // Skip if invalid date string
                }
            }
        }

        $request->replace($input);

        return $next($request);
    }
}