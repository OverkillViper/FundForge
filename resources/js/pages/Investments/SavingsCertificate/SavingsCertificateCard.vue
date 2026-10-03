<script lang="ts" setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';

import { show } from '@/routes/investments/savings-certificates';
import { formatCurrency } from '@/lib/formatters';

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

const props = defineProps<{
    certificate: SavingsCertificate;
}>();

const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(dateString));
};

const maturityDate = computed(() => {
    const date = new Date(props.certificate.issue_date);
    date.setFullYear(date.getFullYear() + props.certificate.duration_years);
    return date;
});

const isActive = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maturity = new Date(maturityDate.value);
    maturity.setHours(0, 0, 0, 0);

    return today <= maturity;
});
</script>

<template>
    <Link :href="show.url(certificate.id)" class="group flex min-h-20 items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">
        <!-- Icon -->
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <i class="pi pi-building-columns text-sm text-primary"></i>
        </div>

        <!-- Name -->
        <div class="min-w-48 flex-1">
            <div class="truncate text-sm font-semibold text-gray-800">
                {{ certificate.investment.name }}
            </div>

            <div class="mt-0.5 text-[10px] text-gray-400">
                Savings Certificate
            </div>
        </div>

        <!-- Principal -->
        <div class="w-32 shrink-0">
            <div class="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                Principal
            </div>

            <div class="mt-0.5 flex items-baseline gap-1">
                <span class="text-sm font-semibold text-gray-700">
                    {{ formatCurrency(certificate.principal_value) }}
                </span>
                <span class="text-[9px] text-gray-400">BDT</span>
            </div>
        </div>

        <!-- Issue Date -->
        <div class="w-28 shrink-0">
            <div class="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                Issued
            </div>

            <div class="mt-0.5 text-xs font-medium text-gray-600">
                {{ formatDate(certificate.issue_date) }}
            </div>
        </div>

        <!-- Maturity -->
        <div class="w-28 shrink-0">
            <div class="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                Maturity
            </div>

            <div class="mt-0.5 text-xs font-medium text-gray-600">
                {{ formatDate(maturityDate) }}
            </div>
        </div>

        <!-- Duration -->
        <div class="w-20 shrink-0">
            <div class="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                Duration
            </div>

            <div class="mt-0.5 text-xs font-medium text-gray-600">
                {{ certificate.duration_years }} years
            </div>
        </div>

        <!-- Status -->
        <div class="w-20 shrink-0">
            <span
                :class="isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'"
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
            >
                <span :class="isActive ? 'bg-emerald-500' : 'bg-gray-400'" class="h-1.5 w-1.5 rounded-full"></span>
                {{ isActive ? 'Active' : 'Matured' }}
            </span>
        </div>

        <!-- Arrow -->
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-300 transition-all group-hover:bg-primary/10 group-hover:text-primary">
            <i class="pi pi-chevron-right text-xs"></i>
        </div>
    </Link>
</template>