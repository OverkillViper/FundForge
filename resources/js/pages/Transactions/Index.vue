<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import Popover from 'primevue/popover';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import { create, edit, bulkDestroy } from '@/routes/transactions';
import AppLayout from '@/layouts/AppLayout.vue';

defineOptions({ layout: { props: { title: 'Transactions' } } });

interface Account {
    id: number;
    name: string;
    currency: string;
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

interface FilterValues {
    type: string;
    account_id: string | number;
    date: string;
    date_from: string;
    date_to: string;
    amount_min: string | number;
    amount_max: string | number;
    category_id: string | number;
}

interface FilterForm {
    type: string;
    account_id: string;
    date: Date | null;
    date_range: (Date | null)[];
    amount_min: number | null;
    amount_max: number | null;
    category_id: string;
}

const props = defineProps<{
    transactions: PaginatedTransactions;
    accounts: Account[];
    categories: Category[];
    filters: FilterValues;
}>();

const selectedTransactions = ref<number[]>([]);
const showDeleteWarning = ref(false);
const showFilters = ref(false);
const applyingFilters = ref(false);

const scrollContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false);
let lastScrollTop = 0;

const createEmptyFilters = (): FilterForm => ({
    type: '',
    account_id: '',
    date: null,
    date_range: [],
    amount_min: null,
    amount_max: null,
    category_id: '',
});

const filterForm = ref<FilterForm>(createEmptyFilters());

const parseDate = (value: string | null | undefined): Date | null => {
    if (!value) return null;

    const [year, month, day] = value.split('-').map(Number);

    if (!year || !month || !day) return null;

    return new Date(year, month - 1, day);
};

const formatDateForRequest = (value: Date | null): string => {
    if (!value) return '';

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const syncFilters = (filters: FilterValues) => {
    filterForm.value = {
        type: filters.type ?? '',
        account_id: String(filters.account_id ?? ''),
        date: parseDate(filters.date),
        date_range: filters.date_from || filters.date_to
            ? [parseDate(filters.date_from) ?? null, parseDate(filters.date_to) ?? null]
            : [],
        amount_min: filters.amount_min === '' || filters.amount_min == null ? null : Number(filters.amount_min),
        amount_max: filters.amount_max === '' || filters.amount_max == null ? null : Number(filters.amount_max),
        category_id: String(filters.category_id ?? ''),
    };
};

syncFilters(props.filters);

watch(() => props.filters, syncFilters, { deep: true });

const selectedCount = computed(() => selectedTransactions.value.length);

const selectedReferencedTransactions = computed(() =>
    props.transactions.data.filter((transaction) =>
        selectedTransactions.value.includes(transaction.id) &&
        !!transaction.dps_payment?.dps?.investment,
    ),
);

const hasReferencedTransactions = computed(() =>
    selectedReferencedTransactions.value.length > 0,
);

const isSelected = (id: number) => selectedTransactions.value.includes(id);

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

const activeFilterCount = computed(() => {
    const filters = filterForm.value;

    return [
        filters.type,
        filters.account_id,
        filters.category_id,
        filters.date,
        filters.date_range.some(Boolean) ? filters.date_range : null,
        filters.amount_min,
        filters.amount_max,
    ].filter((value) => value !== '' && value !== null).length;
});

const typeOptions = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
    { label: 'Investment', value: 'investment' },
    { label: 'Lending', value: 'lending' },
    { label: 'Borrowing', value: 'borrowing' },
];

const accountOptions = computed(() => [
    { label: 'All accounts', value: '' },
    ...props.accounts.map((account) => ({
        label: `${account.name} (${account.currency})`,
        value: String(account.id),
    })),
]);

const categoryOptions = computed(() => [
    { label: 'All categories', value: '' },
    ...props.categories.map((category) => ({
        label: category.name,
        value: String(category.id),
    })),
]);

const typeFilterOptions = computed(() => [
    { label: 'All types', value: '' },
    ...typeOptions,
]);

