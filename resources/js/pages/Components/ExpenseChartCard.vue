<script setup lang="ts">
import { ref, computed } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend);

// Expense Data
const activeCategoryIndex = ref(0);

const expenses = ref([
    { label: 'Food & Drink', amount: 650, color: '#3d3851' }, // Dark Indigo / Charcoal
    { label: 'Transportation', amount: 480, color: '#c4bef2' }, // Brand Lavender
    { label: 'Entertainment', amount: 320, color: '#ffc8c8' }, // Brand Rose
    { label: 'Hobbies', amount: 150, color: '#eef0f4' }, // Light Gray
]);

// Active item highlighted in chart center
const activeExpense = computed(() => expenses.value[activeCategoryIndex.value]);

// Chart.js Data Config
const chartData = computed(() => ({
    labels: expenses.value.map((e) => e.label),
    datasets: [
        {
            data: expenses.value.map((e) => e.amount),
            backgroundColor: expenses.value.map((e) => e.color),
            borderWidth: 0,
            hoverOffset: 6,
            borderRadius: 4,
            spacing: 2,
        },
    ],
}));

// Chart.js Options Config
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
        legend: { display: false }, // Using custom HTML legend for precise design matching
        tooltip: { enabled: true },
    },
    onHover: (_: any, elements: any[]) => {
        if (elements.length > 0) {
            activeCategoryIndex.value = elements[0].index;
        }
    },
};
</script>

<template>
    <div
        class="w-full rounded-2xl border border-gray-100 bg-white p-5 font-sans shadow-sm"
    >
        <!-- Header -->
        <div class="mb-6 flex items-center justify-between">
            <h3 class="text-xl text-brand-dark">All Expense</h3>
            <button
                class="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
                <i class="pi pi-filter text-xs!"></i>
                Filter
            </button>
        </div>

        <!-- Chart + Legend Section -->
        <div class="mb-6 flex items-center justify-between gap-4">
            <!-- Doughnut with Centered Label -->
            <div class="relative h-36 w-36 shrink-0">
                <Doughnut :data="chartData" :options="chartOptions" />
                <div
                    class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                    <span
                        class="line-clamp-1 text-lg font-bold text-brand-dark"
                    >
                        ${{ activeExpense.amount }}
                    </span>
                    <span
                        class="max-w-20 truncate text-[11px] font-medium text-gray-400"
                    >
                        {{ activeExpense.label }}
                    </span>
                </div>
            </div>

            <!-- Custom HTML Legend -->
            <ul class="flex-1 space-y-2.5">
                <li
                    v-for="(item, index) in expenses"
                    :key="item.label"
                    @mouseenter="activeCategoryIndex = index"
                    class="flex cursor-pointer items-center gap-2.5 text-xs font-semibold transition-opacity"
                    :class="
                        activeCategoryIndex === index
                            ? 'text-brand-dark opacity-100'
                            : 'text-gray-600 opacity-60 hover:opacity-100'
                    "
                >
                    <span
                        class="h-2.5 w-2.5 shrink-0 rounded-full"
                        :style="{ backgroundColor: item.color }"
                    ></span>
                    <span class="truncate">{{ item.label }}</span>
                </li>
            </ul>
        </div>

        <hr class="mb-5 border-gray-100" />

        <!-- Footer Breakdown -->
        <div class="grid grid-cols-3 gap-2 text-left">
            <div>
                <span class="block text-xs font-medium text-gray-500"
                    >Daily</span
                >
                <span class="text-sm font-semibold text-brand-dark"
                    >$55.00</span
                >
            </div>
            <div>
                <span class="block text-xs font-medium text-gray-500"
                    >Weekly</span
                >
                <span class="text-sm font-semibold text-brand-dark"
                    >$625.00</span
                >
            </div>
            <div>
                <span class="block text-xs font-medium text-gray-500"
                    >Monthly</span
                >
                <span class="text-sm font-semibold text-brand-dark"
                    >$1,540.00</span
                >
            </div>
        </div>
    </div>
</template>
