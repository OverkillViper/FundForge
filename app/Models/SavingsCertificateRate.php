<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavingsCertificateRate extends Model
{
    protected $fillable = [
        'savings_certificate_id',
        'tier',
        'year',
        'interest_rate',
    ];

    protected $casts = [
        'year' => 'integer',
        'interest_rate' => 'decimal:2',
    ];

    public function savingsCertificate(): BelongsTo
    {
        return $this->belongsTo(SavingsCertificate::class);
    }
}