const handleWheel = (event: WheelEvent) => {
    const container = scrollContainer.value;

    if (!container || isLoading.value || event.deltaY >= 0) return;

    const hasOverflow = container.scrollHeight > container.clientHeight + 1;

    if (!hasOverflow && props.transactions.prev_page_url) {
        loadTransactions('previous');
    }
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

const formattedAmount = (transaction: Transaction) =>
    Number(transaction.amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formattedDate = (transaction: Transaction) =>
    new Date(transaction.transaction_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

const amountPrefix = (transaction: Transaction) =>
    transaction.type === 'income' || transaction.type === 'borrowing' ? '+' : '-';

const onExactDateChange = (value: Date | null | undefined) => {
    filterForm.value.date = value ?? null;

    if (value) filterForm.value.date_range = [];
};

const onDateRangeChange = (value: (Date | null)[] | null | undefined) => {
    filterForm.value.date_range = value ?? [];

    if (value?.some(Boolean)) filterForm.value.date = null;
};

const applyFilters = () => {
    applyingFilters.value = true;
    const form = filterForm.value;
    const params: Record<string, string | number> = {};

    if (form.type) params.type = form.type;
    if (form.account_id) params.account_id = form.account_id;
    if (form.category_id) params.category_id = form.category_id;

    const date = formatDateForRequest(form.date);
    const [rangeStart, rangeEnd] = form.date_range;

    if (date) {
        params.date = date;
    } else {
        const dateFrom = formatDateForRequest(rangeStart ?? null);
        const dateTo = formatDateForRequest(rangeEnd ?? null);

        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
    }

    if (form.amount_min !== null) params.amount_min = form.amount_min;
    if (form.amount_max !== null) params.amount_max = form.amount_max;

    router.get(window.location.pathname, params, {
        only: ['transactions', 'filters'],
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onSuccess: () => {
            clearSelection();
            showFilters.value = false;

            void nextTick(() => {
                if (scrollContainer.value) {
                    scrollContainer.value.scrollTop = 0;
                    lastScrollTop = 0;
                }
            });
            applyingFilters.value = false;
        },
    });
};

const clearFilters = () => {
    filterForm.value = createEmptyFilters();
    applyFilters();
};

const loadTransactions = (direction: 'next' | 'previous') => {
    if (isLoading.value) return;

    const paginationUrl = direction === 'next'
        ? props.transactions.next_page_url
        : props.transactions.prev_page_url;

    if (!paginationUrl) return;

    const url = new URL(paginationUrl, window.location.origin);
    const relativeUrl = `${url.pathname}${url.search}`;

    isLoading.value = true;

    router.get(relativeUrl, {}, {
        only: ['transactions'],
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onSuccess: () => {
            clearSelection();

            void nextTick(() => {
                const container = scrollContainer.value;
                if (!container) return;

                const maxScroll = Math.max(
                    0,
                    container.scrollHeight - container.clientHeight,
                );

                container.scrollTop = direction === 'next'
                    ? Math.min(150, maxScroll)
                    : Math.max(0, maxScroll - 150);

                lastScrollTop = container.scrollTop;
            });
        },
        onFinish: () => {
            isLoading.value = false;
        },
    });
};

const handleScroll = (event: Event) => {
    const container = event.target as HTMLElement;
    const currentScrollTop = container.scrollTop;

    const scrollingDown = currentScrollTop > lastScrollTop;
    const scrollingUp = currentScrollTop < lastScrollTop;

    lastScrollTop = currentScrollTop;

    if (isLoading.value) return;

    if (
        scrollingDown &&
        currentScrollTop + container.clientHeight >= container.scrollHeight - 80
    ) {
        loadTransactions('next');
    } else if (scrollingUp && currentScrollTop <= 80) {
        loadTransactions('previous');
    }
};

const openDeleteDialog = () => {
    if (selectedCount.value === 0) return;

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

@media (max-width: 639px) {
    .transaction-actions {
        opacity: 1;
        pointer-events: auto;
        gap: 0;
    }

    :deep(.p-datatable-tbody > tr > td) {
        padding: 0.4rem 0.3rem;
    }

    :deep(.p-datatable-thead > tr > th) {
        padding: 0.4rem 0.3rem;
    }

    :deep(.p-checkbox) {
        transform: scale(0.85);
    }
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
                :label="activeFilterCount > 0 ? `Filter (${activeFilterCount})` : 'Filter'"
                icon="pi pi-filter"
                size="small"
                :variant="showFilters ? undefined : 'outlined'"
                severity="secondary"
                @click="showFilters = true"
            />

            <Button
                label="New Transaction"
                size="small"
                icon="pi pi-plus"
                @click="router.visit(create.url())"
            />
        </template>

        <template #content>
            <div class="relative mt-4 w-full">
                <!-- Filter dialog -->
                <Dialog
                    v-model:visible="showFilters"
                    modal
                    header="Filter Transactions"
                    :style="{ width: '36rem', maxWidth: 'calc(100vw - 2rem)' }"
                    :breakpoints="{ '768px': '95vw' }"
                    :draggable="false"
                >
                    <form class="flex flex-col gap-3 lg:gap-5" @submit.prevent="applyFilters">
                        <!-- Transaction type -->
                        <section class="flex flex-col gap-3">
                            <div class="flex items-center gap-2">
                                <div class="flex size-6 lg:size-9 items-center justify-center rounded-md lg:rounded-lg bg-blue-50">
                                    <i class="pi pi-arrow-right-arrow-left text-[12px]! lg:text-sm! text-blue-700"></i>
                                </div>
                                <div>
                                    <h3 class="text-xs lg:text-sm font-semibold text-gray-800">Transaction type</h3>
                                    <p class="text-[10px] lg:text-xs text-gray-500">Choose the kind of transaction.</p>
                                </div>
                            </div>

                            <Select
                                v-model="filterForm.type"
                                :options="typeFilterOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All types"
                                class="w-full"
                                size="small"
                                :pt="{
                                    label: { class: 'text-xs lg:text-sm !py-1.5' },
                                    option: { class: 'text-xs lg:text-sm !py-1 !px-2' },
                                    optionLabel: { class: 'text-xs lg:text-sm' },
                                    dropdown: { class: '!w-7' },
                                    overlay: { class: 'text-xs lg:text-sm' },
                                    list: { class: '!p-1' },
                                    filterInput: { class: 'text-xs lg:text-sm !py-1' }
                                }"
                            />
                        </section>

                        <div class="border-t border-gray-100"></div>

                        <!-- Account -->
                        <section class="flex flex-col gap-3">
                            <div class="flex items-center gap-2">
                                <div class="flex size-6 lg:size-9 items-center justify-center rounded-md lg:rounded-lg bg-violet-50">
                                    <i class="pi pi-wallet text-[12px]! lg:text-sm! text-violet-700"></i>
                                </div>
                                <div>
                                    <h3 class="text-xs lg:text-sm font-semibold text-gray-800">Account</h3>
                                    <p class="text-xs text-gray-500">Show transactions from a particular account.</p>
                                </div>
                            </div>

                            <Select
                                v-model="filterForm.account_id"
                                :options="accountOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All accounts"
                                class="w-full"
                                size="small"
                                filter
                                :pt="{
                                    label: { class: 'text-xs lg:text-sm !py-1.5' },
                                    option: { class: 'text-xs lg:text-sm !py-1 !px-2' },
                                    optionLabel: { class: 'text-xs lg:text-sm' },
                                    dropdown: { class: '!w-7' },
                                    overlay: { class: 'text-xs lg:text-sm' },
                                    list: { class: '!p-1' },
                                    filterInput: { class: 'text-xs lg:text-sm !py-1' }
                                }"
                            />
                        </section>

                        <div class="border-t border-gray-100"></div>

                        <!-- Category -->
                        <section class="flex flex-col gap-3">
                            <div class="flex items-center gap-2">
                                <div class="flex size-6 lg:size-9 items-center justify-center rounded-md lg:rounded-lg bg-emerald-50">
                                    <i class="pi pi-tags text-[12px]! lg:text-sm! text-emerald-700"></i>
                                </div>
                                <div>
                                    <h3 class="text-xs lg:text-sm font-semibold text-gray-800">Category</h3>
                                    <p class="text-[10px] lg:text-xs text-gray-500">Narrow transactions down by category.</p>
                                </div>
                            </div>

                            <Select
                                v-model="filterForm.category_id"
                                :options="categoryOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All categories"
                                class="w-full"
                                size="small"
                                filter
                                :pt="{
                                    label: { class: 'text-xs lg:text-sm !py-1.5' },
                                    option: { class: 'text-xs lg:text-sm !py-1 !px-2' },
                                    optionLabel: { class: 'text-xs lg:text-sm' },
                                    dropdown: { class: '!w-7' },
                                    overlay: { class: 'text-xs lg:text-sm' },
                                    list: { class: '!p-1' },
                                    filterInput: { class: 'text-xs lg:text-sm !py-1' }
                                }"
                            />
                        </section>

                        <div class="border-t border-gray-100"></div>

                        <!-- Date -->
                        <section class="flex flex-col gap-3">
                            <div class="flex items-center gap-2">
                                <div class="flex size-6 lg:size-9 items-center justify-center rounded-md lg:rounded-lg bg-orange-50">
                                    <i class="pi pi-calendar text-[12px]! lg:text-sm! text-orange-700"></i>
                                </div>
                                <div>
                                    <h3 class="text-xs lg:text-sm font-semibold text-gray-800">Date</h3>
                                    <p class="text-[10px] lg:text-xs text-gray-500">Choose a specific date or a date range.</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label class="flex flex-col gap-1.5">
                                    <span class="text-[12px] lg:text-xs font-medium text-gray-600">Specific date</span>
                                    <DatePicker
                                        :modelValue="filterForm.date"
                                        @update:modelValue="onExactDateChange"
                                        dateFormat="dd M yy"
                                        placeholder="Choose date"
                                        showIcon
                                        iconDisplay="input"
                                        showButtonBar
                                        class="w-full"
                                        inputClass="w-full"
                                        size="small"
                                    />
                                </label>

                                <label class="flex flex-col gap-1.5">
                                    <span class="text-[12px] lg:text-xs font-medium text-gray-600">Date range</span>
                                    <DatePicker
                                        :modelValue="filterForm.date_range"
                                        @update:modelValue="onDateRangeChange"
                                        selectionMode="range"
                                        dateFormat="dd M yy"
                                        placeholder="Select date range"
                                        showIcon
                                        iconDisplay="input"
                                        showButtonBar
                                        :manualInput="false"
                                        class="w-full"
                                        inputClass="w-full"
                                        size="small"
                                    />
                                </label>
                            </div>
                        </section>

                        <div class="border-t border-gray-100"></div>

                        <!-- Amount -->
                        <section class="flex flex-col gap-3">
                            <div class="flex items-center gap-2">
                                <div class="flex size-6 lg:size-9 items-center justify-center rounded-md lg:rounded-lg bg-green-50">
                                    <i class="pi pi-money-bill text-[12px]! lg:text-sm! text-green-700"></i>
                                </div>
                                <div>
                                    <h3 class="text-xs lg:text-sm font-semibold text-gray-800">Amount range</h3>
                                    <p class="text-[10px] lg:text-xs text-gray-500">Set a minimum amount, maximum amount, or both.</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label class="flex flex-col gap-1.5">
                                    <span class="text-xs font-medium text-gray-600">Minimum amount</span>
                                    <InputNumber
                                        v-model="filterForm.amount_min"
                                        mode="decimal"
                                        :min="0"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="2"
                                        placeholder="No minimum"
                                        class="w-full"
                                        inputClass="w-full px-2 py-1!"
                                        size="small"
                                    />
                                </label>

                                <label class="flex flex-col gap-1.5">
                                    <span class="text-xs font-medium text-gray-600">Maximum amount</span>
                                    <InputNumber
                                        v-model="filterForm.amount_max"
                                        mode="decimal"
                                        :min="0"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="2"
                                        placeholder="No maximum"
                                        class="w-full"
                                        inputClass="w-full px-2 py-1!"
                                        size="small"
                                    />
                                </label>
                            </div>
                        </section>

                        <div class="border-t border-gray-100"></div>

                        <!-- Dialog footer -->
                        <div class="flex justify-between gap-2 items-center">
                            <Button
                                type="button"
                                label="Clear filters"
                                icon="pi pi-filter-slash"
                                severity="secondary"
                                variant="text"
                                size="small"
                                @click="clearFilters"
                            />
                            <div class="flex-1"></div>
                            <Button
                                type="button"
                                label="Cancel"
                                severity="secondary"
                                variant="outlined"
                                size="small"
                                @click="showFilters = false"
                            />
                            <Button
                                type="submit"
                                label="Apply filters"
                                icon="pi pi-check"
                                :loading="applyingFilters"
                                size="small"
                            />
                        </div>
                    </form>
                </Dialog>

                <div
                    v-if="isLoading"
                    class="absolute inset-0 z-20 mx-auto -top-8 flex size-8 items-center justify-center rounded-full bg-primary/10 shadow lg:-top-12"
                >
                    <ProgressSpinner class="size-[1rem]!" />
                </div>

                <div
                    ref="scrollContainer"
                    class="h-[700px] w-full overflow-y-auto"
                    @scroll="handleScroll"
                    @wheel="handleWheel"
                >
                    <DataTable
                        v-if="transactions.data.length"
                        :value="transactions.data"
                        dataKey="id"
                        rowHover
                        class="transaction-table mx-auto w-full overflow-hidden rounded-xl! text-sm! sm:w-3/4"
                    >
                        <Column class="w-[36px] sm:w-[48px]">
                            <template #body="{ data }">
                                <div
                                    class="flex size-6 items-center justify-center rounded-md sm:size-9 sm:rounded-lg"
                                    :class="typeConfig(data.type).bg"
                                >
                                    <i
                                        :class="[typeConfig(data.type).icon, typeConfig(data.type).color]"
                                        class="text-[10px]! sm:text-sm!"
                                    ></i>
                                </div>
                            </template>
                        </Column>

                        <Column>
                            <template #body="{ data }">
                                <div class="min-w-0">
                                    <div class="truncate text-xs font-semibold text-gray-800 sm:text-sm">
                                        {{ data.title }}
                                    </div>

                                    <div class="mt-0.5 hidden min-w-0 items-center gap-x-2 text-xs text-gray-500 sm:flex">
                                        <span>{{ formattedDate(data) }}</span>
                                        <template v-if="data.type === 'expense'">
                                            <span class="text-gray-300">•</span>
                                            <span class="truncate">{{ data.category?.name ?? 'Uncategorized' }}</span>
                                        </template>
                                    </div>

                                    <div class="mt-1 flex min-w-0 items-center gap-x-1 text-[10px] leading-4 text-gray-500 sm:hidden">
                                        <span class="shrink-0">{{ formattedDate(data) }}</span>
                                        <template v-if="data.type === 'expense'">
                                            <span class="text-gray-300">·</span>
                                            <span class="truncate">{{ data.category?.name ?? 'Uncategorized' }}</span>
                                            <span class="text-gray-300">·</span>
                                            <span class="truncate">{{ data.account?.name ?? 'Unknown account' }}</span>
                                        </template>
                                    </div>

                                    <div class="flex items-center justify-between gap-1 sm:hidden">
                                        <div class="flex min-w-0 items-baseline gap-1">
                                            <span
                                                class="whitespace-nowrap text-[11px] font-semibold"
                                                :class="typeConfig(data.type).color"
                                            >
                                                {{ amountPrefix(data) }}{{ formattedAmount(data) }}
                                            </span>
                                            <span class="text-[9px] text-gray-400">
                                                {{ data.account?.currency ?? 'BDT' }}
                                            </span>
                                        </div>

                                        <div
                                            class="transaction-actions shrink-0"
                                            :class="{ 'transaction-actions-selected': isSelected(data.id) }"
                                        >
                                            <Checkbox
                                                :modelValue="isSelected(data.id)"
                                                :binary="true"
                                                class="me-1"
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
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <Column
                            class="hidden! sm:table-cell!"
                            bodyClass="hidden! sm:table-cell!"
                            style="width: 130px"
                        >
                            <template #body="{ data }">
                                <span
                                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold"
                                    :class="[typeConfig(data.type).bg, typeConfig(data.type).color]"
                                >
                                    {{ typeConfig(data.type).label }}
                                </span>
                            </template>
                        </Column>

                        <Column
                            class="hidden! sm:table-cell!"
                            bodyClass="hidden! sm:table-cell!"
                            style="width: 190px"
                        >
                            <template #body="{ data }">
                                <div class="flex min-w-0 items-center gap-x-2">
                                    <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100">
                                        <i class="pi pi-wallet text-xs text-gray-500"></i>
                                    </div>

                                    <div class="min-w-0">
                                        <div class="truncate text-sm font-medium text-gray-700">
                                            {{ data.account?.name ?? 'Unknown account' }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <Column
                            style="width: 160px"
                            headerClass="hidden! sm:table-cell!"
                            bodyClass="hidden! sm:table-cell!"
                            :pt="{ columnHeaderContent: 'flex justify-end!' }"
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

                        <Column header="" style="width: 100px" class="hidden! sm:table-cell!">
                            <template #body="{ data }">
                                <div
                                    class="transaction-actions"
                                    :class="{ 'transaction-actions-selected': isSelected(data.id) }"
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
                            <div v-if="selectedTransaction" class="flex w-60 flex-col gap-4 lg:w-80 lg:max-w-[80vw]">
                                <div>
                                    <div class="mb-1 flex items-center gap-2">
                                        <i class="pi pi-comment text-gray-500"></i>
                                        <span class="text-sm font-medium text-gray-800">Note</span>
                                    </div>
                                    <p class="m-0 break-words whitespace-pre-wrap text-sm leading-6 text-gray-600">
                                        {{ selectedTransaction.note ?? 'No note available.' }}
                                    </p>
                                </div>

                                <div>
                                    <div class="mb-1 flex items-center gap-2">
                                        <i class="pi pi-link text-gray-500"></i>
                                        <span class="text-sm font-medium text-gray-800">Reference</span>
                                    </div>
                                    <p class="m-0 break-words whitespace-pre-wrap text-sm leading-6 text-gray-600">
                                        {{ selectedTransaction.reference ?? 'No reference available.' }}
                                    </p>
                                </div>
                            </div>
                        </Popover>
                    </DataTable>

                    <div
                        v-else-if="!isLoading"
                        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 py-16 text-center"
                    >
                        <i class="pi pi-exclamation-triangle mb-3 text-2xl"></i>
                        <span class="text-sm">
                            {{ activeFilterCount > 0 ? 'No transactions match your filters.' : 'No transactions recorded yet.' }}
                        </span>

                        <div class="mt-4 flex gap-2">
                            <Button
                                v-if="activeFilterCount > 0"
                                label="Clear Filters"
                                icon="pi pi-filter-slash"
                                size="small"
                                severity="secondary"
                                variant="outlined"
                                @click="clearFilters"
                            />
                            <Link v-else :href="create.url()">
                                <Button label="New Transaction" icon="pi pi-plus" size="small" severity="secondary" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                v-model:visible="showDeleteWarning"
                modal
                header="Unable to Delete Transactions"
                :style="{ width: '32rem', maxWidth: 'calc(100vw - 2rem)' }"
                :breakpoints="{ '640px': '95vw' }"
            >
                <div class="flex flex-col gap-4">
                    <div class="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-amber-900">
                        <i class="pi pi-exclamation-triangle mt-0.5"></i>
                        <p class="m-0 text-sm leading-6">
                            Some of the selected transactions are referenced by investment records and cannot be deleted directly.
                        </p>
                    </div>

                    <div>
                        <p class="mb-3 text-sm text-gray-700">
                            The following transactions are associated with investment records:
                        </p>

                        <div class="flex flex-col gap-2">
                            <div
                                v-for="transaction in selectedReferencedTransactions"
                                :key="transaction.id"
                                class="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-3"
                            >
                                <div class="min-w-0">
                                    <div class="truncate text-sm font-medium">{{ transaction.title }}</div>
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
                        Please delete the related investment records first before attempting to delete these transactions.
                    </p>
                </div>

                <template #footer>
                    <Button
                        label="Close"
                        severity="secondary"
                        variant="outlined"
                        size="small"
                        @click="closeDeleteDialog"
                    />
                </template>
            </Dialog>
        </template>
    </AppLayout>
</template>