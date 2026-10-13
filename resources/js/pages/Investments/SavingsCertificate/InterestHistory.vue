<script setup lang="ts">
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ScrollArea from 'primevue/scrollarea';
import ScrollAreaViewport from 'primevue/scrollareaviewport';
import ScrollAreaContent from 'primevue/scrollareacontent';
import ScrollAreaScrollbar from 'primevue/scrollareascrollbar';
import ScrollAreaHandle from 'primevue/scrollareahandle';
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

function formatDate(dateString: string | null) {
    if (!dateString) return '';

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(dateString));
}
</script>

<style scoped>
:deep(.p-accordionpanel) {
    border-bottom: none !important;
}

:deep(.p-accordionheader) {
    padding: 0.75rem 1rem;
}

:deep(.p-accordioncontent-content) {
    min-width: 0;
    padding: 0.25rem 0.5rem 0.5rem;
}

:deep(.p-datatable-table-container) {
    overflow-x: auto;
}

:deep(.p-datatable-thead > tr > th),
:deep(.p-datatable-tbody > tr > td) {
    padding: 0.5rem 0.625rem;
    white-space: nowrap;
}

@media (max-width: 639px) {
    :deep(.p-accordionheader) {
        padding: 0.625rem 0.75rem;
    }

    :deep(.p-accordioncontent-content) {
        padding: 0.125rem 0.25rem 0.375rem;
    }

    :deep(.p-datatable-thead > tr > th),
    :deep(.p-datatable-tbody > tr > td) {
        padding: 0.375rem 0.5rem;
    }
}
</style>

<template>
    <Accordion class="mt-3 overflow-hidden! rounded-xl! border! p-0! sm:mt-4">
        <AccordionPanel>
            <AccordionHeader>
                <div class="text-sm font-semibold text-black sm:text-base">
                    Interest History
                </div>
            </AccordionHeader>

            <AccordionContent>
                <ScrollArea class="w-[300px] lg:w-full max-w-full border">
                    <ScrollAreaViewport class="w-full">
                        <ScrollAreaContent class="min-w-[50rem]">
                            <div class="min-w-[50rem]">
                                <DataTable
                                    :value="interestHistory"
                                    class="text-[10px] lg:text-sm!"
                                >
                                    <Column field="date" header="Date">
                                        <template #body="{ data }">
                                            {{ formatDate(data.date) }}
                                        </template>
                                    </Column>

                                    <Column header="Interest Rate (%)">
                                        <template #body="{ data }">
                                            {{ data.annual_rate !== null ? data.annual_rate : (data.rate_breakdown?.[0]?.annual_rate ?? '-') }}
                                        </template>
                                    </Column>

                                    <Column header="Gross Interest (BDT)">
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
                                        <template #body="{ data }">
                                            <div
                                                class="rounded-sm px-1.5 py-0.5 text-center text-[9px] font-medium uppercase sm:p-1 sm:text-xs"
                                                :class="data.status === 'upcoming' ? 'bg-gray-900 text-white' : 'bg-gray-100'"
                                            >
                                                {{ data.status }}
                                            </div>
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                        </ScrollAreaContent>
                    </ScrollAreaViewport>

                    <ScrollAreaScrollbar orientation="horizontal">
                        <ScrollAreaHandle />
                    </ScrollAreaScrollbar>
                </ScrollArea>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>