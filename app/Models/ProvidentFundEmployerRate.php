<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProvidentFundEmployerRate extends Model
{
    use HasFactory;

    protected $fillable = [
        'provident_fund_id',
        'boundary_years',
        'employer_rate',
    ];

    protected $casts = [
        'boundary_years' => 'integer',
        'employer_rate' => 'decimal:2',
    ];

    public function providentFund(): BelongsTo
    {
        return $this->belongsTo(
            ProvidentFund::class
        );
    }
}