<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import Popover from 'primevue/popover';
import Button from 'primevue/button';
import ScrollPanel from 'primevue/scrollpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import { create, edit, bulkDestroy } from '@/routes/transactions';
import AppLayout from '@/layouts/AppLayout.vue';

defineOptions({ layout: { props: { title: 'Transactions' } } });

interface Account {
    id: number;
    name: string;
    account_number: string;
    type: string;
    balance: string;
    currency: string;
    is_active: boolean;
}

interface Category {
    id: number;
    name: string;
}

interface DpsInvestment {
    id: number;
    name: string;
}

interface Dps {
    id: number;
    investment: DpsInvestment;
}

interface DpsPayment {
    id: number;
    dps: Dps;
}

interface Transaction {
    id: number;
    user_id: number;
    account_id: number;
    category_id: number | null;

    title: string;

    type: 'income' | 'expense' | 'investment' | 'lending' | 'borrowing';

    amount: string | number;
    transaction_date: string;

    note: string | null;
    reference: string | null;

    created_at: string;
    updated_at: string;

    account?: Account;
    category?: Category;
    dps_payment?: DpsPayment;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTransactions {
    data: Transaction[];

    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;

    links: PaginationLink[];
}

const props = defineProps<{
    transactions: PaginatedTransactions;
}>();

const selectedTransactions = ref<number[]>([]);
const showDeleteWarning = ref(false);

const selectedCount = computed(() => {
    return selectedTransactions.value.length;
});

const selectedReferencedTransactions = computed(() => {
    return props.transactions.data.filter((transaction) => {
        return (
            selectedTransactions.value.includes(transaction.id) &&
            transaction.dps_payment?.dps?.investment
        );
    });
});

const hasReferencedTransactions = computed(() => {
    return selectedReferencedTransactions.value.length > 0;
});

const isSelected = (id: number) => {
    return selectedTransactions.value.includes(id);
};

const toggleSelection = (id: number) => {
    if (isSelected(id)) {
        selectedTransactions.value = selectedTransactions.value.filter(
            (transactionId) => transactionId !== id,
        );

        return;
    }

    selectedTransactions.value.push(id);
};

const clearSelection = () => {
    selectedTransactions.value = [];
};

const typeConfig = (type: Transaction['type']) => {
    switch (type) {
        case 'income':
            return {
                label: 'Income',
                icon: 'pi pi-arrow-down-right',
                color: 'text-green-600',
                bg: 'bg-green-50',
            };

        case 'expense':
            return {
                label: 'Expense',
                icon: 'pi pi-arrow-up-right',
                color: 'text-gray-800',
                bg: 'bg-red-100',
            };

        case 'investment':
            return {
                label: 'Investment',
                icon: 'pi pi-building-columns',
                color: 'text-blue-800',
                bg: 'bg-blue-50',
            };

        case 'lending':
            return {
                label: 'Lending',
                icon: 'pi pi-arrow-u-turn-up-left',
                color: 'text-orange-600',
                bg: 'bg-orange-50',
            };

        case 'borrowing':
            return {
                label: 'Borrowing',
                icon: 'pi pi-arrow-u-turn-up-right',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
            };

        default:
            return {
                label: 'Transaction',
                icon: 'pi pi-circle',
                color: 'text-gray-600',
                bg: 'bg-gray-50',
            };
    }
};

const transactionPopover = ref();

const selectedTransaction = ref<Transaction | null>(null);

const toggleTransactionInfo = (event: Event, transaction: Transaction) => {
    selectedTransaction.value = transaction;

    transactionPopover.value.toggle(event);
};

const formattedAmount = (transaction: Transaction) => {
    return Number(transaction.amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formattedDate = (transaction: Transaction) => {
    return new Date(transaction.transaction_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const amountPrefix = (transaction: Transaction) => {
    return transaction.type === 'income' || transaction.type === 'borrowing'
        ? '+'
        : '-';
};

const openDeleteDialog = () => {
    if (selectedCount.value === 0) {
        return;
    }

    if (hasReferencedTransactions.value) {
        showDeleteWarning.value = true;
        return;
    }

    deleteTransactions();
};

const closeDeleteDialog = () => {
    showDeleteWarning.value = false;
};

const deleteTransactions = () => {
    router.delete(bulkDestroy.url(), {
        data: {
            transaction_ids: selectedTransactions.value,
        },

        preserveScroll: true,

        onSuccess: () => {
            clearSelection();
            showDeleteWarning.value = false;
        },
    });
};
</script>

<style scoped>
.transaction-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.25rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 150ms ease;
}

:deep(.p-datatable-tbody > tr:hover) .transaction-actions,
.transaction-actions-selected {
    opacity: 1;
    pointer-events: auto;
}
</style>

<template>
<AppLayout page-title="Transactions">
    <template #toolbar>
        <Button
            v-if="selectedCount > 0"
            :label="`Delete ${selectedCount}`"
            icon="pi pi-trash"
            severity="danger"
            size="small"
            @click="openDeleteDialog"
        />

        <Button
            label="New Transaction"
            size="small"
            icon="pi pi-plus"
            @click="router.visit(create.url())"
        />
    </template>

    <template #content>
        <ScrollPanel class="mt-4 h-[700px] w-full">
            <DataTable
                :value="transactions.data"
                dataKey="id"
                rowHover
                class="overflow-hidden rounded-xl! w-3/4 mx-auto text-sm!"
                v-if="transactions.data.length"
            >
                <Column header="" style="width: 64px">
                    <template #body="{ data }">
                        <div
                            class="flex h-9 w-9 items-center justify-center rounded-lg"
                            :class="typeConfig(data.type).bg"
                        >
                            <i
                                :class="[typeConfig(data.type).icon, typeConfig(data.type).color]"
                                class="text-sm!"
                            ></i>
                        </div>
                    </template>
                </Column>

                <Column header="Transaction">
                    <template #body="{ data }">
                        <div class="min-w-0">
                            <div class="truncate font-semibold text-gray-800">
                                {{ data.title }}
                            </div>

                            <div class="mt-0.5 flex items-center gap-x-2 text-xs text-gray-500">
                                <span>{{ formattedDate(data) }}</span>

                                <span
                                    v-if="data.type === 'expense'"
                                    class="text-gray-300"
                                >
                                    •
                                </span>

                                <span
                                    v-if="data.type === 'expense'"
                                    class="truncate"
                                >
                                    {{ data.category?.name ?? 'Uncategorized' }}
                                </span>
                            </div>
                        </div>
                    </template>
                </Column>

                <Column
                    header="Type"
                    headerClass="text-left!"
                    style="width: 130px"
                >
                    <template #body="{ data }">
                        <span
                            class="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold"
                            :class="[
                                typeConfig(data.type).bg,
                                typeConfig(data.type).color,
                            ]"
                        >
                            {{ typeConfig(data.type).label }}
                        </span>
                    </template>
                </Column>

                <Column header="Account" style="width: 190px">
                    <template #body="{ data }">
                        <div class="flex min-w-0 items-center gap-x-2">
                            <div
                                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100"
                            >
                                <i class="pi pi-wallet text-xs text-gray-500"></i>
                            </div>

                            <div class="min-w-0">
                                <div class="truncate text-sm font-medium text-gray-700">
                                    {{ data.account?.name ?? 'Unknown account' }}
                                </div>

                                <div
                                    v-if="data.account?.type"
                                    class="truncate text-[11px] capitalize text-gray-400"
                                >
                                    {{ data.account.type }}
                                </div>
                            </div>
                        </div>
                    </template>
                </Column>

                <Column
                    header="Amount"
                    style="width: 160px"
                    :pt="{
                        columnHeaderContent: 'flex justify-end!',
                    }"
                >
                    <template #body="{ data }">
                        <div class="flex flex-col items-end">
                            <div
                                class="whitespace-nowrap text-sm font-bold"
                                :class="typeConfig(data.type).color"
                            >
                                {{ amountPrefix(data) }}{{ formattedAmount(data) }}
                            </div>

                            <span class="text-[11px] font-medium text-gray-400">
                                {{ data.account?.currency ?? 'BDT' }}
                            </span>
                        </div>
                    </template>
                </Column>

                <Column header="" style="width: 140px">
                    <template #body="{ data }">
                        <div
                            class="transaction-actions"
                            :class="{
                                'transaction-actions-selected': isSelected(data.id),
                            }"
                        >
                            <Checkbox
                                :modelValue="isSelected(data.id)"
                                :binary="true"
                                @update:modelValue="toggleSelection(data.id)"
                            />

