<?php

namespace App\Models\Console\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Console\Requests\ExecuteCommandRequest;
use Illuminate\Support\Facades\Artisan;
use Exception;

class ArtisanConsoleController extends Controller
{
    /**
     * Lista de comandos permitidos (Whitelisting básico para mayor seguridad)
     */
    protected array $allowedCommands = [
        'migrate',
        'db:seed',
        'migrate:status',
        'migrate:rollback',
        'optimize:clear',
        'config:cache',
        'route:cache',
        'view:cache',
        'key:generate',
        'about'
    ];

    /**
     * Ejecutar un comando de Artisan de forma remota.
     */
    public function execute(ExecuteCommandRequest $request)
    {
        $commandString = trim($request->input('command'));
        
        // Extraer el nombre base del comando (ej: de "migrate --force" se extrae "migrate")
        $parts = explode(' ', $commandString);
        $baseCommand = $parts[0];

        // Verificar si el comando base está en la lista blanca de seguridad
        if (!in_array($baseCommand, $this->allowedCommands)) {
            return response()->json([
                'status' => 'error',
                'message' => "El comando base '{$baseCommand}' no está en la lista blanca de comandos autorizados por seguridad."
            ], 403);
        }

        try {
            // Ejecutar el comando de Artisan
            // Artisan::call acepta un string completo de comando con opciones
            $exitCode = Artisan::call($commandString);
            $output = Artisan::output();

            return response()->json([
                'status' => $exitCode === 0 ? 'success' : 'warning',
                'exit_code' => $exitCode,
                'output' => $output ?: 'El comando se ejecutó pero no devolvió ninguna salida de consola.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ocurrió un error al ejecutar el comando.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
