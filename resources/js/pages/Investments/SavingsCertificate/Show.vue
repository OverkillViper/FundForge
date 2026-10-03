<script lang="ts" setup>
import Button from 'primevue/button';
import { formatCurrency } from '@/lib/formatters';
import Rates from '@/pages/Investments/SavingsCertificate/Rates.vue';
import { edit, destroy } from '@/routes/investments/savings-certificates';
import { router } from '@inertiajs/vue3';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';
import NextInterest from '@/pages/Investments/SavingsCertificate/NextInterest.vue';
import InterestHistory from '@/pages/Investments/SavingsCertificate/InterestHistory.vue';
import ScrollPanel from 'primevue/scrollpanel';
import AppLayout from '@/layouts/AppLayout.vue';

const confirm = useConfirm();

interface Investment {
    id: number;
    user_id: number;
    type: 'savings_certificate' | 'dps';
    name: string;
    start_date: string;
    created_at: string;
    updated_at: string;
}

interface SavingsCertificate {
    id: number;
    investment_id: number;
    issue_date: string;
    duration_years: number;
    principal_value: string;
    interest_interval_months: number;
    tax_percent: string;
    created_at: string;
    updated_at: string;
    investment: Investment;
    rates: SavingsCertificateRate[];
}

interface SavingsCertificateRate {
    id: number;
    savings_certificate_id: number;
    interest_rate: string;
    year: number;
    created_at: string;
    updated_at: string;
    tier: string;
}

interface RateBreakdown {
    tier: string;
    principal: number;
    annual_rate: number;
    minimum_investment: number;
    maximum_investment: number;
}

interface InterestHistory {
    date: string;
    year: number;
    annual_rate: number | null;
    gross_interest: number | null;
    tax: number | null;
    net_interest: number | null;
    status: 'paid' | 'upcoming';
    rate_breakdown: RateBreakdown[] | null;
}

interface RateTier {
    key: string;
    minimum_investment: number;
}

const props = defineProps<{
    certificate: SavingsCertificate;
    interestHistory: InterestHistory[];
    nextInterest: InterestHistory | null;
    rateTiers: RateTier[];
}>();

const confirmDelete = (event: Event) => {
    confirm.require({
        target: event.currentTarget as HTMLElement,

        message: `Delete this savings certificate?`,

        icon: 'pi pi-exclamation-triangle',

        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
            size: 'small',
        },

        acceptProps: {
            label: 'Delete',
            severity: 'danger',
            size: 'small',
        },

        accept: () => {
            router.delete(destroy.url(props.certificate.id), {
                preserveScroll: true,
            });
        },
    });
};

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
<AppLayout :page-title="certificate.investment.name">
    <template #toolbar>
        <Button
            label="Edit Certificate"
            icon="pi pi-pencil"
            size="small"
            @click="router.visit(edit.url(certificate.id))"
        />
        <Button
            label="Delete Certificate"
            icon="pi pi-trash"
            severity="secondary"
            size="small"
            @click="confirmDelete"
        />
        <ConfirmPopup class="text-sm!"></ConfirmPopup>
    </template>
    <template #content>
        <div class="flex my-4 justify-between">
            <div class="flex flex-col w-1/2">
                <div class="flex items-center gap-x-2">
                    <div class="bg-primary size-8 flex items-center justify-center rounded-lg">
                        <span class="pi pi-money-bill text-white"></span>
                    </div>
                    <span class="text-sm font-semibold">Principal Value</span>
                </div>
                <div class="ms-10 text-4xl">
                    {{ formatCurrency(certificate.principal_value) }}
                    <span class="text-sm text-gray-500">BDT</span>
                </div>
            </div>
            <div class="flex flex-col w-1/5 text-sm">
                <div class="flex">
                    <span class="w-1/2 py-0.5 text-gray-500">Issued On</span>
                    <span class="w-1/2 text-end py-0.5 font-semibold">{{ formatDate(certificate.issue_date) }}</span>
                </div>
                <div class="flex">
                    <span class="w-1/2 py-0.5 text-gray-500">Duration</span>
                    <span class="w-1/2 text-end py-0.5 font-semibold">{{ certificate.duration_years }} years</span>
                </div>
                <div class="flex">
                    <span class="w-1/2 py-0.5 text-gray-500">Interest Interval</span>
                    <span class="w-1/2 text-end py-0.5 font-semibold">{{ certificate.interest_interval_months }} months</span>
                </div>
                <div class="flex">
                    <span class="w-1/2 py-0.5 text-gray-500">Tax Rate</span>
                    <span class="w-1/2 text-end py-0.5 font-semibold">{{ certificate.tax_percent }} %</span>
                </div>
            </div>
        </div>

        <ScrollPanel class="mt-2 h-[560px] w-full pe-4">
            <Rates
                :rates="certificate.rates"
                :certificate="certificate"
                :rate-tiers="rateTiers"
            />

            <NextInterest :next-interest="nextInterest" />

            <InterestHistory :interest-history="interestHistory" />
        </ScrollPanel>
    </template>
</AppLayout>
</template>
