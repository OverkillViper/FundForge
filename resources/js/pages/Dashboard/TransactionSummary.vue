<script lang="ts" setup>
import { formatCurrency } from '@/lib/formatters';

interface Income {
    amount: number;
    percentage_change: number | null;
}

interface Expense {
    amount: number;
    percentage_change: number | null;
}

interface Savings {
    amount: number;
    percentage_change: number | null;
}

interface Investment {
    amount: number;
    percentage_change: number | null;
}

interface TransactionSummary {
    income: Income;
    expense: Expense;
    savings: Savings;
    investment: Investment;
    savings_invested_percentage: number;
}

const props = defineProps<{
    transactionSummary: TransactionSummary;
}>();

const changeIcon = (percentage: number | null) => {
    if (percentage === null) return 'pi pi-minus';
    if (percentage > 0) return 'pi pi-arrow-up';
    if (percentage < 0) return 'pi pi-arrow-down';
    return 'pi pi-minus';
};

const changeClass = (percentage: number | null) => {
    if (percentage === null) return 'bg-gray-50 text-gray-500';
    if (percentage < 0) return 'bg-rose-50 text-rose-600';
    if (percentage > 0) return 'bg-emerald-50 text-emerald-700';
    return 'bg-gray-50 text-gray-500';
};

const changeText = (percentage: number | null) => {
    if (percentage === null) return 'No previous month';
    return `${Math.abs(percentage)}%`;
};
</script>

<template>
    <div class="grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-white p-4">
        <!-- Total Income -->
        <div class="flex min-h-36 flex-col justify-between rounded-lg bg-primary p-4 text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
            <div class="flex items-start justify-between">
                <div>
                    <div class="text-xs font-medium text-white/80">Total Income</div>
                    <div class="mt-0.5 text-[10px] text-white/50">This month</div>
                </div>

                <div class="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white">
                    <i class="pi pi-arrow-down-left text-xs"></i>
                </div>
            </div>

            <div>
                <div class="text-xl font-semibold tracking-tight">
                    {{ formatCurrency(transactionSummary.income.amount) }}
                    <span class="text-xs font-medium text-white/60">BDT</span>
                </div>

                <div class="mt-1.5 flex items-center gap-2">
                    <span
                        class="inline-flex h-5 items-center gap-1 rounded-md px-1.5 text-[10px] font-semibold"
                        :class="transactionSummary.income.percentage_change === null
                            ? 'bg-white/10 text-white/60'
                            : 'bg-white/15 text-white'"
                    >
                        <i
                            :class="changeIcon(transactionSummary.income.percentage_change)"
                            class="text-[8px]!"
                        ></i>

                        {{ changeText(transactionSummary.income.percentage_change) }}
                    </span>

                    <span
                        v-if="transactionSummary.income.percentage_change !== null"
                        class="text-[10px] text-white/50"
                    >
                        vs last month
                    </span>
                </div>
            </div>
        </div>

        <!-- Total Expense -->
        <div class="flex min-h-36 flex-col justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
            <div class="flex items-start justify-between">
                <div>
                    <div class="text-xs font-medium text-gray-500">Total Expense</div>
                    <div class="mt-0.5 text-[10px] text-gray-400">This month</div>
                </div>

                <div class="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                    <i class="pi pi-arrow-up-right text-xs"></i>
                </div>
            </div>

            <div>
                <div class="text-xl font-semibold tracking-tight text-gray-800">
                    {{ formatCurrency(transactionSummary.expense.amount) }}
                    <span class="text-xs font-medium text-gray-400">BDT</span>
                </div>

                <div class="mt-1.5 flex items-center gap-2">
                    <span
                        class="inline-flex h-5 items-center gap-1 rounded-md px-1.5 text-[10px] font-semibold"
                        :class="changeClass(transactionSummary.expense.percentage_change)"
                    >
                        <i
                            :class="changeIcon(transactionSummary.expense.percentage_change)"
                            class="text-[8px]!"
                        ></i>

                        {{ changeText(transactionSummary.expense.percentage_change) }}
                    </span>

                    <span
                        v-if="transactionSummary.expense.percentage_change !== null"
                        class="text-[10px] text-gray-400"
                    >
                        vs last month
                    </span>
                </div>
            </div>
        </div>

        <!-- Total Savings -->
        <div class="flex min-h-36 flex-col justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
            <div class="flex items-start justify-between">
                <div>
                    <div class="text-xs font-medium text-gray-500">Total Savings</div>
                    <div class="mt-0.5 text-[10px] text-gray-400">Income after expenses</div>
                </div>

                <div class="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <i class="pi pi-wallet text-xs"></i>
                </div>
            </div>

            <div>
                <div class="text-xl font-semibold tracking-tight text-gray-800">
                    {{ formatCurrency(transactionSummary.savings.amount) }}
                    <span class="text-xs font-medium text-gray-400">BDT</span>
                </div>

                <div class="mt-1.5 flex items-center gap-2">
                    <span
                        class="inline-flex h-5 items-center gap-1 rounded-md px-1.5 text-[10px] font-semibold"
                        :class="changeClass(transactionSummary.savings.percentage_change)"
                    >
                        <i
                            :class="changeIcon(transactionSummary.savings.percentage_change)"
                            class="text-[8px]!"
                        ></i>

                        {{ changeText(transactionSummary.savings.percentage_change) }}
                    </span>

                    <span
                        v-if="transactionSummary.savings.percentage_change !== null"
                        class="text-[10px] text-gray-400"
                    >
                        vs last month
                    </span>
                </div>
            </div>
        </div>

        <!-- Total Investment -->
        <div class="flex min-h-36 flex-col justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
            <div class="flex items-start justify-between">
                <div>
                    <div class="text-xs font-medium text-gray-500">Total Investment</div>
                    <div class="mt-0.5 text-[10px] text-gray-400">This month</div>
                </div>

                <div class="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <i class="pi pi-chart-line text-xs"></i>
                </div>
            </div>

            <div>
                <div class="text-xl font-semibold tracking-tight text-gray-800">
                    {{ formatCurrency(transactionSummary.investment.amount) }}
                    <span class="text-xs font-medium text-gray-400">BDT</span>
                </div>

                <div class="mt-1.5 flex items-center gap-2">
                    <span
                        class="inline-flex h-5 items-center gap-1 rounded-md px-1.5 text-[10px] font-semibold"
                        :class="changeClass(transactionSummary.investment.percentage_change)"
                    >
                        <i
                            :class="changeIcon(transactionSummary.investment.percentage_change)"
                            class="text-[8px]!"
                        ></i>

                        {{ changeText(transactionSummary.investment.percentage_change) }}
                    </span>

                    <span
                        v-if="transactionSummary.investment.percentage_change !== null"
                        class="text-[10px] text-gray-400"
                    >
                        vs last month
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>