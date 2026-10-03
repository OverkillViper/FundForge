<script lang="ts" setup>
import { router, Link } from '@inertiajs/vue3';
import { show } from '@/routes/investments/dps';

interface Investment {
    id: number;
    user_id: number;
    type: 'savings_certificate' | 'dps';
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
}

defineProps<{
    dps: Dps;
}>();
</script>

<template>
    <Link
        :href="show.url(dps)"
        class="group flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md"
    >
        <!-- Header -->
        <div class="flex items-start justify-between gap-4">
            <div class="flex min-w-0 items-center gap-3">
                <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                >
                    <span class="pi pi-wallet text-sm"></span>
                </div>

                <div class="min-w-0">
                    <div class="truncate font-semibold text-gray-900">
                        {{ dps.investment.name }}
                    </div>

                    <div class="mt-0.5 truncate text-xs text-gray-500">
                        {{ dps.bank_name }}
                    </div>
                </div>
            </div>

            <div class="flex shrink-0 items-center gap-2">
                <span
                    class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    :class="
                        dps.is_active
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-gray-100 text-gray-500'
                    "
                >
                    {{ dps.is_active ? 'Active' : 'Inactive' }}
                </span>

                <span
                    class="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition group-hover:bg-gray-100 group-hover:text-gray-600"
                >
                    <span class="pi pi-chevron-right text-xs"></span>
                </span>
            </div>
        </div>

        <!-- Summary -->
        <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-gray-50 px-3 py-2.5 border">
                <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Paid Amount
                </div>

                <div class="mt-1 text-base font-semibold text-gray-900">
                    {{ dps.payments_sum_amount || '0.00' }}
                    <span class="text-xs font-medium text-gray-400">BDT</span>
                </div>

                <div class="mt-0.5 text-[11px] text-gray-500">
                    {{ dps.payments_count }} payment{{ dps.payments_count !== 1 ? 's' : '' }}
                </div>
            </div>

            <div class="rounded-xl bg-gray-50 px-3 py-2.5 border">
                <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Installment
                </div>

                <div class="mt-1 text-base font-semibold text-gray-900">
                    {{ dps.installment_amount }}
                    <span class="text-xs font-medium text-gray-400">BDT</span>
                </div>

                <div class="mt-0.5 text-[11px] text-gray-500">
                    {{ dps.duration_years }} year{{ dps.duration_years !== 1 ? 's' : '' }}
                </div>
            </div>
        </div>

        <!-- Rates -->
        <div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <div class="flex items-center gap-1.5">
                <span class="text-xs text-gray-500">Interest</span>
                <span class="text-sm font-semibold text-gray-800">
                    {{ dps.interest_rate }}%
                </span>
            </div>

            <div class="h-4 w-px bg-gray-200"></div>

            <div class="flex items-center gap-1.5">
                <span class="text-xs text-gray-500">Tax</span>
                <span class="text-sm font-semibold text-gray-800">
                    {{ dps.tax_rate }}%
                </span>
            </div>

            <div class="h-4 w-px bg-gray-200"></div>

            <div class="flex items-center gap-1.5">
                <span class="text-xs text-gray-500">Duration</span>
                <span class="text-sm font-semibold text-gray-800">
                    {{ dps.duration_years }} Years
                </span>
            </div>
        </div>
    </Link>
</template>