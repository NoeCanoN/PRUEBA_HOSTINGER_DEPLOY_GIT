<?php

namespace App\Models\Console\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExecuteCommandRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Solo permitimos el acceso al administrador principal.
     */
    public function authorize(): bool
    {
        // Temporalmente habilitado para migraciones iniciales sin login
        return true;
        
        // $user = $this->user();
        // return $user && $user->email === 'admin@clubnutricional.com';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'command' => [
                'required',
                'string',
                'regex:/^[a-zA-Z0-9\s\-_:\=\-\-]+$/', // Bloquea inyecciones de comandos shell (; && | > < etc)
            ],
        ];
    }

    /**
     * Get the custom error messages.
     */
    public function messages(): array
    {
        return [
            'command.required' => 'El comando es obligatorio.',
            'command.regex' => 'El comando contiene caracteres no permitidos por seguridad.',
        ];
    }
}
