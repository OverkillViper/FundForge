<script lang="ts" setup>
import Button from 'primevue/button';
import { router, useForm } from '@inertiajs/vue3';
import { create, edit, settle, settled } from '@/routes/obligations';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ScrollPanel from 'primevue/scrollpanel';
import Popover from 'primevue/popover';
import { ref } from 'vue';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import AppLayout from '@/layouts/AppLayout.vue';

interface Account {
    id: number;
    name: string;
    currency: string;
    account_number?: string;
    type?: string;
    balance?: string;
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
    accounts: Account[];
    outstandingObligations: Obligation[];
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

const settleDialogVisible = ref(false);

const settleForm = useForm<{
    account_id: number | null;
    date: Date | null;
}>({
    account_id: null,
    date: new Date(),
});

const openSettleDialog = (obligation: Obligation) => {
    selectedObligation.value = obligation;

    settleForm.reset();

    settleForm.account_id = null;
    settleForm.date = new Date();

    settleDialogVisible.value = true;
};

const formatDate = (date: Date | null) => {
    if (!date) {
        return null;
    }

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const submitSettlement = () => {
    if (
        !selectedObligation.value ||
        !settleForm.account_id ||
        !settleForm.date
    ) {
        return;
    }

    settleForm
        .transform(() => ({
            account_id: settleForm.account_id,
            date: formatDate(settleForm.date),
        }))
        .post(settle.url(selectedObligation.value.id), {
            preserveScroll: true,

            onSuccess: () => {
                settleDialogVisible.value = false;
                selectedObligation.value = null;
                settleForm.reset();
            },
        });
};
</script>

<template>
<AppLayout page-title="Obligations">
    <template #toolbar>
        <Button
            label="New Obligation"
            icon="pi pi-plus"
            size="small"
            @click="router.visit(create.url())"
        />
    </template>
    <template #content>
        <!-- Outstanding -->
        <section>
            <ScrollPanel class="h-[730px] w-full">
                <DataTable
                    v-if="outstandingObligations.length"
                    :value="outstandingObligations"
                    dataKey="id"
                    rowHover
                    tableStyle="min-width: 60rem"
                    class="overflow-hidden rounded-xl! text-sm! w-2/3 mx-auto"
                >
                    <!-- Icon -->
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

                    <!-- Actions -->
                    <Column header="" style="width: 140px">
                        <template #body="{ data }">
                            <div class="obligation-actions">
                                <Button icon="pi pi-info-circle" severity="secondary" text rounded size="small" aria-label="Obligation information" @click="toggleObligationInfo($event, data)" />
                                <Button
                                    icon="pi pi-pencil"
                                    severity="secondary"
                                    text rounded
                                    size="small"
                                    aria-label="Edit obligation"
                                    @click="router.visit(edit.url(data.id))"
                                    v-tooltip.top="{ value: 'Edit obligation', escape: false, class: 'text-sm' }"
                                />
                                <Button
                                    icon="pi pi-check"
                                    severity="success"
                                    text rounded
                                    size="small"
                                    aria-label="Settle obligation"
                                    @click="openSettleDialog(data)"
                                    v-tooltip.top="{ value: 'Settle obligation', escape: false, class: 'text-sm' }"
                                />
                            </div>
                        </template>
                    </Column>
                </DataTable>

                <!-- Empty -->
                <div
                    v-else
                    class="col-span-3 rounded-2xl flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-300 bg-gray-50/70"
                >
                    <i class="pi pi-check-circle mb-3 text-2xl" />

                    <span class="text-sm"> No outstanding obligations. </span>
                </div>

                <!-- Info Popover -->
                <Popover ref="obligationPopover">
                    <div
                        v-if="selectedObligation"
                        class="flex w-80 flex-col gap-4"
                    >
                        <div>
                            <div class="mb-1 flex items-center gap-2">
                                <i class="pi pi-comment text-gray-500" />

                                <span class="text-sm font-medium text-gray-800">
                                    Note
                                </span>
                            </div>

                            <p
                                class="m-0 text-sm leading-6 break-words whitespace-pre-wrap text-gray-600"
                            >
                                {{
                                    selectedObligation.note ??
                                    'No note available.'
                                }}
                            </p>
                        </div>
                    </div>
                </Popover>
            </ScrollPanel>
        </section>

        <!-- Settlement Dialog -->
        <Dialog
            v-model:visible="settleDialogVisible"
            modal
            header="Settle Obligation"
            :style="{
                width: '28rem',
            }"
        >
            <div v-if="selectedObligation" class="flex flex-col gap-4">
                <!-- Summary -->
                <div class="flex flex-col gap-2 rounded-lg bg-gray-50 p-4">
                    <div class="font-medium">
                        {{
                            selectedObligation.type === 'lending'
                                ? `Received from ${selectedObligation.person}`
                                : `Repaid to ${selectedObligation.person}`
                        }}
                    </div>

                    <div class="text-sm text-gray-500">
                        Amount:

                        <span class="font-medium text-gray-700">
                            {{ formattedAmount(selectedObligation) }}

                            {{
                                selectedObligation.transaction?.account
                                    ?.currency ?? 'BDT'
                            }}
                        </span>
                    </div>
                </div>

                <!-- Account -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium">
                        Settlement Account
                    </label>

                    <Select
                        v-model="settleForm.account_id"
                        :options="accounts"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select account"
                        size="small"
                        fluid
                        showClear
                    >
                        <template #option="{ option }">
                            <div
                                class="flex w-full items-center justify-between gap-4"
                            >
                                <div class="flex flex-col">
                                    <span class="text-sm font-medium">
                                        {{ option.name }}
                                    </span>

                                    <span
                                        class="text-xs text-gray-400 capitalize"
                                    >
                                        {{ option.type }}
                                        account
                                    </span>
                                </div>

                                <div class="text-sm text-gray-500">
                                    {{ option.balance }}
                                    {{ option.currency }}
                                </div>
                            </div>
                        </template>
                    </Select>

                    <small
                        v-if="settleForm.errors.account_id"
                        class="text-red-500"
                    >
                        {{ settleForm.errors.account_id }}
                    </small>
                </div>

                <!-- Date -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium"> Settlement Date </label>

                    <DatePicker
                        v-model="settleForm.date"
                        date-format="dd-M-yy"
                        size="small"
                        show-button-bar
                        fluid
                    />

                    <small v-if="settleForm.errors.date" class="text-red-500">
                        {{ settleForm.errors.date }}
                    </small>
                </div>

                <!-- Actions -->
                <div class="mt-2 flex justify-end gap-2">
                    <Button
                        label="Cancel"
                        severity="secondary"
                        size="small"
                        @click="settleDialogVisible = false"
                    />

                    <Button
                        label="Settle"
                        icon="pi pi-check"
                        size="small"
                        :loading="settleForm.processing"
                        :disabled="!settleForm.account_id || !settleForm.date"
                        @click="submitSettlement"
                    />
                </div>
            </div>
        </Dialog>
    </template>
</AppLayout>

</template>
