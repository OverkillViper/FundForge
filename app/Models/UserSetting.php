<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSetting extends Model
{
    protected $fillable = [
        'user_id',
        'salary_effective_month',
        'provident_fund_percentage',
        'rebate_percentage',
        'dps_investment_cap',
        'max_rebate_cap',
    ];

    protected $casts = [
        'salary_effective_month' => 'integer',
        'provident_fund_percentage' => 'integer',
        'rebate_percentage' => 'integer',
        'dps_investment_cap' => 'decimal:2',
        'max_rebate_cap' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}