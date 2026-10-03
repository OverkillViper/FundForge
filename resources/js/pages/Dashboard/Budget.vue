<script lang="ts" setup>
import { computed, ref } from 'vue';
import SelectButton from 'primevue/selectbutton';

interface Budget {
    budget: number;
    spent: number;
    remaining: number;
    spent_percentage: number;
}

interface Budgets {
    daily: Budget;
    monthly: Budget;
    quarterly: Budget;
}

type BudgetPeriod = 'Daily' | 'Monthly' | 'Quarterly';

const props = defineProps<{
    budgets: Budgets;
}>();

const selectedPeriod = ref<BudgetPeriod>('Monthly');

const periodOptions = [
    { label: 'Daily', value: 'Daily' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Quarterly', value: 'Quarterly' },
];

const currentBudget = computed(() => {
    const budgetMap: Record<BudgetPeriod, Budget> = {
        Daily: props.budgets.daily,
        Monthly: props.budgets.monthly,
        Quarterly: props.budgets.quarterly,
    };

    return budgetMap[selectedPeriod.value];
});

const totalBudget = computed(() => currentBudget.value.budget);
const totalSpent = computed(() => currentBudget.value.spent);
const remaining = computed(() => currentBudget.value.remaining);

const spentPercentage = computed(() => {
    if (totalBudget.value === 0) {
        return totalSpent.value > 0 ? 100 : 0;
    }

    return Math.round((totalSpent.value / totalBudget.value) * 100);
});

const budgetExceeded = computed(() =>
    totalSpent.value > totalBudget.value,
);

const formattedAmount = (amount: number) => amount.toLocaleString('en-IN');

const progressPercentage = computed(() =>
    Math.min(spentPercentage.value, 100),
);
</script>

<template>
    <div class="rounded-xl border border-gray-200 bg-white p-4">
        <!-- Header -->
        <div class="flex items-center justify-between gap-4">
            <div>
                <div class="text-sm font-semibold text-gray-700">Budget</div>

                <div class="mt-0.5 text-[10px] text-gray-400">
                    Track your spending against your budget
                </div>
            </div>

            <SelectButton
                v-model="selectedPeriod"
                :options="periodOptions"
                option-label="label"
                option-value="value"
                :allow-empty="false"
                size="small"
                :pt="{
                    root: '',
                    pcToggleButton: {
                        root: 'border-0! px-1.5! py-1! text-xs! font-medium!',
                    },
                }"
            />
        </div>

        <!-- Summary -->
        <div class="mt-4 grid grid-cols-3 gap-2">
            <!-- Budget -->
            <div class="rounded-lg bg-gray-50 px-3 py-2.5">
                <div class="text-[9px] font-medium text-gray-400">
                    Budget
                </div>

                <div class="mt-0.5 text-sm font-semibold text-gray-700">
                    {{ formattedAmount(totalBudget) }}
                    <span class="text-[9px] font-medium text-gray-400">
                        BDT
                    </span>
                </div>
            </div>

            <!-- Spent -->
            <div class="rounded-lg bg-gray-50 px-3 py-2.5">
                <div class="text-[9px] font-medium text-gray-400">
                    Spent
                </div>

                <div class="mt-0.5 text-sm font-semibold text-gray-700">
                    {{ formattedAmount(totalSpent) }}
                    <span class="text-[9px] font-medium text-gray-400">
                        BDT
                    </span>
                </div>
            </div>

            <!-- Remaining -->
            <div
                class="rounded-lg px-3 py-2.5"
                :class="remaining < 0 ? 'bg-rose-50' : 'bg-primary/5'"
            >
                <div class="text-[9px] font-medium text-gray-400">
                    Remaining
                </div>

                <div
                    class="mt-0.5 text-sm font-semibold"
                    :class="remaining < 0 ? 'text-rose-600' : 'text-primary'"
                >
                    {{ formattedAmount(remaining) }}

                    <span
                        class="text-[9px] font-medium"
                        :class="remaining < 0 ? 'text-rose-400' : 'text-primary/60'"
                    >
                        BDT
                    </span>
                </div>
            </div>
        </div>

        <!-- Overall Progress -->
        <div class="mt-2">
            <div class="mb-1.5 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-[10px] font-medium text-gray-500">
                        Overall spending
                    </span>

                    <span
                        v-if="budgetExceeded"
                        class="rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600"
                    >
                        Budget Exceeded
                    </span>
                </div>

                <span
                    class="text-[10px] font-semibold"
                    :class="budgetExceeded ? 'text-rose-600' : 'text-gray-600'"
                >
                    {{ spentPercentage }}%
                </span>
            </div>

            <div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="budgetExceeded ? 'bg-rose-500' : 'bg-primary'"
                    :style="{ width: `${progressPercentage}%` }"
                ></div>
            </div>
        </div>
    </div>
</template>