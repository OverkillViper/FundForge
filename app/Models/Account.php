<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'opening_balance',
        'balance',
        'currency',
        'is_active',
        'account_number',
    ];

    protected $casts = [
        'opening_balance' => 'decimal:2',
        'balance' => 'decimal:2',
        'is_active' => 'boolean',
        'account_number' => 'string',
    ];

    /**
     * The user who owns the account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Transactions belonging to this account.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Transfers sent from this account.
     */
    public function outgoingTransfers(): HasMany
    {
        return $this->hasMany(
            Transfer::class,
            'from_account_id'
        );
    }

    /**
     * Transfers received by this account.
     */
    public function incomingTransfers(): HasMany
    {
        return $this->hasMany(
            Transfer::class,
            'to_account_id'
        );
    }
}
