<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transfer;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AccountBalanceSyncService
{
    public function syncAll(User $user): int
    {
        return DB::transaction(function () use ($user) {
            $accounts = Account::query()
                ->where('user_id', $user->id)
                ->orderBy('id')
                ->lockForUpdate()
                ->get();

            $this->recalculate($user, $accounts);

            return $accounts->count();
        });
    }

    public function syncAccount(User $user, int $accountId): int
    {
        return DB::transaction(function () use ($user, $accountId) {
            $account = Account::query()
                ->where('user_id', $user->id)
                ->findOrFail($accountId);

            $transfers = Transfer::query()
                ->where('user_id', $user->id)
                ->get(['from_account_id', 'to_account_id']);

            $connectedIds = [$account->id => true];
            $changed = true;

            while ($changed) {
                $changed = false;

                foreach ($transfers as $transfer) {
                    $fromId = $transfer->from_account_id;
                    $toId = $transfer->to_account_id;

                    if (isset($connectedIds[$fromId]) && !isset($connectedIds[$toId])) {
                        $connectedIds[$toId] = true;
                        $changed = true;
                    }

                    if (isset($connectedIds[$toId]) && !isset($connectedIds[$fromId])) {
                        $connectedIds[$fromId] = true;
                        $changed = true;
                    }
                }
            }

            $accounts = Account::query()
                ->where('user_id', $user->id)
                ->whereIn('id', array_keys($connectedIds))
                ->orderBy('id')
                ->lockForUpdate()
                ->get();

            $this->recalculate($user, $accounts);

            return $accounts->count();
        });
    }

    private function recalculate(User $user, Collection $accounts): void
    {
        if ($accounts->isEmpty()) {
            return;
        }

        $accountIds = $accounts->pluck('id');

        $balances = $accounts->mapWithKeys(fn (Account $account) => [
            $account->id => (float) $account->opening_balance,
        ])->all();

        $transactions = DB::table('transactions')
            ->where('user_id', $user->id)
            ->whereIn('account_id', $accountIds)
            ->selectRaw('account_id, type, SUM(amount) as total')
            ->groupBy('account_id', 'type')
            ->get();

        foreach ($transactions as $transaction) {
            $amount = (float) $transaction->total;

            $balances[$transaction->account_id] += match ($transaction->type) {
                'income', 'borrowing' => $amount,
                'expense', 'investment', 'lending' => -$amount,
                default => 0,
            };
        }

        $transfers = Transfer::query()
            ->where('user_id', $user->id)
            ->where(function ($query) use ($accountIds) {
                $query->whereIn('from_account_id', $accountIds)
                    ->orWhereIn('to_account_id', $accountIds);
            })
            ->get(['from_account_id', 'to_account_id', 'amount']);

        foreach ($transfers as $transfer) {
            $amount = (float) $transfer->amount;

            if (isset($balances[$transfer->from_account_id])) {
                $balances[$transfer->from_account_id] -= $amount;
            }

            if (isset($balances[$transfer->to_account_id])) {
                $balances[$transfer->to_account_id] += $amount;
            }
        }

        foreach ($accounts as $account) {
            $account->balance = number_format($balances[$account->id], 2, '.', '');
            $account->save();
        }
    }
}