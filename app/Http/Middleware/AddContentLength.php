<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddContentLength
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (
            $response->getContent() !== false &&
            !$response->headers->has('Content-Length')
        ) {
            $content = $response->getContent();

            if ($content !== false) {
                $response->headers->set(
                    'Content-Length',
                    (string) strlen($content)
                );
            }
        }

        return $response;
    }
}