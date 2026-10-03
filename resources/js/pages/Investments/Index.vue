<script lang="ts" setup>
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, Link } from '@inertiajs/vue3';

interface Counts {
    savings_certificates?: number;
    dps?: number;
}

const props = defineProps<{
    counts?: Counts;
    hasProvidentFund?: boolean;
}>();

const investments = [
    {
        title: 'Savings Certificate',
        description: 'Track certificates, rates, maturity and returns.',
        count: () => props.counts?.savings_certificates ?? 0,
        countLabel: 'certificates',
        href: 'investments/savings-certificates',
        icon: 'icon-receipt',
    },
    {
        title: 'Deposit Pension Scheme',
        description: 'Manage DPS accounts, installments and payments.',
        count: () => props.counts?.dps ?? 0,
        countLabel: 'DPS accounts',
        href: 'investments/dps',
        icon: 'icon-piggy-bank',
    },
    {
        title: 'Provident Fund',
        description: 'Track contributions and estimate your fund value.',
        count: () => (props.hasProvidentFund ? 1 : 0),
        countLabel: 'fund',
        href: 'investments/provident-fund',
        icon: 'icon-banknote-arrow-down',
    },
];
</script>

<template>
<AppLayout page-title="Investments">
    <template #content>
        <!-- Investment cards -->
        <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Link
                v-for="investment in investments"
                :key="investment.title"
                :href="investment.href"
                class="group rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
            >
                <!-- Top row -->
                <div class="flex items-start justify-between">
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white"
                    >
                        <i :class="[investment.icon, 'text-xl!']"></i>
                    </div>

                    <i
                        class="pi pi-arrow-up-right text-xs text-gray-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                    ></i>
                </div>

                <!-- Content -->
                <div class="mt-5">
                    <div class="text-base font-medium text-gray-800">
                        {{ investment.title }}
                    </div>

                    <div class="mt-1 text-xs leading-5 text-gray-500">
                        {{ investment.description }}
                    </div>
                </div>

                <!-- Footer -->
                <div
                    class="mt-5 flex items-center justify-between border-t border-gray-100 pt-3"
                >
                    <span class="text-xs text-gray-400">
                        {{ investment.count() > 0 ? investment.count() : 'No' }}
                        {{ investment.countLabel }}
                    </span>

                    <span
                        class="text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    >
                        View details
                    </span>
                </div>
            </Link>
        </div>

        <!-- Empty/help section -->
        <div
            class="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50/70 p-5"
        >
            <div class="flex items-start gap-3">
                <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm"
                >
                    <i class="pi pi-chart-line text-sm"></i>
                </div>

                <div>
                    <div class="text-sm font-medium text-gray-700">
                        Keep your investments organized
                    </div>

                    <div class="mt-1 text-xs leading-5 text-gray-500">
                        Add your savings certificates, DPS accounts and
                        provident fund to keep your investment information
                        together and monitor their progress over time.
                    </div>
                </div>
            </div>
        </div>
    </template>
</AppLayout>
</template>
