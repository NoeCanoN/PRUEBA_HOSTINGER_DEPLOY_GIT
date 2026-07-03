<?php

namespace App\Models\Numero;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['valor'])]
class Numero extends Model
{
    protected $table = 'numeros';
}
