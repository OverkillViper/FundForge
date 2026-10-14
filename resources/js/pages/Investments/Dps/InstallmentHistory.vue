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

const showCreateModal = ref(false);
const showDeleteDialog = ref(false);
const creatingPayment = ref(false);
const updatingPayment = ref(false);
const deletingPayment = ref(false);

const selectedPayment = ref<Payment | null>(null);

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

const formatDateForSubmission = (date: Date | null): string | null => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const parseDateOnly = (date: string): Date => {
    const [year, month, day] = date.slice(0, 10).split('-').map(Number);

    return new Date(year, month - 1, day);
};

const getAccount = (id: number | null) => {
    if (!id) return null;

    return props.accounts.find((account) => account.id === id) ?? null;
};

const formatAmount = (amount: string | number) =>
    Number(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formatDate = (date: string) =>
    parseDateOnly(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

const submit = () => {
    if (creatingPayment.value || !form.payment_date || !form.account_id) return;

    creatingPayment.value = true;

    form.transform((data) => ({
        ...data,
        payment_date: formatDateForSubmission(data.payment_date),
    })).post(store.url(props.dps_id), {
        preserveScroll: true,
        onSuccess: () => {
            showCreateModal.value = false;
            form.reset();
            form.amount = Number(props.amount);
        },
        onFinish: () => {
            creatingPayment.value = false;
        },
    });
};

const openEditDialog = (payment: Payment) => {
    selectedPayment.value = payment;
    editForm.payment_date = parseDateOnly(payment.payment_date);
    editForm.account_id = payment.transaction?.account?.id ?? null;
    editForm.amount = Number(payment.amount);
};

const closeEditDialog = () => {
    selectedPayment.value = null;
    editForm.reset();
};

const updatePayment = () => {
    if (updatingPayment.value || !selectedPayment.value) return;

    updatingPayment.value = true;

    editForm.transform((data) => ({
        ...data,
        payment_date: formatDateForSubmission(data.payment_date),
    })).put(update.url({ payment: selectedPayment.value.id }), {
        preserveScroll: true,
        onSuccess: () => {
            selectedPayment.value = null;
            editForm.reset();
        },
        onFinish: () => {
            updatingPayment.value = false;
        },
    });
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
    if (deletingPayment.value || !selectedPayment.value) return;

    const paymentId = selectedPayment.value.id;
    deletingPayment.value = true;

    useForm({}).delete(destroy.url({ payment: paymentId }), {
        preserveScroll: true,
        onSuccess: () => {
            selectedPayment.value = null;
            showDeleteDialog.value = false;
        },
        onFinish: () => {
            deletingPayment.value = false;
        },
    });
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
    <ScrollPanel class="mt-4 h-[320px] w-full lg:h-[570px]">
        <div class="flex items-center justify-between">
            <div class="font-semibold">Installment History</div>

            <Button
                label="Record Installment"
                icon="pi pi-plus"
                size="small"
                :disabled="creatingPayment"
                @click="showCreateModal = true"
            />
        </div>

        <DataTable
            v-if="payments.length"
            :value="payments"
            dataKey="id"
            rowHover
            class="mt-0 overflow-hidden! text-sm! lg:w-1/2"
        >
            <Column header="Payment Date" class="w-[30vw] px-0! ps-2 lg:w-[170px]">
                <template #body="{ data }">
                    <span class="font-medium">{{ formatDate(data.payment_date) }}</span>
                </template>
            </Column>

            <Column header="Source Account" class="w-[50vw] px-0! lg:w-[220px]">
                <template #body="{ data }">
                    <div v-if="data.transaction?.account" class="flex flex-col">
                        <span class="font-medium">{{ data.transaction.account.name }}</span>
                    </div>
                    <span v-else class="text-gray-400">Unknown account</span>
                </template>
            </Column>

            <Column header="Amount" class="w-[15vw] px-0! lg:w-[180px]">
                <template #body="{ data }">
                    <div class="flex items-baseline gap-2">
                        <span class="font-semibold">{{ formatAmount(data.amount) }}</span>
                        <span class="hidden text-xs text-gray-500 lg:block">BDT</span>
                    </div>
                </template>
            </Column>

            <Column header="" class="w-[5vw] px-0! lg:w-[100px]">
                <template #body="{ data }">
                    <div class="installment-actions">
                        <Button
                            icon="pi pi-pencil"
                            severity="secondary"
                            text
                            rounded
                            size="small"
                            aria-label="Edit installment"
                            :disabled="updatingPayment || deletingPayment"
                            @click="openEditDialog(data)"
                        />

                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            text
                            rounded
                            size="small"
                            aria-label="Delete installment"
                            :disabled="updatingPayment || deletingPayment"
                            @click="openDeleteDialog(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <div
            v-if="payments.length === 0"
            class="flex flex-col items-center justify-center py-12 text-gray-500"
        >
            <i class="pi pi-calendar mb-3 text-2xl"></i>
            <span class="text-sm">No installments recorded yet.</span>
        </div>

        <!-- Create Installment Dialog -->
        <Dialog
            v-model:visible="showCreateModal"
            modal
            header="Record Installment"
            class="w-[22rem] lg:w-[24rem]"
            :closable="!creatingPayment"
            :closeOnEscape="!creatingPayment"
        >
            <div class="flex flex-col gap-4">
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
                    <small v-if="form.errors.payment_date" class="text-red-500">
                        {{ form.errors.payment_date }}
                    </small>
                </div>

                <div class="flex flex-col gap-1.5">
                    <div class="font-medium">Source Account</div>

                    <Select
                        v-if="accounts.length"
                        v-model="form.account_id"
                        :options="accounts"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select source account"
                        size="small"
                        showClear
                        :disabled="creatingPayment"
                    >
                        <template #option="{ option }">
                            <div class="flex w-full items-center justify-between gap-4">
                                <div class="flex flex-col">
                                    <span class="text-sm font-medium">{{ option.name }}</span>
                                    <span class="text-xs text-gray-400 capitalize">
                                        {{ option.type }} account
                                    </span>
                                </div>
                                <div class="flex flex-col items-end">
                                    <span class="text-sm font-medium">{{ option.balance }}</span>
                                    <span class="text-xs text-gray-400">{{ option.currency }}</span>
                                </div>
                            </div>
                        </template>

                        <template #value="{ value }">
                            <div v-if="value" class="flex w-full items-center justify-between">
                                <span>{{ getAccount(value)?.name }}</span>
                                <span class="text-xs text-gray-400">
                                    {{ getAccount(value)?.balance }} {{ getAccount(value)?.currency }}
                                </span>
                            </div>
                            <span v-else class="text-gray-400">Select source account</span>
                        </template>
                    </Select>

                    <div v-else class="rounded-md border border-dashed border-gray-400 p-2 text-sm text-gray-500">
                        No account found. Please create an
                        <Link :href="index.url()" class="text-primary underline transition-colors hover:text-primary-400">
                            account
                        </Link>
                        first.
                    </div>

                    <small v-if="form.errors.account_id" class="text-red-500">
                        {{ form.errors.account_id }}
                    </small>
                </div>

                <div class="flex flex-col gap-1.5">
                    <div class="font-medium">Amount</div>
                    <InputNumber
                        v-model="form.amount"
                        suffix=" BDT"
                        size="small"
                        :disabled="creatingPayment"
                    />
                    <small v-if="form.errors.amount" class="text-red-500">
                        {{ form.errors.amount }}
                    </small>

                    <small v-if="form.amount != amount" class="mx-1 flex items-center gap-x-4 text-gray-500">
                        <span class="icon-triangle-alert"></span>
                        <span>
                            <b>Please note:</b>
                            Amount is different than default installment amount of this DPS.
                        </span>
                    </small>
                </div>
            </div>

            <template #footer>
                <Button
                    label="Cancel"
                    size="small"
                    severity="secondary"
                    variant="outlined"
                    :disabled="creatingPayment"
                    @click="showCreateModal = false"
                />
                <Button
                    label="Record"
                    size="small"
                    :loading="creatingPayment"
                    :disabled="creatingPayment || accounts.length < 1"
                    @click="submit"
                />
            </template>
        </Dialog>

        <!-- Edit Installment Dialog -->
        <Dialog
            :visible="selectedPayment !== null && !showDeleteDialog"
            modal
            header="Edit Installment"
            class="w-[22rem] lg:w-[24rem]"
            :closable="!updatingPayment"
            :closeOnEscape="!updatingPayment"
            @update:visible="(value) => { if (!value) closeEditDialog(); }"
        >
            <div class="flex flex-col gap-4">
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
                        :disabled="updatingPayment"
                    />
                    <small v-if="editForm.errors.payment_date" class="text-red-500">
                        {{ editForm.errors.payment_date }}
                    </small>
                </div>

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
                        :disabled="updatingPayment"
                    >
                        <template #option="{ option }">
                            <div class="flex w-full items-center justify-between gap-4">
                                <div class="flex flex-col">
                                    <span class="text-sm font-medium">{{ option.name }}</span>
                                    <span class="text-xs text-gray-400 capitalize">{{ option.type }} account</span>
                                </div>
                                <div class="flex flex-col items-end">
                                    <span class="text-sm font-medium">{{ option.balance }}</span>
                                    <span class="text-xs text-gray-400">{{ option.currency }}</span>
                                </div>
                            </div>
                        </template>

                        <template #value="{ value }">
                            <div v-if="value" class="flex w-full items-center justify-between">
                                <span>{{ getAccount(value)?.name }}</span>
                                <span class="text-xs text-gray-400">
                                    {{ getAccount(value)?.balance }} {{ getAccount(value)?.currency }}
                                </span>
                            </div>
                            <span v-else class="text-gray-400">Select source account</span>
                        </template>
                    </Select>
                    <small v-if="editForm.errors.account_id" class="text-red-500">
                        {{ editForm.errors.account_id }}
                    </small>
                </div>

                <div class="flex flex-col gap-1.5">
                    <div class="font-medium">Amount</div>
                    <InputNumber
                        v-model="editForm.amount"
                        suffix=" BDT"
                        size="small"
                        :disabled="updatingPayment"
                    />
                    <small v-if="editForm.errors.amount" class="text-red-500">
                        {{ editForm.errors.amount }}
                    </small>
                </div>
            </div>

            <template #footer>
                <Button
                    label="Cancel"
                    size="small"
                    severity="secondary"
                    variant="outlined"
                    :disabled="updatingPayment"
                    @click="closeEditDialog"
                />
                <Button
                    label="Save"
                    size="small"
                    :loading="updatingPayment"
                    :disabled="updatingPayment"
                    @click="updatePayment"
                />
            </template>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog
            v-model:visible="showDeleteDialog"
            modal
            header="Delete Installment"
            class="w-[22rem] lg:w-[24rem]"
            :closable="!deletingPayment"
            :closeOnEscape="!deletingPayment"
        >
            <div class="flex flex-col gap-4">
                <div class="flex items-start gap-3 rounded-lg bg-red-50 p-3 text-red-900">
                    <i class="pi pi-exclamation-triangle mt-0.5"></i>
                    <p class="m-0 text-sm leading-6">
                        This will delete the installment and its associated transaction.
                    </p>
                </div>

                <p v-if="selectedPayment" class="m-0 text-sm leading-6 text-gray-600">
                    Are you sure you want to delete the installment of
                    <strong>{{ formatAmount(selectedPayment.amount) }} BDT</strong>
                    paid on
                    <strong>{{ formatDate(selectedPayment.payment_date) }}</strong>?
                </p>
            </div>

            <template #footer>
                <Button
                    label="Cancel"
                    severity="secondary"
                    variant="outlined"
                    size="small"
                    :disabled="deletingPayment"
                    @click="closeDeleteDialog"
                />
                <Button
                    label="Delete"
                    severity="danger"
                    size="small"
                    :loading="deletingPayment"
                    :disabled="deletingPayment"
                    @click="deletePayment"
                />
            </template>
        </Dialog>
    </ScrollPanel>
</template>