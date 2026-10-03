<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncomeTax extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'from_year',
        'to_year',
        'current_salary',
        'previous_salary',
        'festival_bonus',
        'other_bonus',
        'net_bank_interest',
        'net_bank_tds',
        'net_bank_charges',
    ];

    protected $casts = [
        'from_year' => 'integer',
        'to_year' => 'integer',
        'current_salary' => 'decimal:2',
        'previous_salary' => 'decimal:2',
        'festival_bonus' => 'decimal:2',
        'other_bonus' => 'decimal:2',
        'net_bank_interest' => 'decimal:2',
        'net_bank_tds' => 'decimal:2',
        'net_bank_charges' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}