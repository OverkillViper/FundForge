<script lang="ts" setup>
import { router } from '@inertiajs/vue3';
import Button from 'primevue/button';
import ScrollPanel from 'primevue/scrollpanel';
import { create } from '@/routes/investments/savings-certificates';
import { formatCurrency } from '@/lib/formatters.js';
import SavingsCertificateCard from './SavingsCertificateCard.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import StatCard from '@/pages/Investments/StatCard.vue';

interface Investment {
    id: number;
    user_id: number;
    type: 'savings_certificate' | 'dps';
    name: string;
    start_date: string;
    created_at: string;
    updated_at: string;
}

interface SavingsCertificate {
    id: number;
    investment_id: number;
    issue_date: string;
    duration_years: number;
    principal_value: string;
    interest_interval_months: number;
    tax_percent: string;
    created_at: string;
    updated_at: string;
    investment: Investment;
}

interface Interest {
    month: string;
    gross_interest: number;
    tax_amount: number;
    net_interest: number;
}

defineProps<{
    certificates: SavingsCertificate[];
    total_investment: number;
    current_tax_percent: number;
    current_month_interest: Interest;
}>();
</script>

<template>
<AppLayout pageTitle="Savings Certificates">
    <template #toolbar>
        <Button label="New Certificate" icon="pi pi-plus" size="small" @click="router.visit(create.url())" />
    </template>

    <template #content>
        <!-- Summary -->
        <div v-if="certificates.length" class="mt-2 grid grid-cols-3 gap-4">
            <StatCard 
                icon="icon-landmark"
                :value="formatCurrency(total_investment.toString())"
                title="Active Investment"
                prefix="BDT"
            />
            <StatCard 
                icon="icon-percent"
                :value="current_tax_percent"
                title="Current Tax Rate"
                prefix="%"
            />
            <StatCard 
                icon="icon-dollar-sign"
                :value="formatCurrency(current_month_interest.net_interest.toString())"
                title="This months interest"
                prefix="BDT"
            />
        </div>

        <!-- Certificates -->
        <ScrollPanel class="mt-5 h-[610px]">
            <div class="flex flex-col gap-4 px-1 pb-4">
                <SavingsCertificateCard v-for="certificate in certificates" :key="certificate.id" :certificate="certificate" />

                <!-- Empty State -->
                <div v-if="certificates.length === 0" class="col-span-2 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 px-6 text-center">
                    <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                        <i class="pi pi-building-columns text-lg text-gray-400"></i>
                    </div>

                    <div class="mt-4 text-sm font-semibold text-gray-700">No savings certificates</div>
                    <div class="mt-1 max-w-sm text-xs leading-5 text-gray-400">Add your first savings certificate to start tracking your investment, interest, and tax information.</div>

                    <Button label="Add Certificate" icon="pi pi-plus" size="small" severity="secondary" class="mt-4" @click="router.visit(create.url())" />
                </div>
            </div>
        </ScrollPanel>
    </template>
</AppLayout>
</template>
