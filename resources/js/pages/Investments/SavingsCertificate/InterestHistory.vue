<script setup lang="ts">
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { formatCurrency } from '@/lib/formatters';

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

defineProps<{
    interestHistory: InterestHistory[] | null;
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

<style scoped>
:deep(.p-accordionpanel) {
    border-bottom: none !important;
}
</style>

<template>
    <Accordion class="mt-4 overflow-hidden! rounded-xl!">
        <AccordionPanel>
            <AccordionHeader
                ><div class="font-semibold text-black">
                    Interest History
                </div></AccordionHeader
            >
            <AccordionContent>
                <DataTable
                    :value="interestHistory"
                    tableStyle="min-width: 50rem"
                    class="text-sm!"
                >
                    <Column field="date" header="Date">
                        <template #body="slotProps">
                            {{ formatDate(slotProps.data.date) }}
                        </template>
                    </Column>
                    <Column header="Interest Rate (%)">
                        <template #body="{ data }">
                            {{
                                data.annual_rate !== null
                                    ? data.annual_rate
                                    : (data.rate_breakdown?.[0]?.annual_rate ??
                                      '-')
                            }}
                        </template>
                    </Column>
                    <Column
                        header="Gross Interest (BDT)"
                    >
                        <template #body="{ data }">
                            {{ formatCurrency(data.gross_interest) }}
                        </template>
                    </Column>
                    <Column header="Tax (BDT)">
                        <template #body="{ data }">
                            {{ formatCurrency(data.tax) }}
                        </template>
                    </Column>
                    <Column header="Net Interest (BDT)">
                        <template #body="{ data }">
                            {{ formatCurrency(data.net_interest) }}
                        </template>
                    </Column>
                    <Column field="status" header="Status">
                        <template #body="slotProps">
                            <div
                                class="rounded-sm p-1 text-center text-xs font-medium uppercase"
                                :class="
                                    slotProps.data.status === 'upcoming'
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100'
                                "
                            >
                                {{ slotProps.data.status }}
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>
