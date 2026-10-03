<script lang="ts" setup>
import AppLayout from '@/layouts/AppLayout.vue';
import BudgetCard from '@/pages/Budget/BudgetCard.vue';

interface Budget {
    id: number;
    user_id: number;
    period: string;
    amount: number;
    start_date: string;
    end_date: string;
    spent: number;
    remaining: number;
}

defineProps<{
    currentBudgets: {
        daily: Budget | null;
        monthly: Budget | null;
        quarterly: Budget | null;
    };

    previousBudgets: Budget[];
}>();
</script>

<template>
<AppLayout page-title="Budgets">
    <template #content>
        <div class="mt-4 grid grid-cols-3 gap-x-4">
            <div>
                <BudgetCard
                    title="Daily"
                    :budget="currentBudgets.daily"
                    :serial="0"
                />
            </div>
            
            <div>
                <BudgetCard
                    title="Monthly"
                    :budget="currentBudgets.monthly"
                    :serial="1"
                />
            </div>
            <div>
                <BudgetCard
                    title="Quarterly"
                    :budget="currentBudgets.quarterly"
                    :serial="2"
                />
            </div>
        </div>
    </template>
</AppLayout>
</template>
