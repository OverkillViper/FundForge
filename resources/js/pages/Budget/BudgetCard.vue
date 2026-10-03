<script lang="ts" setup>
import { computed, ref } from 'vue';
import { router, useForm } from '@inertiajs/vue3';

import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Menu from 'primevue/menu';
import ProgressBar from 'primevue/progressbar';

import { update } from '@/routes/budgets';

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

const props = defineProps<{
    budget: Budget | null;
    serial: number;
}>();

const creating = ref(false);
const editing = ref(false);
const menu = ref();

const periods = ['Daily', 'Monthly', 'Quarterly'];
const periodName = periods[props.serial] ?? 'Budget';

const form = useForm({
    period: '',
    amount: 0,
});

const editForm = useForm({
    amount: props.budget?.amount ?? 0,
});

const periodIcon = computed(() => {
    switch (props.budget?.period) {
        case 'daily':
            return 'pi pi-calendar';
        case 'monthly':
            return 'pi pi-calendar-clock';
        case 'quarterly':
            return 'pi pi-calendar-plus';
        default:
            return 'pi pi-wallet';
    }
});

const progressValue = computed(() => {
    if (!props.budget || props.budget.amount <= 0) return 0;

    return Math.min(
        Math.max((props.budget.spent / props.budget.amount) * 100, 0),
        100,
    );
});

const isOverBudget = computed(() => {
    return props.budget ? props.budget.spent > props.budget.amount : false;
});

const menuItems = computed(() => [
    {
        label: 'Edit budget',
        icon: 'pi pi-pencil',
        command: () => {
            editing.value = true;
        },
    },
    {
        label: 'Delete budget',
        icon: 'pi pi-trash',
        command: () => {
            if (!props.budget) return;

            router.delete(`/budgets/${props.budget.id}`, {
                preserveScroll: true,
            });
        },
    },
]);

const toggleMenu = (event: Event) => {
    menu.value.toggle(event);
};

const createBudget = () => {
    if (form.amount <= 0) return;

    form.period =
        props.serial === 0
            ? 'daily'
            : props.serial === 1
              ? 'monthly'
              : 'quarterly';

    form.post('/budgets', {
        preserveScroll: true,
        onSuccess: () => {
            creating.value = false;
            form.reset();
        },
    });
};

const editBudget = () => {
    if (!props.budget || editForm.amount <= 0) return;

    editForm.put(update.url(props.budget.id), {
        preserveScroll: true,
        onSuccess: () => {
            editing.value = false;
        },
    });
};
</script>

