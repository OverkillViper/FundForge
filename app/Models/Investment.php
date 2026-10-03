<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Investment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'name',
        'start_date',
    ];

    protected $casts = [
        'start_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function savingsCertificate(): HasOne
    {
        return $this->hasOne(SavingsCertificate::class);
    }

    public function dps(): HasOne
    {
        return $this->hasOne(Dps::class);
    }
}