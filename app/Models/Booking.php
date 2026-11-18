<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'ticket_code',
    'customer_name',
    'phone_number',
    'attendees',
    'total_price',
    'booked_at',
    'processed_by',
])]
class Booking extends Model
{
    protected $casts = [
        'attendees' => 'array',
        'total_price' => 'decimal:2',
        'booked_at' => 'datetime',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
