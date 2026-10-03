<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncomeTaxSlab extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'income_from',
        'income_to',
        'tax_percent',
    ];

    protected $casts = [
        'income_from' => 'decimal:2',
        'income_to' => 'decimal:2',
        'tax_percent' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}