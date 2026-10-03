<script lang="ts" setup>
import { useForm } from '@inertiajs/vue3';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import { ref, watch } from 'vue';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { update } from '@/routes/transactions';
import AppLayout from '@/layouts/AppLayout.vue';

const toast = useToast();

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
    transactions_count: number;
    total_expense: string | null;
}

interface Transaction {
    id: number;
    title: string;
    account_id: number;
    category_id: number | null;
    type: 'expense' | 'income' | 'investment' | 'lending' | 'borrowing';
    amount: string | number;
    transaction_date: string;
    note: string | null;
    reference: string | null;
}

const props = defineProps<{
    transaction: Transaction;
    accounts: Account[];
    categories: Category[];
}>();

/*
|--------------------------------------------------------------------------
| Transaction types
|--------------------------------------------------------------------------
*/

const transactionTypes = ref([
    {
        label: 'Expense',
        value: 'expense',
        icon: 'pi pi-arrow-up-right',
    },
    {
        label: 'Income',
        value: 'income',
        icon: 'pi pi-arrow-down-right',
    },
]);

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const editForm = useForm({
    title: props.transaction.title,

    account_id: props.transaction.account_id,

    category_id: props.transaction.category_id,

    type: props.transaction.type,

    amount: Number(props.transaction.amount),

    transaction_date: props.transaction.transaction_date
        ? new Date(props.transaction.transaction_date)
        : null,

    note: props.transaction.note ?? '',

    reference: props.transaction.reference ?? '',
});

/*
|--------------------------------------------------------------------------
| Client-side errors
|--------------------------------------------------------------------------
*/

const errors = ref<Record<string, string>>({});

const validate = (): boolean => {
    errors.value = {};

    // Title
    if (!editForm.title.trim()) {
        errors.value.title = 'Transaction title is required.';
    }

    // Type
    if (!editForm.type) {
        errors.value.type = 'Please select a transaction type.';
    }

    // Account
    if (!editForm.account_id) {
        errors.value.account_id = 'Please select an account.';
    }

    // Category
    if (editForm.type === 'expense' && !editForm.category_id) {
        errors.value.category_id = 'Please select a category for this expense.';
    }

    // Amount
    if (
        editForm.amount === null ||
        editForm.amount === undefined ||
        editForm.amount <= 0
    ) {
        errors.value.amount = 'Amount must be greater than 0.';
    }

    // Date
    if (!editForm.transaction_date) {
        errors.value.transaction_date = 'Transaction date is required.';
    }

    return Object.keys(errors.value).length === 0;
};

/*
|--------------------------------------------------------------------------
| Clear category when transaction is not an expense
|--------------------------------------------------------------------------
*/

watch(
    () => editForm.type,
    (type) => {
        if (type !== 'expense') {
            editForm.category_id = null;
            delete errors.value.category_id;
        }
    },
);

/*
|--------------------------------------------------------------------------
| Submit
|--------------------------------------------------------------------------
*/

const submit = () => {
    if (!validate()) {
        toast.add({
            severity: 'warn',
            summary: 'Incomplete Form',
            detail: 'Please fill in all required fields.',
            life: 3000,
        });

        return;
    }

    editForm.put(update.url(props.transaction.id), {
        preserveScroll: true,

        onSuccess: () => {
            toast.add({
                severity: 'success',
                summary: 'Transaction Updated',
                detail: 'Transaction has been updated successfully.',
                life: 3000,
            });
        },

        onError: (serverErrors) => {
            errors.value = {
                ...errors.value,
                ...serverErrors,
            };

            toast.add({
                severity: 'error',
                summary: 'Unable to Update Transaction',
                detail: 'Please check the inputs and try again.',
                life: 3000,
            });
        },
    });
};

/*
|--------------------------------------------------------------------------
| Cancel
|--------------------------------------------------------------------------
*/

const cancel = () => {
    window.history.back();
};
</script>

<style>
.input-field {
    border-bottom: 1px solid black !important;
    padding: 3px 3px;
    margin-top: 5px;
    font-size: larger;
}
</style>

