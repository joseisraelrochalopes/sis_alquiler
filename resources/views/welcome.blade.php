<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>Alquiler</title>

        {{-- PWA --}}
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#0f172a">
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png">

        {{-- Vite --}}
        @vite(['resources/css/app.css', 'resources/js/app.js'])

        {{-- Tu script de spline, lo dejamos igual --}}
        <script type="module" src="https://unpkg.com/@splinetool/viewer@1.12.0/build/spline-viewer.js"></script>
    </head>

    <body>
        @if (Route::has('login'))
            <div class="top-right-links">
                @auth
                    <a href="{{ url('/dashboard') }}" class="rotate-in-hor">Dashboard</a>
                @else
                    <a href="{{ route('login') }}" class="rotate-in-hor">Login</a>

                    @if (Route::has('register'))
                        <a href="{{ route('register') }}" class="rotate-in-hor">Register</a>
                    @endif
                @endauth
            </div>
        @endif

    </body>
</html>
