<script lang="ts" setup>
import { router } from '@inertiajs/vue3';
import Button from 'primevue/button';
import { formatCurrency } from '@/lib/formatters';
import { index } from '@/routes/transactions';

interface Transaction {
    id: number;
    title: string;
    date: string;
    category: string | null;
    account: string;
    account_type: string;
    amount: number;
    currency: string;
    type: string;
}

const props = defineProps<{
    recentTransactions: Transaction[];
}>();

const typeConfig = (type: Transaction['type']) => {
    const config = {
        income: {
            icon: 'pi pi-arrow-down-left',
            bg: 'bg-emerald-50',
            color: 'text-emerald-600',
            prefix: '+',
        },
        expense: {
            icon: 'pi pi-arrow-up-right',
            bg: 'bg-rose-50',
            color: 'text-rose-600',
            prefix: '-',
        },
        investment: {
            icon: 'pi pi-chart-line',
            bg: 'bg-primary/10',
            color: 'text-primary',
            prefix: '-',
        },
        lending: {
            icon: 'pi pi-arrow-up-right',
            bg: 'bg-amber-50',
            color: 'text-amber-600',
            prefix: '-',
        },
        borrowing: {
            icon: 'pi pi-arrow-down-left',
            bg: 'bg-amber-50',
            color: 'text-amber-600',
            prefix: '+',
        },
    };

    return config[type as keyof typeof config] ?? {
        icon: 'pi pi-circle',
        bg: 'bg-gray-50',
        color: 'text-gray-500',
        prefix: '',
    };
};

const amountPrefix = (transaction: Transaction) => typeConfig(transaction.type).prefix;
</script>

<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <div class="text-sm font-semibold text-gray-700">Recent Transactions</div>
                <div class="mt-0.5 text-[10px] text-gray-400">Your latest financial activity</div>
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

        <!-- Transactions -->
        <div class="mt-3 overflow-hidden rounded-lg border border-gray-100" v-if="props.recentTransactions.length">
            <div
                v-for="transaction in props.recentTransactions"
                :key="transaction.id"
                class="grid grid-cols-[minmax(0,1fr)_minmax(95px,auto)] items-center gap-x-2 gap-y-2 border-b border-gray-100 px-3 py-3 transition-colors last:border-b-0 hover:bg-gray-50/70 lg:grid-cols-[61%_155px_110px_110px] lg:gap-0 lg:py-2.5"
            >
                <!-- Transaction -->
                <div class="flex min-w-0 items-center gap-2.5 lg:col-auto">
                    <div
                        class="flex size-9 shrink-0 items-center justify-center rounded-lg"
                        :class="typeConfig(transaction.type).bg"
                    >
                        <i
                            :class="[typeConfig(transaction.type).icon, typeConfig(transaction.type).color]"
                            class="text-xs!"
                        ></i>
                    </div>

                    <div class="min-w-0">
                        <div class="truncate text-xs font-semibold text-gray-800 lg:text-sm">
                            {{ transaction.title }}
                        </div>

                        <div
                            v-if="transaction.category"
                            class="mt-0.5 truncate text-[10px] text-gray-500"
                        >
                            {{ transaction.category }}
                        </div>
                    </div>
                </div>

                <!-- Amount -->
                <div class="flex min-w-0 flex-col items-end lg:col-auto lg:row-auto lg:order-last">
                    <div
                        class="whitespace-nowrap text-xs font-semibold sm:text-sm"
                        :class="typeConfig(transaction.type).color"
                    >
                        {{ amountPrefix(transaction) }}{{ formatCurrency(transaction.amount) }}
                    </div>

                    <div class="text-[9px] font-medium text-gray-400">
                        {{ transaction.currency }}
                    </div>
                </div>

                <!-- Account -->
                <div class="col-start-1 flex min-w-0 items-center gap-2 pl-0.5 lg:col-auto lg:pl-0">
                    <i class="pi pi-wallet shrink-0 text-[10px] text-gray-400"></i>

                    <div class="truncate text-[10px] text-gray-500 lg:text-xs">
                        {{ transaction.account }}
                        <span v-if="transaction.account_type" class="text-gray-400">
                            · {{ transaction.account_type }}
                        </span>
                    </div>
                </div>

                <!-- Date -->
                <div class="col-start-2 row-start-2 whitespace-nowrap text-right text-[10px] font-medium text-gray-500 lg:col-auto lg:row-auto lg:text-xs">
                    {{ transaction.date }}
                </div>
            </div>
        </div>
        <div class="min-h-26 flex-1 bg-gray-50 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl mt-4" v-else>
            <div class="text-sm text-gray-600">Your latest transactions will appear here</div>
            <div class="text-xs text-gray-400">Currently you dont have any transactions</div>
        </div>
    </div>
</template>