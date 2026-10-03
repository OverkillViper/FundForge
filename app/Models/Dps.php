<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dps extends Model
{
    use HasFactory;

    protected $fillable = [
        'investment_id',
        'bank_name',
        'installment_amount',
        'duration_years',
        'is_active',
        'interest_rate',
        'tax_rate',
    ];

    protected $casts = [
        'installment_amount' => 'decimal:2',
        'interest_rate' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'duration_years' => 'integer',
        'is_active' => 'boolean',
    ];

    public function investment(): BelongsTo
    {
        return $this->belongsTo(Investment::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(DpsPayment::class);
    }
}