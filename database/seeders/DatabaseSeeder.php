<?php

namespace Database\Seeders;

use App\Models\User\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Limpiar usuarios previos para evitar conflictos de email único
        User::query()->delete();

        // Crear usuario administrador del Club Nutricional
        User::create([
            'name' => 'Administrador Club',
            'email' => 'admin@clubnutricional.com',
            'password' => Hash::make('password123'),
        ]);

        // Registrar seeders adicionales
        $this->call(NumeroSeeder::class);
    }
}
