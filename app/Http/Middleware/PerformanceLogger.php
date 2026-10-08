<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class PerformanceLogger
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        DB::flushQueryLog();
        DB::enableQueryLog();

        $response = $next($request);

        $duration = (microtime(true) - $start) * 1000;
        $queries = DB::getQueryLog();

        $queryTime = collect($queries)->sum('time');

        logger()->warning('PERFORMANCE', [
            'url' => $request->fullUrl(),
            'duration_ms' => round($duration, 2),
            'query_count' => count($queries),
            'query_time_ms' => round($queryTime, 2),
            'php_time_ms' => round($duration - $queryTime, 2),
            'memory_mb' => round(memory_get_usage(true) / 1024 / 1024, 2),
            'peak_memory_mb' => round(memory_get_peak_usage(true) / 1024 / 1024, 2),
        ]);

        collect($queries)
            ->sortByDesc('time')
            ->take(10)
            ->values()
            ->each(function (array $query, int $index): void {
                logger()->warning('SLOW QUERY', [
                    'rank' => $index + 1,
                    'time_ms' => $query['time'],
                    'sql' => $query['query'],
                    'bindings' => $query['bindings'],
                ]);
            });

        return $response;
    }
}