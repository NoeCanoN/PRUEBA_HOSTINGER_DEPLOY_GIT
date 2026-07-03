<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Numero\Numero;

class NumeroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar tabla previa
        Numero::truncate();

        // Poblar con números de prueba
        $numeros = [7, 14, 21, 28, 35, 42, 49, 77, 99];

        foreach ($numeros as $valor) {
            Numero::create([
                'valor' => $valor
            ]);
        }
    }
}
