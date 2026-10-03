<script lang="ts" setup>
import { ref } from 'vue';
import { Link, useForm } from '@inertiajs/vue3';

import ScrollPanel from 'primevue/scrollpanel';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { index } from '@/routes/accounts';
import { store, update, destroy } from '@/routes/investments/dps/payment/index';

const showCreateModal = ref(false);
const showDeleteDialog = ref(false);

const selectedPayment = ref<Payment | null>(null);

interface Payment {
    id: number;
    dps_id: number;
    transaction_id: number;
    amount: string | number;
    payment_date: string;
    created_at: string;
    updated_at: string;

    transaction?: {
        id: number;

        account?: {
            id: number;
            name: string;
            currency: string;
        };
    };
}

interface Account {
    id: number;
    name: string;
    account_number: string | null;
    type: string;
    opening_balance: string | number;
    balance: string | number;
    currency: string;
    is_active: boolean;
}

const props = defineProps<{
    payments: Payment[];
    accounts: Account[];
    amount: string | number;
    dps_id: number;
}>();

const form = useForm({
    payment_date: null as Date | null,
    account_id: null as number | null,
    amount: Number(props.amount),
});

const editForm = useForm({
    payment_date: null as Date | null,
    account_id: null as number | null,
    amount: 0,
});

const getAccount = (id: number | null) => {
    if (!id) {
        return null;
    }

    return props.accounts.find((account) => account.id === id) ?? null;
};