<template>
    <div
        v-if="budget"
        class="group flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-1 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
    >
        <!-- Header -->
        <div class="flex items-start gap-3 p-3">
            <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10"
            >
                <i :class="periodIcon" class="text-sm text-primary"></i>
            </div>

            <div class="min-w-0 flex-1">
                <div class="text-base font-semibold capitalize text-gray-800">
                    {{ budget.period }} Budget
                </div>

                <div class="mt-0.5 text-xs text-gray-400">
                    Spending limit
                </div>
            </div>

            <Button
                v-if="editing"
                icon="pi pi-times"
                variant="text"
                rounded
                size="small"
                severity="secondary"
                class="!h-8 !w-8"
                aria-label="Cancel editing"
                @click="editing = false"
            />

            <template v-else>
                <Menu
                    ref="menu"
                    :model="menuItems"
                    popup
                    class="w-44 text-sm! font-medium!"
                />

                <Button
                    icon="pi pi-ellipsis-v"
                    variant="text"
                    rounded
                    size="small"
                    severity="secondary"
                    class="!h-8 !w-8 !text-gray-400 hover:!bg-gray-100 hover:!text-gray-700"
                    aria-label="Budget menu"
                    @click="toggleMenu"
                />
            </template>
        </div>

        <!-- Budget Amount -->
        <div class="border-t border-gray-100 px-4 pt-3">
            <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Budget Limit
            </div>

            <form
                v-if="editing"
                class="mt-2 flex items-center gap-2"
                @submit.prevent="editBudget"
            >
                <InputNumber
                    v-model="editForm.amount"
                    fluid
                    size="small"
                    locale="en-IN"
                    :min="0"
                    class="flex-1"
                    input-class="!text-sm"
                />

                <Button
                    icon="pi pi-check"
                    size="small"
                    :loading="editForm.processing"
                    aria-label="Save budget"
                    @click="editBudget"
                />
            </form>

            <div
                v-else
                class="mt-1 flex items-baseline gap-1.5"
            >
                <span class="text-xl font-bold text-gray-800">
                    {{ budget.amount }}
                </span>
                <span class="text-xs font-medium text-gray-400">
                    BDT
                </span>
            </div>
        </div>

        <!-- Spending Overview -->
        <div class="mx-3 mt-4 mb-3 rounded-xl bg-gray-50 p-4">
            <div class="flex items-center justify-between">
                <div>
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Spent
                    </div>

                    <div class="mt-1 flex items-baseline gap-1">
                        <span class="text-sm font-semibold text-gray-700">
                            {{ budget.spent }}
                        </span>
                        <span class="text-[10px] font-medium text-gray-400">
                            BDT
                        </span>
                    </div>
                </div>

                <div class="text-right">
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Remaining
                    </div>

                    <div
                        class="mt-1 flex items-baseline justify-end gap-1"
                        :class="isOverBudget ? 'text-red-600' : 'text-gray-700'"
                    >
                        <span class="text-sm font-semibold">
                            {{ budget.remaining }}
                        </span>
                        <span
                            class="text-[10px] font-medium"
                            :class="isOverBudget ? 'text-red-400' : 'text-gray-400'"
                        >
                            BDT
                        </span>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex items-center justify-between">
                <span class="text-[10px] font-medium text-gray-400">
                    {{ progressValue.toFixed(0) }}% used
                </span>

                <span
                    v-if="isOverBudget"
                    class="flex items-center gap-1 text-[10px] font-semibold text-red-500"
                >
                    <i class="pi pi-exclamation-triangle text-[9px]"></i>
                    Over budget
                </span>
            </div>

            <ProgressBar
                :value="progressValue"
                :show-value="false"
                class="mt-2"
                :pt="{
                    root: 'h-1.5!',
                    value: isOverBudget ? '!bg-red-500' : '!bg-primary',
                }"
            />
        </div>
    </div>

    <!-- Empty State -->
    <div
        v-else
        class="flex items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-8 transition-colors hover:border-gray-400"
    >
        <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100"
        >
            <i class="pi pi-wallet text-sm text-gray-400"></i>
        </div>

        <div class="min-w-0 flex-1">
            <div class="text-sm font-semibold text-gray-700">
                {{ periodName }} Budget
            </div>

            <form
                v-if="creating"
                class="mt-2 flex items-center gap-2"
                @submit.prevent="createBudget"
            >
                <InputNumber
                    v-model="form.amount"
                    placeholder="Enter amount"
                    fluid
                    size="small"
                    locale="en-IN"
                    :min="0"
                    class="flex-1"
                    input-class="!text-sm"
                />

                <Button
                    icon="pi pi-times"
                    size="small"
                    severity="secondary"
                    aria-label="Cancel"
                    @click="creating = false"
                />

                <Button
                    icon="pi pi-check"
                    size="small"
                    :loading="form.processing"
                    aria-label="Create budget"
                    @click="createBudget"
                />
            </form>

            <div
                v-else
                class="mt-1 text-xs text-gray-400"
            >
                No {{ periodName.toLowerCase() }} budget has been set.
            </div>
        </div>

        <Button
            v-if="!creating"
            icon="pi pi-plus"
            rounded
            size="small"
            aria-label="Create budget"
            class="!h-9 !w-9 shrink-0"
            @click="creating = true"
        />
    </div>
</template>