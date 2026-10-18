<script setup lang="ts">
import { computed, ref } from 'vue';
import { Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from 'chart.js';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface ExpensePoint {
    label: string;
    amount: number;
}

const props = defineProps<{
    daily: ExpensePoint[];
    monthly: ExpensePoint[];
}>();

const emit = defineEmits<{
    'switch-widget': [];
}>();

const selectedPeriod = ref<'daily' | 'monthly'>('daily');

const periodOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Monthly', value: 'monthly' },
];

const points = computed(() => selectedPeriod.value === 'daily' ? props.daily : props.monthly);
const total = computed(() => points.value.reduce((sum, point) => sum + point.amount, 0));

const formatAmount = (amount: number) => new Intl.NumberFormat('en-BD', {
    maximumFractionDigits: 0,
}).format(amount);

const chartData = computed(() => ({
    labels: points.value.map(point => point.label),
    datasets: [{
        label: 'Expenses',
        data: points.value.map(point => point.amount),
        backgroundColor: '#1a5f75',
        hoverBackgroundColor: '#43899b',
        borderRadius: 4,
        borderSkipped: false as const,
        maxBarThickness: 32,
    }],
}));

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: (context: { parsed: { y: number } }) => ` ${formatAmount(context.parsed.y)} BDT`,
            },
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            border: {
                display: false,
            },
            ticks: {
                color: '#6b7280',
                font: {
                    size: 10,
                },
                maxRotation: 0,
                minRotation: 0,
                autoSkip: selectedPeriod.value === 'daily',
                maxTicksLimit: selectedPeriod.value === 'daily' ? 20 : 12,
            },
        },
        y: {
            beginAtZero: true,
            border: {
                display: false,
            },
            grid: {
                color: '#f3f4f6',
            },
            ticks: {
                color: '#6b7280',
                font: {
                    size: 10,
                },
                callback: (value: string | number) => formatAmount(Number(value)),
            },
        },
    },
}));
</script>

<template>
    <div class="flex flex-col rounded-2xl border border-gray-200 bg-white p-4">
        <div class="flex flex-wrap items-center gap-3">
            <div class="flex-1">
                <div class="text-sm font-semibold text-gray-700">Expense trends</div>
                <div class="mt-0.5 text-[10px] text-gray-400">
                    {{ selectedPeriod === 'daily' ? 'Daily expenses this month' : 'Monthly expenses this year' }}
                </div>
            </div>

            <Button
                @click="emit('switch-widget')"
                icon="pi pi-list"
                label="Recent Transactions"
                size="small"
                rounded
                class="text-[10px]!"
            />

            <SelectButton
                v-model="selectedPeriod"
                :options="periodOptions"
                option-label="label"
                option-value="value"
                :allow-empty="false"
                size="small"
                class="hidden! lg:block!"
                :pt="{
                    root: '',
                    pcToggleButton: {
                        root: 'border-0! px-1.5! py-1! text-xs! font-medium!',
                    },
                }"
            />
            <SelectButton
                v-model="selectedPeriod"
                :options="periodOptions"
                option-label="label"
                option-value="value"
                :allow-empty="false"
                size="small"
                class="lg:hidden!"
                fluid
                :pt="{
                    root: '',
                    pcToggleButton: {
                        root: 'border-0! px-1.5! py-1! text-xs! font-medium!',
                    },
                }"
            />
        </div>

        <div class="mt-3 flex-1">
            <div class="text-xl font-semibold text-gray-900">
                {{ formatAmount(total) }} <span class="text-xs text-gray-500">BDT</span>
            </div>
            <div class="mt-1 text-xs text-gray-500">
                {{ selectedPeriod === 'daily' ? 'Spent so far this month' : 'Spent so far this year' }}
            </div>
        </div>

        <div class="relative mt-4 h-44 w-full">
            <Bar :data="chartData" :options="chartOptions" />
        </div>

        <div v-if="total === 0" class="mt-3 text-center text-xs text-gray-500">
            No expenses recorded for this period.
        </div>
    </div>
</template>