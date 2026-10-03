<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

import { update } from '@/routes/savings-certificates/rates';

interface SavingsCertificateRate {
    id: number;
    savings_certificate_id: number;
    interest_rate: string;
    year: number;
    created_at: string;
    updated_at: string;
    tier: string;
}

interface Certificate {
    id: number;
    duration_years: number;
    principal_value: string;
    interest_interval_months: number;

    investment: {
        name: string;
    };
}

interface RateTier {
    key: string;
    minimum_investment: number;
}

type RateValues = Record<number, Record<string, number | null>>;

const props = defineProps<{
    certificate: Certificate;
    rates: SavingsCertificateRate[];
    rateTiers: RateTier[];
}>();

/*
 * Build the initial form structure.
 *
 * Example:
 *
 * {
 *     1: {
 *         lower: 11.04,
 *         upper: 11.00
 *     },
 *     2: {
 *         lower: 11.65,
 *         upper: 11.61
 *     },
 *     3: {
 *         lower: 12.30,
 *         upper: 12.25
 *     }
 * }
 */
const existingRates: RateValues = {};

for (let year = 1; year <= props.certificate.duration_years; year++) {
    existingRates[year] = {};

    for (const tier of props.rateTiers) {
        existingRates[year][tier.key] = null;
    }
}

/*
 * Fill the form with existing database values.
 */
props.rates.forEach((rate: any) => {
    if (!existingRates[rate.year]) {
        existingRates[rate.year] = {};
    }

    existingRates[rate.year][rate.tier] = Number(rate.interest_rate);
});

const form = useForm<{
    rates: RateValues;
}>({
    rates: existingRates,
});

const save = () => {
    form.put(update.url(props.certificate.id), {
        preserveScroll: true,
    });
};

/*
 * Display the tier threshold in a friendly format.
 *
 * Example:
 *
 * lower → Up to ৳750,000
 * upper → ৳750,000+
 */
const formatTierLabel = (tier: RateTier, index: number): string => {
    const nextTier = props.rateTiers[index + 1];

    if (nextTier) {
        return `Up to ${Number(nextTier.minimum_investment).toLocaleString(
            'en-IN',
        )}`;
    }

    return `${Number(tier.minimum_investment).toLocaleString('en-IN')}+`;
};

const getOrdinal = (year: number): string => {
    if (year % 100 >= 11 && year % 100 <= 13) {
        return `${year}th`;
    }

    switch (year % 10) {
        case 1:
            return `${year}st`;

        case 2:
            return `${year}nd`;

        case 3:
            return `${year}rd`;

        default:
            return `${year}th`;
    }
};
</script>

<template>
    
    <div class="flex items-center gap-x-2 mb-4">
        <div class="bg-primary size-8 flex items-center justify-center rounded-lg">
            <span class="icon-chart-no-axes-combined text-white"></span>
        </div>
        <span class="text-sm font-semibold">Interest Rates</span>
    </div>

    <div class="space-y-4 mb-4">
        <div class="overflow-hidden">
            <table class="w-full border-y border-y-gray-400">
                <!-- Header -->
                <thead>
                    <tr class="border-b border-gray-400">
                        <th class="px-2 py-3 text-left text-sm font-medium">
                            Rate Tier
                        </th>

                        <th
                            v-for="year in certificate.duration_years"
                            :key="year"
                            class="px-2 py-3 text-center text-sm font-medium"
                        >
                            {{ getOrdinal(year) }} Year
                        </th>
                    </tr>
                </thead>

                <!-- Body -->
                <tbody>
                    <tr
                        v-for="(tier, tierIndex) in rateTiers"
                        :key="tier.key"
                        class="last border-b border-gray-200 last:border-b-0"
                    >
                        <!-- Tier -->
                        <td class="border-r border-gray-400 p-2">
                            <div class="text-sm font-medium capitalize">
                                {{ tier.key }}
                            </div>

                            <div class="mt-1 text-xs text-gray-500">
                                {{ formatTierLabel(tier, tierIndex) }}
                            </div>
                        </td>

                        <!-- Year rates -->
                        <td
                            v-for="year in certificate.duration_years"
                            :key="year"
                            class="border-l border-gray-400 p-0"
                        >
                            <input
                                v-model="form.rates[year][tier.key]"
                                class="h-16 w-full text-center focus:bg-gray-300 focus:outline-0"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Save -->
        <div class="flex justify-end">
            <Button
                label="Save"
                icon="pi pi-save"
                :loading="form.processing"
                size="small"
                @click="save"
            />
        </div>
    </div>
</template>
