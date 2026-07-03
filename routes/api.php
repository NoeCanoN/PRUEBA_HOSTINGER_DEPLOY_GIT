<?php

use App\Models\User\Controllers\AuthController;
use App\Models\Console\Controllers\ArtisanConsoleController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'profile']);
    Route::post('/console/execute', [ArtisanConsoleController::class, 'execute']);
});

