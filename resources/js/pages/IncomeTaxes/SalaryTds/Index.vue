<script lang="ts" setup>
import { ref } from 'vue';
import { Head, router } from '@inertiajs/vue3';

import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Select from 'primevue/select';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';

import CreateDialog from './CreateDialog.vue';
import EditDialog from './EditDialog.vue';

import { destroy, create } from '@/routes/salary-tds';
import AppLayout from '@/layouts/AppLayout.vue';

interface SalaryTds {
    id: number;
    date: string;
    amount: string | number;
}

const props = defineProps<{
    salaryTds: SalaryTds[];
    startIncomeYear: number;
    selectedIncomeYear: number;
}>();

const createDialog = ref<InstanceType<typeof CreateDialog> | null>(null);
const editDialog = ref<InstanceType<typeof EditDialog> | null>(null);

const confirm = useConfirm();

const incomeYears = Array.from(
    { length: new Date().getFullYear() - props.startIncomeYear },
    (_, index) => {
        const fromYear = props.startIncomeYear + index;

        return {
            label: `${fromYear}-${String(fromYear + 1).slice(-2)}`,
            value: fromYear,
        };
    },
);

const selectedYear = ref(props.selectedIncomeYear);

const changeIncomeYear = (year: number) => {
    router.get(
        '/income-taxes/salary-tds',
        { year },
        {
            preserveState: true,
            preserveScroll: true,
        },
    );
};

const formatMonth = (date: string): string => {
    const [year, month] = date.substring(0, 10).split('-').map(Number);

    return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
};

const formatAmount = (amount: string | number): string => {
    return Number(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const openCreate = () => {
    createDialog.value?.open();
};

const openEdit = (tds: SalaryTds) => {
    editDialog.value?.open(tds);
};

const confirmDelete = (tds: SalaryTds) => {
    confirm.require({
        message: `Are you sure you want to delete the TDS record for ${formatMonth(tds.date)}?`,
        header: 'Delete TDS Record',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            variant: 'text',
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger',
        },
        accept: () => {
            router.delete(destroy.url(tds.id), {
                preserveScroll: true,
            });
        },
    });
};
</script>

<style scoped>
:deep(.p-datatable-tbody > tr .row-actions) {
    opacity: 0;
    transition: opacity 150ms ease;
}

:deep(.p-datatable-tbody > tr:hover .row-actions) {
    opacity: 1;
}
</style>

<template>
    <AppLayout page-title="Salary TDS Records">
        <template #toolbar>
            <Select
                v-model="selectedYear"
                :options="incomeYears"
                optionLabel="label"
                optionValue="value"
                size="small"
                class="w-36"
                @update:modelValue="changeIncomeYear"
            />

            <Button
                label="Create Record"
                icon="pi pi-plus"
                size="small"
                @click="openCreate"
            />
        </template>

        <template #content>
            <div class="mt-6 flex w-1/2 flex-1 mx-auto justify-center">
                <DataTable
                    :value="props.salaryTds"
                    dataKey="id"
                    size="small"
                    rowHover
                    class="overflow-hidden! rounded-xl! border border-gray-200! text-sm w-3/4!"
                >
                    <Column header="" :style="{ width: '64px' }">
                        <template #body>
                            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                <i class="pi pi-receipt text-sm text-primary"></i>
                            </div>
                        </template>
                    </Column>

                    <Column header="Month" field="date" sortable>
                        <template #body="{ data }">
                            <div class="flex flex-col">
                                <span class="font-semibold text-gray-800">
                                    {{ formatMonth(data.date) }}
                                </span>
                                <span class="mt-0.5 text-[11px] text-gray-400">
                                    Salary TDS
                                </span>
                            </div>
                        </template>
                    </Column>

                    <Column
                        header="TDS Amount"
                        field="amount"
                        sortable
                        headerClass="text-right!"
                        style="width: 180px"
                    >
                        <template #body="{ data }">
                            <div class="flex flex-col items-end">
                                <span class="whitespace-nowrap text-sm font-bold text-gray-800">
                                    {{ formatAmount(data.amount) }}
                                </span>
                                <span class="text-[11px] font-medium text-gray-400">
                                    BDT
                                </span>
                            </div>
                        </template>
                    </Column>

                    <Column header="" :style="{ width: '110px' }">
                        <template #body="{ data }">
                            <div class="row-actions flex justify-end gap-0.5">
                                <Button
                                    icon="pi pi-pencil"
                                    text
                                    rounded
                                    size="small"
                                    severity="secondary"
                                    aria-label="Edit"
                                    v-tooltip.top="{ value: 'Edit', escape: false, class: 'text-sm' }"
                                    @click="openEdit(data)"
                                />

                                <Button
                                    icon="pi pi-trash"
                                    text
                                    rounded
                                    size="small"
                                    severity="danger"
                                    aria-label="Delete"
                                    v-tooltip.top="{ value: 'Delete', escape: false, class: 'text-sm' }"
                                    @click="confirmDelete(data)"
                                />
                            </div>
                        </template>
                    </Column>

                    <template #empty>
                        <div class="flex flex-col items-center justify-center px-6 py-14">
                            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                <i class="pi pi-receipt text-lg text-gray-400"></i>
                            </div>

                            <div class="mt-4 text-sm font-semibold text-gray-700">
                                No salary TDS records
                            </div>

                            <div class="mt-1 max-w-sm text-center text-xs leading-5 text-gray-400">
                                No salary TDS records were found for the selected income year.
                            </div>
                        </div>
                    </template>
                </DataTable>
            </div>

            <CreateDialog ref="createDialog" />
            <EditDialog ref="editDialog" />

            <ConfirmDialog />
        </template>
    </AppLayout>
</template>