const formatAmount = (amount: string | number) => {
    return Number(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const submit = () => {
    form.post(store.url(props.dps_id), {
        onSuccess: () => {
            showCreateModal.value = false;

            form.reset();

            form.amount = Number(props.amount);
        },
    });
};

const openEditDialog = (payment: Payment) => {
    selectedPayment.value = payment;

    editForm.payment_date = new Date(payment.payment_date);

    editForm.account_id = payment.transaction?.account?.id ?? null;

    editForm.amount = Number(payment.amount);
};

const closeEditDialog = () => {
    selectedPayment.value = null;
    editForm.reset();
};

const updatePayment = () => {
    if (!selectedPayment.value) {
        return;
    }

    editForm.put(
        update.url({
            payment: selectedPayment.value.id,
        }),
        {
            onSuccess: () => {
                selectedPayment.value = null;
                editForm.reset();
            },
        },
    );
};

const openDeleteDialog = (payment: Payment) => {
    selectedPayment.value = payment;
    showDeleteDialog.value = true;
};

const closeDeleteDialog = () => {
    selectedPayment.value = null;
    showDeleteDialog.value = false;
};

const deletePayment = () => {
    if (!selectedPayment.value) {
        return;
    }

    const paymentId = selectedPayment.value.id;

    useForm({}).delete(
        destroy.url({
            payment: paymentId,
        }),
        {
            preserveScroll: true,

            onSuccess: () => {
                selectedPayment.value = null;
                showDeleteDialog.value = false;
            },
        },
    );
};
</script>

<style scoped>
.installment-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.25rem;

    opacity: 0;
    pointer-events: none;

    transition: opacity 150ms ease;
}

:deep(.p-datatable-tbody > tr:hover) .installment-actions {
    opacity: 1;
    pointer-events: auto;
}
</style>

<template>
    <ScrollPanel class="mt-4 h-[550px] w-full">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="font-semibold">Installment History</div>

            <Button
                label="Record Installment"
                icon="pi pi-plus"
                size="small"
                @click="showCreateModal = true"
            />
        </div>

        <!-- Installment History -->
        <DataTable
            v-if="payments.length"
            :value="payments"
            dataKey="id"
            rowHover
            class="mt-0 w-1/2 overflow-hidden! rounded-xl! text-sm!"
            tableStyle="min-width: 45rem"
        >
            <!-- Date -->
            <Column header="Payment Date" style="width: 150px">
                <template #body="{ data }">
                    <span class="font-medium">
                        {{ formatDate(data.payment_date) }}
                    </span>
                </template>
            </Column>

            <!-- Account -->
            <Column header="Source Account">
                <template #body="{ data }">
                    <div v-if="data.transaction?.account" class="flex flex-col">
                        <span class="font-medium">
                            {{ data.transaction.account.name }}
                        </span>
                    </div>

                    <span v-else class="text-gray-400"> Unknown account </span>
                </template>
            </Column>

            <!-- Amount -->
            <Column header="Amount" style="width: 180px">
                <template #body="{ data }">
                    <div class="flex items-baseline gap-2">
                        <span class="font-semibold">
                            {{ formatAmount(data.amount) }}
                        </span>

                        <span class="text-xs text-gray-500"> BDT </span>
                    </div>
                </template>
            </Column>

            <!-- Actions -->
            <Column header="" style="width: 100px">
                <template #body="{ data }">
                    <div class="installment-actions">
                        <Button
                            icon="pi pi-pencil"
                            severity="secondary"
                            text
                            rounded
                            size="small"
                            aria-label="Edit installment"
                            @click="openEditDialog(data)"
                        />

                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            text
                            rounded
                            size="small"
                            aria-label="Delete installment"
                            @click="openDeleteDialog(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Empty State -->
        <div
            v-if="payments.length === 0"
            class="flex flex-col items-center justify-center py-12 text-gray-500"
        >
            <i class="pi pi-calendar mb-3 text-2xl"></i>

            <span class="text-sm"> No installments recorded yet. </span>
        </div>

        <!-- Create Installment Dialog -->
        <Dialog
            v-model:visible="showCreateModal"
            modal
            header="Record Installment"
            :style="{ width: '24rem' }"
        >
            <div class="flex flex-col gap-4">
                <!-- Payment Date -->
                <div class="flex flex-col gap-1.5">
                    <div class="font-medium">Payment Date</div>

                    <DatePicker
                        v-model="form.payment_date"
                        dateFormat="dd-M-yy"
                        fluid
                        size="small"
                        placeholder="Select payment date"
                        showClear
                        showButtonBar
                    />
                </div>

                <!-- Source Account -->
                <div class="flex flex-col gap-1.5">
                    <div class="font-medium">Source Account</div>

                    <Select
                        v-model="form.account_id"
                        :options="accounts"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select source account"
                        size="small"
                        showClear
                        v-if="accounts.length"
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
                                        {{ option.type }} account
                                    </span>
                                </div>

                                <div class="flex flex-col items-end">
                                    <span class="text-sm font-medium">
                                        {{ option.balance }}
                                    </span>

                                    <span class="text-xs text-gray-400">
                                        {{ option.currency }}
                                    </span>
                                </div>
                            </div>
                        </template>

                        <template #value="{ value }">
                            <div
                                v-if="value"
                                class="flex w-full items-center justify-between"
                            >
                                <span>
                                    {{ getAccount(value)?.name }}
                                </span>

                                <span class="text-xs text-gray-400">
                                    {{ getAccount(value)?.balance }}
                                    {{ getAccount(value)?.currency }}
                                </span>
                            </div>

                            <span v-else class="text-gray-400">
                                Select source account
                            </span>
                        </template>
                    </Select>

                    <div
                        v-else
                        class="rounded-md border border-dashed border-gray-400 p-2 text-sm text-gray-500"
                    >
                        No account found. Please create an

                        <Link
                            :href="index.url()"
                            class="text-primary underline transition-colors hover:text-primary-400"
                        >
                            account
                        </Link>

                        first
                    </div>
                </div>

                <!-- Amount -->
                <div class="flex flex-col gap-1.5">
                    <div class="font-medium">Amount</div>

                    <InputNumber
                        v-model="form.amount"
                        suffix=" BDT"
                        size="small"
                    />

                    <small
                        v-if="form.amount != amount"
                        class="mx-1 flex items-center gap-x-4 text-gray-500"
                    >
                        <span class="icon-triangle-alert"></span>

                        <span>
                            <b>Please note:</b>
                            Amount is different than default installment amount
                            of this DPS
                        </span>
                    </small>
                </div>
            </div>

            <template #footer>
                <Button
                    size="small"
                    severity="secondary"
                    variant="outlined"
                    @click="showCreateModal = false"
                >
                    Cancel
                </Button>

                <Button
                    size="small"
                    :disabled="accounts.length < 1"
                    :loading="form.processing"
                    @click="submit"
                >
                    Record
                </Button>
            </template>
        </Dialog>

        <!-- Edit Installment Dialog -->
        <Dialog
            :visible="selectedPayment !== null && !showDeleteDialog"
            modal
            header="Edit Installment"
            :style="{ width: '24rem' }"
            @update:visible="
                (value) => {
                    if (!value) {
                        closeEditDialog();
                    }
                }
            "
        >
            <div class="flex flex-col gap-4">
                <!-- Payment Date -->
                <div class="flex flex-col gap-1.5">
                    <div class="font-medium">Payment Date</div>

                    <DatePicker
                        v-model="editForm.payment_date"
                        dateFormat="dd-M-yy"
                        fluid
                        size="small"
                        placeholder="Select payment date"
                        showClear
                        showButtonBar
                    />
                </div>

                <!-- Source Account -->
                <div class="flex flex-col gap-1.5">
                    <div class="font-medium">Source Account</div>

                    <Select
                        v-model="editForm.account_id"
                        :options="accounts"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select source account"
                        size="small"
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
                                        {{ option.type }} account
                                    </span>
                                </div>

                                <div class="flex flex-col items-end">
                                    <span class="text-sm font-medium">
                                        {{ option.balance }}
                                    </span>

                                    <span class="text-xs text-gray-400">
                                        {{ option.currency }}
                                    </span>
                                </div>
                            </div>
                        </template>

                        <template #value="{ value }">
                            <div
                                v-if="value"
                                class="flex w-full items-center justify-between"
                            >
                                <span>
                                    {{ getAccount(value)?.name }}
                                </span>

                                <span class="text-xs text-gray-400">
                                    {{ getAccount(value)?.balance }}
                                    {{ getAccount(value)?.currency }}
                                </span>
                            </div>

                            <span v-else class="text-gray-400">
                                Select source account
                            </span>
                        </template>
                    </Select>
                </div>

                <!-- Amount -->
                <div class="flex flex-col gap-1.5">
                    <div class="font-medium">Amount</div>

                    <InputNumber
                        v-model="editForm.amount"
                        suffix=" BDT"
                        size="small"
                    />
                </div>
            </div>

            <template #footer>
                <Button
                    size="small"
                    severity="secondary"
                    variant="outlined"
                    @click="closeEditDialog"
                >
                    Cancel
                </Button>

                <Button
                    size="small"
                    :loading="editForm.processing"
                    @click="updatePayment"
                >
                    Save
                </Button>
            </template>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog
            v-model:visible="showDeleteDialog"
            modal
            header="Delete Installment"
            :style="{ width: '28rem' }"
        >
            <div class="flex flex-col gap-4">
                <div
                    class="flex items-start gap-3 rounded-lg bg-red-50 p-3 text-red-900"
                >
                    <i class="pi pi-exclamation-triangle mt-0.5"></i>

                    <p class="m-0 text-sm leading-6">
                        This will delete the installment and its associated
                        transaction.
                    </p>
                </div>

                <p
                    v-if="selectedPayment"
                    class="m-0 text-sm leading-6 text-gray-600"
                >
                    Are you sure you want to delete the installment of
                    <strong>
                        {{ formatAmount(selectedPayment.amount) }}
                        BDT
                    </strong>
                    paid on
                    <strong>
                        {{ formatDate(selectedPayment.payment_date) }}
                    </strong>
                    ?
                </p>
            </div>

            <template #footer>
                <Button
                    label="Cancel"
                    severity="secondary"
                    variant="outlined"
                    size="small"
                    @click="closeDeleteDialog"
                />

                <Button
                    label="Delete"
                    severity="danger"
                    size="small"
                    :loading="false"
                    @click="deletePayment"
                />
            </template>
        </Dialog>
    </ScrollPanel>
</template>
