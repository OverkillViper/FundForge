<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import ScrollArea from 'primevue/scrollarea';
import ScrollAreaViewport from 'primevue/scrollareaviewport';
import ScrollAreaContent from 'primevue/scrollareacontent';
import ScrollAreaScrollbar from 'primevue/scrollareascrollbar';
import ScrollAreaHandle from 'primevue/scrollareahandle';

interface Account {
    id: number;
    name: string;
    opening_balance: number;
    stored_balance: number;
    calculated_balance: number;
}

interface AccountBalance {
    account_id: number;
    balance: number;
}

interface LedgerRow {
    key: string;
    date: string;
    kind: 'transaction' | 'transfer';
    title: string;
    amount: number;
    balances: AccountBalance[];
}

defineProps<{
    accounts: Account[];
    rows: LedgerRow[];
}>();

const formatAmount = (amount: number) =>
    new Intl.NumberFormat('en-BD', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

const formatSignedAmount = (amount: number) =>
    `${amount > 0 ? '+' : ''}${formatAmount(amount)}`;
</script>

<template>
    <Head title="Transaction Debug" />

    <AppLayout pageTitle="Transaction Debug">
        <template #content>
            <div class="space-y-4 p-4">
                <div>
                    <h2 class="text-lg font-semibold">Account Balance Debugger</h2>
                    <p class="text-sm text-gray-500">
                        Balances are replayed from opening balances in chronological order.
                    </p>
                </div>

                <div class="overflow-x-auto rounded-lg border border-gray-200">
                    <ScrollArea class="h-[70vh] w-[1500px] rounded-lg border border-gray-200">
                        <ScrollAreaViewport class="h-full w-full">
                            <ScrollAreaContent class="min-w-max">
                                <table class="w-full border-collapse text-sm">
                                    <thead>
                                        <tr class="bg-gray-50">
                                            <th class="sticky left-0 min-w-28 border-b border-r bg-gray-50 p-3 text-left">
                                                Date
                                            </th>
                                            <th class="min-w-56 border-b p-3 text-left">
                                                Transaction
                                            </th>
                                            <th class="min-w-32 border-b p-3 text-right">
                                                Amount
                                            </th>

                                            <th
                                                v-for="account in accounts"
                                                :key="account.id"
                                                class="min-w-48 border-b border-l p-3 text-right"
                                            >
                                                <div class="font-semibold">{{ account.name }}</div>
                                                <div class="mt-2 text-xs font-normal text-gray-500">
                                                    Opening: {{ formatAmount(account.opening_balance) }}
                                                </div>
                                                <div class="text-xs font-normal text-gray-500">
                                                    Stored: {{ formatAmount(account.stored_balance) }}
                                                </div>
                                                <div
                                                    class="text-xs font-medium"
                                                    :class="Math.abs(account.calculated_balance - account.stored_balance) > 0.01 ? 'text-red-600' : 'text-green-600'"
                                                >
                                                    Replayed: {{ formatAmount(account.calculated_balance) }}
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr
                                            v-for="row in rows"
                                            :key="row.key"
                                            class="transition-colors hover:bg-gray-50"
                                        >
                                            <td class="sticky left-0 border-b border-r bg-white p-3 whitespace-nowrap">
                                                {{ row.date }}
                                            </td>

                                            <td class="border-b p-3">
                                                <div>{{ row.title }}</div>
                                                <div class="mt-1 text-xs text-gray-400">
                                                    {{ row.kind }} #{{ row.key.split('-').pop() }}
                                                </div>
                                            </td>

                                            <td
                                                class="border-b p-3 text-right font-medium whitespace-nowrap"
                                                :class="row.kind === 'transfer' ? 'text-gray-700' : row.amount >= 0 ? 'text-green-600' : 'text-red-600'"
                                            >
                                                {{ row.kind === 'transfer' ? '' : row.amount > 0 ? '+' : '' }}{{ formatAmount(row.amount) }}
                                            </td>

                                            <td
                                                v-for="account in accounts"
                                                :key="account.id"
                                                class="border-b border-l p-3 text-right tabular-nums"
                                            >
                                                <template
                                                    v-for="change in row.balances.filter(item => item.account_id === account.id)"
                                                    :key="change.account_id"
                                                >
                                                    {{ formatAmount(change.balance) }}
                                                </template>
                                            </td>
                                        </tr>

                                        <tr v-if="rows.length === 0">
                                            <td
                                                :colspan="3 + accounts.length"
                                                class="p-8 text-center text-gray-400"
                                            >
                                                No transactions or transfers found.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </ScrollAreaContent>
                        </ScrollAreaViewport>

                        <ScrollAreaScrollbar orientation="horizontal">
                            <ScrollAreaHandle />
                        </ScrollAreaScrollbar>

                        <ScrollAreaScrollbar orientation="vertical">
                            <ScrollAreaHandle />
                        </ScrollAreaScrollbar>
                    </ScrollArea>
                </div>
            </div>
        </template>
    </AppLayout>
</template>