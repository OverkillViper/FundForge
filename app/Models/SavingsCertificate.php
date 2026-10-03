<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SavingsCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'investment_id',
        'issue_date',
        'duration_years',
        'principal_value',
        'interest_interval_months',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'principal_value' => 'decimal:2',
    ];

    public function investment(): BelongsTo
    {
        return $this->belongsTo(Investment::class);
    }

    public function rates(): HasMany
    {
        return $this->hasMany(SavingsCertificateRate::class);
    }
}