                            <Button
                                icon="pi pi-info-circle"
                                severity="secondary"
                                text
                                rounded
                                size="small"
                                aria-label="Transaction information"
                                @click="toggleTransactionInfo($event, data)"
                            />

                            <Button
                                icon="pi pi-pencil"
                                severity="secondary"
                                text
                                rounded
                                size="small"
                                aria-label="Edit transaction"
                                @click="router.visit(edit.url(data.id))"
                            />
                        </div>
                    </template>
                </Column>

                <Popover ref="transactionPopover">
                    <div v-if="selectedTransaction" class="flex w-80 flex-col gap-4">
                        <div>
                            <div class="mb-1 flex items-center gap-2">
                                <i class="pi pi-comment text-gray-500"></i>

                                <span class="text-sm font-medium text-gray-800">Note</span>
                            </div>

                            <p class="m-0 text-sm leading-6 break-words whitespace-pre-wrap text-gray-600">
                                {{ selectedTransaction.note ?? 'No note available.' }}
                            </p>
                        </div>

                        <div>
                            <div class="mb-1 flex items-center gap-2">
                                <i class="pi pi-link text-gray-500"></i>
                                <span class="text-sm font-medium text-gray-800">Reference</span>
                            </div>

                            <p class="m-0 text-sm leading-6 break-words whitespace-pre-wrap text-gray-600">
                                {{ selectedTransaction.reference ?? 'No reference available.' }}
                            </p>
                        </div>
                    </div>
                </Popover>
            </DataTable>
            <div v-if="transactions.data.length === 0" class="col-span-3 rounded-2xl flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-300 bg-gray-50/70">
                <i class="pi pi-exclamation-triangle mb-3 text-2xl"></i>
                <span class="text-sm"> No transactions recorded yet. </span>
                <Link :href="create.url()" class="mt-4">
                    <Button
                        label="New Transaction"
                        icon="pi pi-plus"
                        size="small"
                        severity="secondary"
                    />
                </Link>
            </div>
        </ScrollPanel>
        <Dialog v-model:visible="showDeleteWarning" modal header="Unable to Delete Transactions" :style="{ width: '32rem' }">
            <div class="flex flex-col gap-4">
                <div class="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-amber-900" >
                    <i class="pi pi-exclamation-triangle mt-0.5"></i>

