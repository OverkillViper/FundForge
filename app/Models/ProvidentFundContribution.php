<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProvidentFundContribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'provident_fund_id',
        'amount',
        'contribution_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'contribution_date' => 'date',
    ];

    public function providentFund(): BelongsTo
    {
        return $this->belongsTo(
            ProvidentFund::class
        );
    }
}