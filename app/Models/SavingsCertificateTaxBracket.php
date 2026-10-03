<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavingsCertificateTaxBracket extends Model
{
    protected $fillable = [
        'user_id',
        'minimum_investment',
        'tax_percent',
    ];

    protected $casts = [
        'minimum_investment' => 'decimal:2',
        'tax_percent' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}