                    <p class="m-0 text-sm leading-6">
                        Some of the selected transactions are referenced by
                        investment records and cannot be deleted directly.
                    </p>
                </div>

                <div>
                    <p class="mb-3 text-sm text-gray-700">
                        The following transactions are associated with
                        investment records:
                    </p>

                    <div class="flex flex-col gap-2">
                        <div
                            v-for="transaction in selectedReferencedTransactions"
                            :key="transaction.id"
                            class="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-3"
                        >
                            <div class="min-w-0">
                                <div class="truncate text-sm font-medium">
                                    {{ transaction.title }}
                                </div>

                                <div class="mt-1 text-xs text-gray-500">
                                    {{ transaction.dps_payment?.dps?.investment?.name }}
                                </div>
                            </div>

                            <Link
                                v-if="transaction.dps_payment?.dps?.id"
                                :href="`/investments/dps/${transaction.dps_payment.dps.id}`"
                                class="shrink-0 text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                                Go to investment
                            </Link>
                        </div>
                    </div>
                </div>

                <p class="m-0 text-sm leading-6 text-gray-600">
                    Please delete the related investment records first before
                    attempting to delete these transactions.
                </p>
            </div>

            <template #footer>
                <Button
                    label="Close"
                    severity="secondary"
                    outlined
                    size="small"
                    @click="closeDeleteDialog"
                />
            </template>
        </Dialog>
    </template>
</AppLayout>
</template>