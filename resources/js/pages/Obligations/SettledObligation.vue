<script lang="ts" setup>
import Button from 'primevue/button';
import { router } from '@inertiajs/vue3';
import { index } from '@/routes/obligations';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ScrollPanel from 'primevue/scrollpanel';
import Popover from 'primevue/popover';
import Tag from 'primevue/tag';
import { ref } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';

interface Account {
    id: number;
    name: string;
    currency: string;
}

interface Transaction {
    id: number;
    account?: Account;
}

interface Obligation {
    id: number;
    transaction_id: number;
    type: 'lending' | 'borrowing';
    person: string;
    amount: string;
    date: string;
    due_date: string | null;
    note: string | null;
    is_settled: boolean;
    transaction?: Transaction;
}

const props = defineProps<{
    settledObligations: Obligation[];
}>();

const formattedDate = (date: string | null) => {
    if (!date) {
        return '—';
    }

    const [year, month, day] = date.substring(0, 10).split('-').map(Number);

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(year, month - 1, day));
};

const formattedAmount = (obligation: Obligation) => {
    return Number(obligation.amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const typeConfig = (type: Obligation['type']) => {
    if (type === 'lending') {
        return {
            label: 'Lending',
            icon: 'pi pi-arrow-up-right',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        };
    }

    return {
        label: 'Borrowing',
        icon: 'pi pi-arrow-down-left',
        color: 'text-green-600',
        bg: 'bg-green-50',
    };
};

const amountPrefix = (obligation: Obligation) => {
    return obligation.type === 'lending' ? '-' : '+';
};

const obligationPopover = ref();

const selectedObligation = ref<Obligation | null>(null);

const toggleObligationInfo = (event: Event, obligation: Obligation) => {
    selectedObligation.value = obligation;

    obligationPopover.value.toggle(event);
};
</script>

<template>
<AppLayout page-title="Settled Obligations">
    <template #toolbar>
        <Button
            label="Back to Obligations"
            icon="pi pi-arrow-left"
            severity="secondary"
            size="small"
            @click="router.visit(index.url())"
        />
    </template>
    <template #content>
        <section>
            <ScrollPanel class="h-[740px] w-full">
                <DataTable
                    v-if="settledObligations.length"
                    :value="settledObligations"
                    dataKey="id" rowHover
                    tableStyle="min-width: 60rem"
                    class="overflow-hidden rounded-xl! text-sm! w-2/3 mx-auto"
                >
                    <!-- Type Icon -->
                    <Column header="" style="width: 64px">
                        <template #body="{ data }">
                            <div class="flex h-9 w-9 items-center justify-center rounded-lg" :class="typeConfig(data.type).bg">
                                <i :class="[typeConfig(data.type).icon, typeConfig(data.type).color]" class="text-sm!" />
                            </div>
                        </template>
                    </Column>

                    <!-- Obligation -->
                    <Column header="Obligation">
                        <template #body="{ data }">
                            <div class="min-w-0">
                                <div class="truncate font-semibold text-gray-800">{{ data.type === 'lending' ? `Lent to ${data.person}` : `Borrowed from ${data.person}` }}</div>
                                <div class="mt-0.5 flex items-center gap-x-2 text-xs text-gray-500">
                                    <span>{{ formattedDate(data.date) }}</span>
                                    <template v-if="data.due_date">
                                        <span class="text-gray-300">•</span>
                                        <span>Due {{ formattedDate(data.due_date) }}</span>
                                    </template>
                                    <span v-else class="text-gray-400">No due date</span>
                                </div>
                            </div>
                        </template>
                    </Column>

                    <!-- Type -->
                    <Column header="Type" headerClass="text-left!" style="width: 130px">
                        <template #body="{ data }">
                            <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold" :class="[typeConfig(data.type).bg, typeConfig(data.type).color]">{{ typeConfig(data.type).label }}</span>
                        </template>
                    </Column>

                    <!-- Account -->
                    <Column header="Account" style="width: 190px">
                        <template #body="{ data }">
                            <div class="flex min-w-0 items-center gap-x-2">
                                <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100">
                                    <i class="pi pi-wallet text-xs text-gray-500"></i>
                                </div>
                                <div class="min-w-0">
                                    <div class="truncate text-sm font-medium text-gray-700" :title="data.transaction?.account?.name">{{ data.transaction?.account?.name ?? 'Unknown account' }}</div>
                                    <div v-if="data.transaction?.account?.type" class="truncate text-[11px] capitalize text-gray-400">{{ data.transaction.account.type }}</div>
                                </div>
                            </div>
                        </template>
                    </Column>

                    <!-- Amount -->
                    <Column header="Amount" headerClass="text-right!" style="width: 160px">
                        <template #body="{ data }">
                            <div class="flex flex-col items-end">
                                <div class="whitespace-nowrap text-sm font-bold" :class="typeConfig(data.type).color">{{ amountPrefix(data) }}{{ formattedAmount(data) }}</div>
                                <span class="text-[11px] font-medium text-gray-400">{{ data.transaction?.account?.currency ?? 'BDT' }}</span>
                            </div>
                        </template>
                    </Column>

                    <!-- Status -->
                    <Column header="Status" style="width: 130px">
                        <template #body>
                            <Tag
                                value="Settled"
                                severity="success"
                                icon="pi pi-check"
                                class="font-semibold!"
                            />
                        </template>
                    </Column>

                    <!-- Actions -->
                    <Column header="" style="width: 80px">
                        <template #body="{ data }">
                            <div class="obligation-actions">
                                <Button
                                    icon="pi pi-info-circle"
                                    severity="secondary"
                                    text
                                    rounded
                                    size="small"
                                    aria-label="Obligation information"
                                    @click="toggleObligationInfo($event, data)"
                                />
                            </div>
                        </template>
                    </Column>
                </DataTable>

                <!-- Empty -->
                <div v-else class="flex flex-col items-center justify-center py-16 text-gray-500">
                    <i class="pi pi-history mb-3 text-2xl"></i>
                    <span class="text-sm">No settled obligations yet.</span>
                    <span class="mt-1 text-xs text-gray-400">Settled obligations will appear here.</span>
                </div>

                <!-- Info Popover -->
                <Popover ref="obligationPopover">
                    <div v-if="selectedObligation" class="flex w-80 flex-col gap-4">
                        <!-- Note -->
                        <div>
                            <div class="mb-1 flex items-center gap-2">
                                <i class="pi pi-comment text-gray-500"></i>
                                <span class="text-sm font-medium text-gray-800">Note</span>
                            </div>
                            <p class="m-0 break-words whitespace-pre-wrap text-sm leading-6 text-gray-600">{{ selectedObligation.note ?? 'No note available.' }}</p>
                        </div>

                        <!-- Original Date -->
                        <div>
                            <div class="mb-1 flex items-center gap-2">
                                <i class="pi pi-calendar text-gray-500"></i>
                                <span class="text-sm font-medium text-gray-800">Original Date</span>
                            </div>
                            <p class="m-0 text-sm text-gray-600">{{ formattedDate(selectedObligation.date) }}</p>
                        </div>
                    </div>
                </Popover>
            </ScrollPanel>
        </section>
    </template>
</AppLayout>
</template>
