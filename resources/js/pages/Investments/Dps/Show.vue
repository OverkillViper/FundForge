<script lang="ts" setup>
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';

import { edit, destroy } from '@/routes/investments/dps';
import { formatCurrency } from '@/lib/formatters.js';
import InstallmentHistory from './InstallmentHistory.vue';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import AppLayout from '@/layouts/AppLayout.vue';

interface Investment {
    id: number;
    user_id: number;
    type: 'savings_dps' | 'dps';
    name: string;
    start_date: string;
    created_at: string;
    updated_at: string;
}

interface Dps {
    id: number;
    investment_id: number;
    bank_name: string;
    installment_amount: number;
    duration_years: number;
    interest_rate: number;
    tax_rate: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    payments_sum_amount: number;
    payments_count: number;
    investment: Investment;
    payments: Payment[];
}

interface Payment {
    id: number;
    dps_id: number;
    transaction_id: number;
    amount: string | number;
    payment_date: string;
    created_at: string;
    updated_at: string;
    transaction?: {
        id: number;
        account?: {
            id: number;
            name: string;
            currency: string;
        };
    };
}

interface Account {
    id: number;
    name: string;
    account_number: string | null;
    type: string;
    opening_balance: string | number;
    balance: string | number;
    currency: string;
    is_active: boolean;
}

const props = defineProps<{
    dps: Dps;
    accounts: Account[];
}>();

const deleteDialogVisible = ref(false);
const deleting = ref(false);

const openDeleteDialog = () => {
    deleteDialogVisible.value = true;
};

const deleteDps = () => {
    if (deleting.value) return;

    deleting.value = true;

    router.delete(destroy.url(props.dps.id), {
        preserveScroll: true,
        onFinish: () => {
            deleting.value = false;
            deleteDialogVisible.value = false;
        },
    });
};

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';

    const [year, month, day] = dateString.slice(0, 10).split('-').map(Number);

    return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).replace(/(\d+) (\w+) (\d+)/, '$1 $2, $3');
};
</script>

<template>
    <AppLayout pageTitle="">
        <template #toolbar>
            <Button
                label="Edit dps"
                icon="pi pi-pencil"
                size="small"
                :disabled="deleting"
                @click="router.visit(edit.url(dps.id))"
            />

            <Button
                label="Delete dps"
                icon="pi pi-trash"
                severity="secondary"
                size="small"
                :disabled="deleting"
                @click="openDeleteDialog"
            />
        </template>

        <template #content>
            <div class="flex flex-col gap-4 lg:flex-row">
                <div class="rounded-lg bg-primary p-3 lg:w-1/6">
                    <div class="border-b border-b-primary-200 pb-2 text-xs text-gray-100">
                        Total Payments
                    </div>

                    <div class="mt-3 flex items-baseline gap-x-2 text-white lg:mt-9">
                        <span class="text-3xl">{{ formatCurrency(dps.payments_sum_amount || 0) }}</span>
                        <span class="text-sm text-gray-200">BDT</span>
                    </div>
                </div>

                <div class="rounded-lg bg-primary p-3 lg:w-1/6">
                    <div class="border-b border-b-primary-200 pb-2 text-xs text-gray-100">
                        Total installments
                    </div>

                    <div class="mt-3 flex items-baseline gap-x-2 text-white lg:mt-9">
                        <span class="text-3xl">
                            {{ dps.payments_count < 10 && dps.payments_count > 0 ? '0' : '' }}{{ dps.payments_count }}
                        </span>
                    </div>
                </div>

                <div class="flex-1"></div>

                <div class="flex flex-col justify-center text-sm lg:w-1/5">
                    <div class="flex py-0.5">
                        <span class="w-40 text-gray-500">Issue Date</span>
                        <span class="w-full text-end font-semibold lg:w-40">
                            {{ formatDate(dps.investment.start_date) }}
                        </span>
                    </div>

                    <div class="flex py-0.5">
                        <span class="w-40 text-gray-500">Duration</span>
                        <span class="w-full text-end font-semibold lg:w-40">{{ dps.duration_years }} years</span>
                    </div>

                    <div class="flex py-0.5">
                        <span class="w-40 text-gray-500">Interest Rate</span>
                        <span class="w-full text-end font-semibold lg:w-40">{{ dps.interest_rate }} %</span>
                    </div>

                    <div class="flex py-0.5">
                        <span class="w-40 text-gray-500">Tax Rate</span>
                        <span class="w-full text-end font-semibold lg:w-40">{{ dps.tax_rate }} %</span>
                    </div>

                    <div class="flex py-0.5">
                        <span class="w-40 text-gray-500">Installment Amount</span>
                        <span class="w-full text-end font-semibold lg:w-40">
                            {{ formatCurrency(dps.installment_amount || 0) }} BDT
                        </span>
                    </div>
                </div>
            </div>

            <InstallmentHistory
                :payments="dps.payments"
                :accounts="accounts"
                :amount="dps.installment_amount"
                :dps_id="dps.id"
            />

            <Dialog
                v-model:visible="deleteDialogVisible"
                modal
                header="Delete DPS?"
                class="w-[22rem] lg:w-[28rem]"
                :closable="!deleting"
                :closeOnEscape="!deleting"
            >
                <div class="flex flex-col gap-4">
                    <div class="flex items-start gap-3">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <i class="pi pi-exclamation-triangle text-lg"></i>
                        </div>

                        <div class="flex flex-col gap-1">
                            <div class="font-medium">{{ dps.investment.name }}</div>
                            <div class="text-sm text-gray-500">
                                This action will permanently delete this DPS.
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-3 rounded-lg border p-4">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500">Installments</span>
                            <span class="font-medium">{{ dps.payments_count }}</span>
                        </div>

                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500">Total paid</span>
                            <span class="font-medium">
                                {{ formatCurrency(dps.payments_sum_amount || 0) }} BDT
                            </span>
                        </div>

                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500">Associated transactions</span>
                            <span class="font-medium">{{ dps.payments_count }}</span>
                        </div>
                    </div>

                    <div class="text-sm leading-relaxed text-gray-600">
                        The associated installment transactions will also be deleted.
                        The affected account balances will be restored accordingly.
                    </div>

                    <div class="text-sm font-medium text-red-600">
                        This action cannot be undone.
                    </div>
                </div>

                <template #footer>
                    <Button
                        label="Cancel"
                        severity="secondary"
                        outlined
                        size="small"
                        :disabled="deleting"
                        @click="deleteDialogVisible = false"
                    />

                    <Button
                        label="Delete DPS"
                        icon="pi pi-trash"
                        severity="danger"
                        size="small"
                        :loading="deleting"
                        :disabled="deleting"
                        @click="deleteDps"
                    />
                </template>
            </Dialog>
        </template>
    </AppLayout>
</template>