<template>
<AppLayout page-title="Edit Transaction">
    <template #content>
        <div class="flex gap-x-10 pt-6">
            <!-- Form -->
            <div class="flex w-1/2 flex-col mx-auto">
                <div class="flex items-center gap-x-2 text-xs text-gray-500 uppercase">
                    <span>Edit transaction</span>
                    <hr class="flex-1 border" />
                </div>

                <form class="mt-4 flex flex-col" @submit.prevent="submit">
                    <!-- Transaction Title -->
                    <label for="title" class="font-medium text-gray-500">Transaction Title</label>

                    <input
                        id="title"
                        v-model="editForm.title"
                        class="input-field focus:outline-0"
                        :class="{'!border-red-500': errors.title,}"
                        placeholder="Bus fare / Salary"
                        autofocus
                    />

                    <small v-if="errors.title" class="mt-1 text-xs text-red-500">
                        {{ errors.title }}
                    </small>

                    <!-- Type -->
                    <label class="mt-6 font-medium text-gray-500">Transaction Type</label>

                    <SelectButton
                        v-model="editForm.type"
                        :options="transactionTypes"
                        optionLabel="label"
                        optionValue="value"
                        aria-labelledby="transaction-type"
                        size="small"
                        class="mt-2"
                        fluid
                    >
                        <template #option="{ option }">
                            <div class="flex items-center justify-center gap-2">
                                <i :class="option.icon"></i>

                                <span>{{ option.label }}</span>
                            </div>
                        </template>
                    </SelectButton>

                    <small v-if="errors.type" class="mt-1 text-xs text-red-500">{{ errors.type }}</small>

                    <!-- Account + Category -->
                    <div class="mt-6 grid grid-cols-2 gap-6">
                        <!-- Account -->
                        <div class="flex flex-col">
                            <label class="font-medium text-gray-500">Source Account</label>

                            <Select
                                v-model="editForm.account_id"
                                :options="props.accounts"
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Select an account"
                                class="mt-2"
                                size="small"
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

                                <!-- Selected Account -->
                                <template #value="{ value }">
                                    <div v-if="value" class="flex w-full items-center justify-between">
                                        <span>
                                            {{ accounts.find((account) => account.id === value,)?.name }}
                                        </span>
                                        <span class="text-xs text-gray-400">
                                            {{ accounts.find((account) => account.id === value,)?.balance }}
                                            {{ accounts.find((account) => account.id === value,)?.currency }}
                                        </span>
                                    </div>

                                    <span v-else class="text-gray-400">
                                        Select an account
                                    </span>
                                </template>
                            </Select>

                            <small v-if="errors.account_id" class="mt-1 text-xs text-red-500">
                                {{ errors.account_id }}
                            </small>
                        </div>

                        <!-- Category -->
                        <div class="flex flex-col">
                            <label class="font-medium text-gray-500">Category</label>

                            <Select
                                v-model="editForm.category_id"
                                :options="props.categories"
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Select a category"
                                class="mt-2 !text-sm"
                                size="small"
                                filter
                                filterPlaceholder="Search category..."
                                showClear
                                :pt="{
                                    pcFilter: {
                                        root: {
                                            class: '!text-sm !h-8 !py-1 !px-2',
                                        },
                                    },
                                }"
                            >
                                <template #option="{ option }">
                                    <div class="flex w-full items-center justify-between gap-4">
                                        <span class="text-sm font-medium">{{ option.name }}</span>
                                    </div>
                                </template>

                                <!-- Selected Category -->
                                <template #value="{ value }">
                                    <div v-if="value" class="flex w-full items-center">
                                        <span>
                                            {{ props.categories.find((category) => category.id === value,)?.name }}
                                        </span>
                                    </div>

                                    <span v-else class="text-gray-400">
                                        Select a category
                                    </span>
                                </template>
                            </Select>

                            <small v-if="errors.category_id" class="mt-1 text-xs text-red-500">
                                {{ errors.category_id }}
                            </small>
                        </div>

                        <!-- Amount -->
                        <div class="flex flex-col">
                            <label class="font-medium text-gray-500">Amount</label>

                            <InputNumber
                                v-model="editForm.amount"
                                size="small"
                                class="mt-2"
                                :class="{
                                    'p-invalid': errors.amount,
                                }"
                                placeholder="0.00"
                                mode="decimal"
                                :min="0"
                                :minFractionDigits="0"
                                :maxFractionDigits="2"
                                :useGrouping="true"
                                locale="en-IN"
                            />

                            <small v-if="errors.amount" class="mt-1 text-xs text-red-500">
                                {{ errors.amount }}
                            </small>
                        </div>

                        <!-- Date -->
                        <div class="flex flex-col">
                            <label class="font-medium text-gray-500">Transaction Date</label>

                            <DatePicker
                                v-model="editForm.transaction_date"
                                placeholder="dd/mm/yyyy"
                                size="small"
                                class="mt-2"
                                dateFormat="dd/mm/yy"
                                v-mask="'99/99/9999'"
                                showIcon
                                showButtonBar
                            />

                            <small v-if="errors.transaction_date" class="mt-1 text-xs text-red-500">
                                {{ errors.transaction_date }}
                            </small>
                        </div>
                    </div>

                    <!-- Note -->
                    <div class="mt-6 flex flex-col">
                        <label class="font-medium text-gray-500"> Note </label>

                        <Textarea
                            v-model="editForm.note"
                            placeholder="Write a description"
                            autoResize
                            rows="3"
                            class="mt-2 text-sm!"
                        />
                    </div>

                    <!-- Reference -->
                    <div class="mt-6 flex flex-col">
                        <label class="font-medium text-gray-500">Reference</label>

                        <InputText
                            v-model="editForm.reference"
                            placeholder="Transaction Reference"
                            class="mt-2 text-sm!"
                            size="small"
                        />
                    </div>

                    <!-- Buttons -->
                    <div class="flex items-center justify-end gap-x-4">
                        <Button
                            label="Cancel"
                            class="mt-6 w-40"
                            size="small"
                            severity="secondary"
                            icon="pi pi-times"
                            type="button"
                            @click="cancel"
                        />

                        <Button
                            type="submit"
                            label="Save Changes"
                            class="mt-6 w-40"
                            size="small"
                            icon="pi pi-check"
                            :loading="editForm.processing"
                        />
                    </div>
                </form>
            </div>
        </div>
    </template>
</AppLayout>
</template>
