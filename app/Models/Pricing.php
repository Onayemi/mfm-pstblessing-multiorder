<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['group_type', 'price'])] #'key', 'name', 'amount'
class Pricing extends Model
{
    //
}
