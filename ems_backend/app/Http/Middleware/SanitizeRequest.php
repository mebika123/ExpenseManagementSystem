<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    protected array $except = [
        'password',
        'password_confirmation',
    ];
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        array_walk_recursive($input, function (&$value) {
            if (! is_string($value)) return;
            $value = strip_tags($value);
            $value = trim($value);
            $value = preg_replace('/\s+/u', ' ', $value);
            $value = $value === '' ? null : $value;
        });

        $request->merge($input);

        return $next($request);
    }
}
