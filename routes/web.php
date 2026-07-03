<?php

use Illuminate\Support\Facades\Route;

Route::get('/api/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'club-nutricional',
    ]);
});

// Delegar cualquier ruta web al frontend (SPA Vue)
Route::fallback(function () {
    return view('app');
});
