<script lang="ts" setup>
import { Link } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3';

interface InvestmentType {
    type: string;
    name: string;
    route: string;
}

defineProps({
    currentType: {
        type: String,
    },
});

const investmentTypes = [
    {
        name: 'Savings Certificate',
        route: '/investments/savings-certificates',
        type: 'savings-certificate',
    },
    {
        name: 'DPS',
        route: '/investments/dps',
        type: 'dps',
    },
    {
        name: 'Provident Funds',
        route: '/investments/provident-fund',
        type: 'provident-funds',
    },
];
</script>

<template>
    <div class="flex w-1/5 flex-col">
        <span class="ps-0.5 text-xs text-gray-500">Investment Types</span>

        <ul class="mt-2 mt-4 flex flex-col gap-y-1 text-sm font-medium">
            <Link
                class="border-l-3 border-l-transparent p-2"
                :class="{
                    'border-l-brand-primary! bg-gray-100':
                        currentType === item.type,
                }"
                v-for="item in investmentTypes"
                :key="item.type"
                :href="item.route"
            >
                {{ item.name }}
            </Link>
        </ul>
    </div>
</template>
