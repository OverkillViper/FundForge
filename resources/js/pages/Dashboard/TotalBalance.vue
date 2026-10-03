<script lang="ts" setup>
import { router } from '@inertiajs/vue3';
import { index } from '@/routes/accounts';
import Button from 'primevue/button';
import { formatCurrency } from '@/lib/formatters';
import { ref } from 'vue';

const showBalance = ref(false);

interface Account {
    id: number;
    name: string;
    type: string;
    currency: string;
    balance: number;
}

interface TotalBalance {
    balance: number;
    accounts: Account[];
    account_count: number;
    percentage_change: number;
}

const props = defineProps<{
    totalBalance: TotalBalance;
}>();

const toggleBalance = () => {
    showBalance.value = !showBalance.value;
}

</script>

<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
        <!-- Balance Header -->
        <div class="flex items-start justify-between gap-x-2">
            <div class="flex-1">
                <div class="text-xs font-medium text-gray-500">Total Balance</div>
                <div class="flex gap-x-2 mt-2 text-2xl font-medium tracking-tight text-gray-600" :class="showBalance ? 'items-baseline' : 'items-center'">
                    <span v-if="showBalance">{{ formatCurrency(totalBalance.balance) }}</span>
                    <span v-else class="flex gap-x-1 text-gray-400 transition hover:text-gray-600" @click="showBalance = true">
                        <span v-for="i in 8" class="icon-asterisk"></span>
                    </span>
                    <span class="text-sm font-medium text-gray-400">BDT</span>
                </div>
            </div>

            <Button
                :icon="showBalance ? 'icon-eye-off' : 'icon-eye'"
                severity="secondary"
                size="small"
                v-tooltip.bottom="{
                    value: showBalance ? 'Hide Balance' : 'Show Balance',
                    class: 'text-xs! font-medium!',
                }"
                @click="toggleBalance"
            />
            <div class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <i class="pi pi-wallet text-sm"></i>
            </div>
        </div>

        <!-- Monthly Change -->
        <div class="mt-2 flex items-center gap-2 h-5" v-if="totalBalance.percentage_change">
            <span class="inline-flex h-5 items-center gap-1 rounded-md bg-emerald-50 px-1.5 text-[10px] font-semibold text-emerald-700">
                <i class="pi pi-arrow-up text-[8px]!"></i>
                {{ totalBalance.percentage_change }}%
            </span>

            <span class="text-[11px] text-gray-400">
                than last month
            </span>
        </div>
        <div class="h-5" v-else>
           
        </div>


        <!-- Accounts -->
        <div class="mt-7 flex-1 flex flex-col">
            <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-gray-700">Accounts</span>
                    <span class="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                        {{ (totalBalance.account_count < 10) && '0' }}{{ totalBalance.account_count }}
                    </span>
                </div>

                <Button 
                    @click="router.visit(index.url())"
                    label="View All"
                    icon="pi pi-arrow-up-right"
                    size="small"
                    severity="secondary"
                    rounded
                    outlined
                    class="text-[10px]!"
                />
            </div>

            <div class="divide-y divide-gray-100 rounded-lg border border-gray-100" v-if="totalBalance.account_count">
                <div
                    v-for="account in totalBalance.accounts"
                    :key="account.id"
                    class="flex items-center gap-3 px-3 py-3"
                >
                    <!-- Account Icon -->
                    <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <i class="pi pi-building-columns text-xs text-primary"></i>
                    </div>

                    <!-- Account Details -->
                    <div class="min-w-0 flex-1">
                        <div class="truncate text-xs font-semibold text-gray-800">
                            {{ account.name }}
                        </div>

                        <div class="mt-0.5 text-[10px] font-medium text-gray-400 capitalize">
                            {{ account.type }} account
                        </div>
                    </div>

                    <!-- Account Balance -->
                    <div class="shrink-0 text-right">
                        <div class="text-[9px] font-medium uppercase tracking-wide text-gray-400">
                            Balance
                        </div>

                        <div class="mt-0.5 text-xs font-semibold text-gray-600">
                            {{ formatCurrency(account.balance) }}
                            <span class="text-[9px] font-medium text-gray-400 uppercase">{{ account.currency }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="flex-1 flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                <div class="text-sm text-gray-600">Your account balance will appear here.</div>
                <div class="text-xs text-gray-400">Currently you dont have any account setup.</div>
            </div>
        </div>
    </div>
</template>