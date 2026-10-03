<script lang="ts" setup>
import { formatCurrency } from '@/lib/formatters';

interface InterestHistory {
    date: string;
    year: number;
    annual_rate: number | null;
    gross_interest: number | null;
    tax: number | null;
    net_interest: number | null;
    status: 'paid' | 'upcoming';
}

defineProps<{
    nextInterest: InterestHistory | null;
}>();

function formatDate(dateString: any) {
    if (!dateString) return '';

    const date = new Date(dateString);

    // Formats to: "12 July, 2026"
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
        .format(date)
        .replace(/(\d+) (\w+) (\d+)/, '$1 $2, $3');
}
</script>

<template>
    <div v-if="nextInterest" class="rounded-xl border bg-primary text-white p-5">
        <div class="text-xs text-gray-200">Next Interest</div>

        <div class="mt-2 text-xl font-semibold">
            {{ formatCurrency(nextInterest.net_interest ?? 0) }} BDT
        </div>

        <div class="mt-1 text-xs text-gray-200">
            {{ formatDate(nextInterest.date) }}
            ·
            {{ nextInterest.annual_rate }}%
        </div>
    </div>

    <div v-else class="rounded-xl border bg-primary text-white p-5">
        <div class="text-xs text-gray-200">Next Interest</div>

        <div class="mt-2 text-lg font-medium">No upcoming interest</div>

        <div class="mt-1 text-xs text-gray-200">
            This certificate has reached maturity.
        </div>
    </div>
</template>
