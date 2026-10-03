<script lang="ts" setup>
import Chart from 'primevue/chart';
import { computed } from 'vue';

interface Category {
    id: number;
    name: string;
    amount: number;
    percentage: number;
}

interface ExpenseCategory {
    categories: Category[];
    average_daily: number;
    average_monthly: number;
    ytd_yearly: number;
}

const props = defineProps<{
    expenseCategories: ExpenseCategory;
}>();

const chartColors = [
    '#1a5e75',
    '#28748a',
    '#43899b',
    '#6aa5b3',
    '#a8c7cf',
];

const chartData = computed(() => ({
    labels: props.expenseCategories.categories.map(category => category.name),
    datasets: [
        {
            data: props.expenseCategories.categories.map(category => category.amount),
            backgroundColor: chartColors,
            borderWidth: 0,
            hoverOffset: 4,
        },
    ],
}));

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: (context: any) => {
                    const value = Number(context.raw).toLocaleString('en-IN');
                    return ` ${value} BDT`;
                },
            },
        },
    },
};

const totalExpenses = computed(() =>
    props.expenseCategories.categories.reduce(
        (total, category) => total + category.amount,
        0,
    ),
);

const formatAmount = (amount: number) => amount.toLocaleString('en-IN');
</script>

<template>
    <div class="flex flex-col rounded-2xl border border-gray-200 bg-white p-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <div class="text-sm font-semibold text-gray-700">Expenses</div>
                <div class="mt-0.5 text-[10px] text-gray-400">By category</div>
            </div>

            <button class="flex size-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-50 hover:text-primary">
                <i class="pi pi-ellipsis-h text-xs"></i>
            </button>
        </div>

        <!-- Chart & Legend -->
        <div class="mt-4 flex min-h-44 items-center gap-4" v-if="expenseCategories.categories.length">
            <!-- Chart -->
            <div class="relative size-40 shrink-0">
                <Chart
                    type="doughnut"
                    :data="chartData"
                    :options="chartOptions"
                    class="size-full"
                />

                <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <div class="text-[10px] font-medium text-gray-400">Total</div>
                    <div class="mt-0.5 text-base font-semibold tracking-tight text-gray-700">
                        {{ formatAmount(totalExpenses) }}
                    </div>
                    <div class="text-[9px] font-medium text-gray-400">BDT</div>
                </div>
            </div>

            <!-- Legend -->
            <div class="min-w-0 flex-1 space-y-3">
                <div
                    v-for="(category, index) in expenseCategories.categories"
                    :key="category.id"
                    class="flex items-center gap-2"
                >
                    <span
                        class="size-2 shrink-0 rounded-full"
                        :style="{ backgroundColor: chartColors[index % chartColors.length] }"
                    ></span>

                    <div class="min-w-0 flex-1">
                        <div class="truncate text-[10px] font-medium text-gray-600">
                            {{ category.name }}
                        </div>
                    </div>

                    <div class="shrink-0 text-[10px] font-semibold text-gray-700">
                        {{ category.percentage }}%
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-1 bg-gray-50 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl mt-4" v-else>
            <div class="text-sm text-gray-600">Your expense category will appear here</div>
            <div class="text-xs text-gray-400">Currently you dont have any expense transactions</div>
        </div>

        <!-- Summary -->
        <div class="mt-3 grid grid-cols-3 divide-x divide-gray-100 rounded-lg border border-gray-100 bg-gray-50 py-3">
            <div class="px-3">
                <div class="text-[9px] font-medium uppercase tracking-wide text-gray-400">
                    Avg. Daily
                </div>
                <div class="mt-1 text-xs font-semibold text-gray-700">
                    {{ formatAmount(expenseCategories.average_daily) }}
                    <span class="text-[9px] font-medium text-gray-400">BDT</span>
                </div>
            </div>

            <div class="px-3">
                <div class="text-[9px] font-medium uppercase tracking-wide text-gray-400">
                    Avg. Monthly
                </div>
                <div class="mt-1 text-xs font-semibold text-gray-700">
                    {{ formatAmount(expenseCategories.average_monthly) }}
                    <span class="text-[9px] font-medium text-gray-400">BDT</span>
                </div>
            </div>

            <div class="px-3">
                <div class="text-[9px] font-medium uppercase tracking-wide text-gray-400">
                    YTD
                </div>
                <div class="mt-1 text-xs font-semibold text-gray-700">
                    {{ formatAmount(expenseCategories.ytd_yearly) }}
                    <span class="text-[9px] font-medium text-gray-400">BDT</span>
                </div>
            </div>
        </div>
    </div>
</template>