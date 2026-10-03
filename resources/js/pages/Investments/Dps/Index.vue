<script lang="ts" setup>
import Button from 'primevue/button';
import { create } from '@/routes/investments/dps';
import { router } from '@inertiajs/vue3';
import { formatCurrency } from '@/lib/formatters.js';
import DpsCard from '@/pages/Investments/Dps/DpsCard.vue';
import { computed } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import StatCard from '@/pages/Investments/StatCard.vue';

interface Investment {
    id         : number;
    user_id    : number;
    type       : 'savings_certificate' | 'dps';
    name       : string;
    start_date : string;
    created_at : string;
    updated_at : string;
}

interface Dps {
    id                  : number;
    investment_id       : number;
    bank_name           : string;
    installment_amount  : number;
    duration_years      : number;
    interest_rate       : number;
    tax_rate            : number;
    is_active           : boolean;
    created_at          : string;
    updated_at          : string;
    payments_sum_amount : number;
    payments_count      : number;
    investment          : Investment;
}

const props = defineProps<{
    dps: Dps[];
}>();

const totalInvestment = computed(() => {
    return props.dps.reduce((sum, item) => sum + Number(item.payments_sum_amount || 0), 0,);
});
</script>

<template>
<AppLayout pageTitle="Deposite Pension Schemes">
    <template #toolbar>
        <Button
            label="Create Scheme"
            icon="pi pi-plus"
            size="small"
            @click="router.visit(create.url())"
        />
    </template>
    <template #content>
        <div class="flex flex-col">
            <div class="mb-4 grid grid-cols-3 gap-x-6 border-b pb-4" v-if="dps.length">
                <StatCard 
                    icon="icon-landmark"
                    :value="formatCurrency(totalInvestment)"
                    title="Total Investment"
                    prefix="BDT"
                />
            </div>
            <div class="grid grid-cols-3 gap-4">
                <DpsCard :dps="d" v-for="d in dps" :key="d.id" />

                <div v-if="dps.length === 0" class="col-span-3 rounded-2xl flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-300 bg-gray-50/70">
                    <i class="pi pi-exclamation-triangle text-3xl text-gray-400"></i>

                    <div class="mt-3 font-medium text-gray-700">
                        No DPS schemes yet
                    </div>

                    <div class="mt-1 text-sm text-gray-500">
                        Your DPS schemes will appear here.
                    </div>

                    <Button
                        label="Create Scheme"
                        icon="pi pi-plus"
                        size="small"
                        severity="secondary"
                        class="mt-4"
                        @click="router.visit(create.url())"
                    />
                </div>
            </div>
        </div>
    </template>
</AppLayout>
</template>
