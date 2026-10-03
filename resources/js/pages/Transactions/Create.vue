<script lang="ts" setup>
import { useForm } from '@inertiajs/vue3';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import { ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import NoAccountWarning from '../Accounts/NoAccountWarning.vue';

const toast = useToast();

const createForm = useForm({
    title: '',
    account_id: null as number | null,
    category_id: null as number | null,
    type: 'expense',
    amount: null as number | null,
    transaction_date: null as Date | null,
    note: '',
    reference: '',
});

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

interface FrequentTransaction {
    id: number;
    account_id: number;
    category_id: number | null;
    title: string;
    type: string;
    amount: string;
    note: string | null;
    reference: string | null;

    account: {
        id: number;
        name: string;
        currency: string;
    };

    category: {
        id: number;
        name: string;
    } | null;
}

const props = defineProps<{
    accounts: Account[];
    categories: Category[];
    frequentTransactions: FrequentTransaction[];
}>();

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
| Client-side validation
|--------------------------------------------------------------------------
*/

const errors = ref<Record<string, string>>({});

const validate = (): boolean => {
    errors.value = {};

    // Title
    if (!createForm.title.trim()) {
        errors.value.title = 'Transaction title is required.';
    }

    // Type
    if (!createForm.type) {
        errors.value.type = 'Please select a transaction type.';
    }

    // Account
    if (!createForm.account_id) {
        errors.value.account_id = 'Please select an account.';
    }

    // Category
    if (createForm.type === 'expense' && !createForm.category_id) {
        createForm.setError(
            'category_id',
            'Please select a category for this expense.',
        );
    }

    // Amount
    if (
        createForm.amount === null ||
        createForm.amount === undefined ||
        createForm.amount <= 0
    ) {
        errors.value.amount = 'Amount must be greater than 0.';
    }

    // Date
    if (!createForm.transaction_date) {
        errors.value.transaction_date = 'Transaction date is required.';
    }

    return Object.keys(errors.value).length === 0;
};

/*
|--------------------------------------------------------------------------
| Submit
|--------------------------------------------------------------------------
*/

const useFrequentTransaction = (transaction: FrequentTransaction) => {
    createForm.title = transaction.title;
    createForm.account_id = transaction.account_id;
    createForm.category_id = transaction.category_id;
    createForm.type = transaction.type;
    createForm.amount = Number(transaction.amount);
    createForm.note = transaction.note ?? '';
    createForm.reference = transaction.reference ?? '';

    // Always use today's date for a new transaction
    createForm.transaction_date = new Date();

    // Clear previous validation errors
    errors.value = {};

    toast.add({
        severity: 'info',
        summary: 'Transaction Loaded',
        detail: `"${transaction.title}" has been added to the form.`,
        life: 2000,
    });
};

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

    createForm.post('/transactions', {
        preserveScroll: true,

        onSuccess: () => {
            toast.add({
                severity: 'success',
                summary: 'Transaction Created',
                detail: 'Transaction has been recorded successfully.',
                life: 3000,
            });

            createForm.reset();
            createForm.type = 'expense';
        },

        onError: (serverErrors) => {
            /*
             * Laravel validation errors.
             *
             * These are merged into the local error display so
             * backend validation is also shown to the user.
             */
            errors.value = {
                ...errors.value,
                ...serverErrors,
            };

            toast.add({
                severity: 'error',
                summary: 'Unable to Create Transaction',
                detail: 'Please check the inputs and try again.',
                life: 3000,
            });
        },
    });
};

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
<AppLayout page-title="Create Transactions">
    <template #content>
        <NoAccountWarning v-if="!accounts.length" />

        <div class="flex gap-x-10 pt-6" v-else>
            <div class="flex w-1/2 flex-col">
                <div class="flex items-center gap-x-2 text-xs text-gray-500 uppercase">
                    <span>New transaction</span>
                    <hr class="flex-1 border" />
                </div>
                <form class="mt-4 flex flex-col" @submit.prevent="submit">
                    <label for="name" class="font-medium text-gray-500">Transaction Title</label>
                    <input
                        v-model="createForm.title"
                        class="input-field focus:outline-0"
                        :class="{ '!border-red-500': errors.title }"
                        placeholder="Bus fare / Salary"
                        autofocus
                    />
                    <small v-if="errors.title" class="mt-1 text-xs text-red-500">{{ errors.title }}</small>
                    
                    <label for="name" class="mt-6 font-medium text-gray-500">Transaction Type</label>
                    <SelectButton
                        v-model="createForm.type"
                        :options="transactionTypes"
                        optionLabel="label"
                        optionValue="value"
                        aria-labelledby="basic"
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
                    <small v-if="errors.type" class="mt-1 text-xs text-red-500">
                        {{ errors.type }}
                    </small>

                    <div class="mt-6 grid grid-cols-2 gap-6">
                        <div class="flex flex-col">
                            <label for="name" class="font-medium text-gray-500">Source Account</label>
                            <Select
                                v-model="createForm.account_id"
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
                                            <span class="text-sm font-medium">
                                                {{ option.name }}
                                            </span>
                                            <span class="text-xs text-gray-400 capitalize">
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
                                    <div v-if="value" class="flex w-full items-center justify-between">
                                        <span>{{ accounts.find((account) => account.id === value,)?.name }}
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
                        
                        <div class="flex flex-col">
                            <label for="name" class="font-medium text-gray-500">Category</label>
                            <Select
                                v-model="createForm.category_id"
                                :options="props.categories"
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Select a category"
                                class="mt-2 !text-sm"
                                size="small"
                                filter
                                filterPlaceholder="Search category..."
                                showClear
                                :disabled="createForm.type !== 'expense'"
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
                                        <div class="flex flex-col">
                                            <span class="text-sm font-medium">{{ option.name }}</span>
                                        </div>
                                    </div>
                                </template>
                                
                                <template #value="{ value }">
                                    <div v-if="value" class="flex w-full items-center">
                                        <span> {{ props.categories.find((category) => category.id === value,)?.name }} </span>
                                    </div>
                                    <span v-else class="text-gray-400">Select a category</span>
                                </template>
                            </Select>
                            <small v-if="errors.category_id" class="mt-1 text-xs text-red-500">{{ errors.category_id }}</small>
                        </div>

                        
                        <div class="flex flex-col">
                            <label for="name" class="font-medium text-gray-500">Amount</label>
                            <InputNumber
                                v-model="createForm.amount"
                                size="small"
                                class="mt-2"
                                :class="{ 'p-invalid': errors.amount }"
                                placeholder="0.00"
                                mode="decimal"
                                :min="0"
                                :minFractionDigits="0"
                                :maxFractionDigits="2"
                                :useGrouping="true"
                                locale="en-IN"
                            />
                            <small v-if="errors.amount" class="mt-1 text-xs text-red-500">{{ errors.amount }}</small>
                        </div>

                        
                        <div class="flex flex-col">
                            <label for="name" class="font-medium text-gray-500">Transaction Date</label>
                            <DatePicker
                                showButtonBar
                                placeholder="dd/mm/yyyy"
                                v-model="createForm.transaction_date"
                                size="small"
                                class="mt-2"
                                dateFormat="dd/mm/yy"
                                v-mask="'99/99/9999'"
                                showIcon
                            />
                            <small v-if="errors.transaction_date" class="mt-1 text-xs text-red-500">
                                {{ errors.transaction_date }}
                            </small>
                        </div>
                    </div>

                    
                    <div class="mt-6 flex flex-col">
                        <label for="name" class="font-medium text-gray-500">Note</label>
                        <Textarea
                            v-model="createForm.note"
                            placeholder="Write a description"
                            autoResize
                            rows="3"
                            class="mt-2 text-sm!"
                        />
                    </div>

                    
                    <div class="mt-6 flex flex-col">
                        <label for="name" class="font-medium text-gray-500">Reference</label>
                        <InputText
                            v-model="createForm.reference"
                            placeholder="Transaction Reference"
                            class="mt-2 text-sm!"
                            size="small"
                        />
                    </div>

                    <div class="flex items-center justify-end gap-x-4">
                        <Button
                            label="Cancel"
                            class="mt-6 w-40"
                            size="small"
                            severity="secondary"
                            icon="pi pi-times"
                            @click="cancel"
                        />
                        <Button
                            type="submit"
                            label="Create"
                            class="mt-6 w-40"
                            size="small"
                            icon="pi pi-plus"
                            :loading="createForm.processing"
                        />
                    </div>
                </form>
            </div>
            <div class="w-1/2">
                <div class="flex items-center gap-x-2 text-xs text-gray-500 uppercase">
                    <span>Quick Add</span>
                    <hr class="flex-1 border" />
                </div>
                <div v-if="props.frequentTransactions.length" class="mt-4 flex flex-col gap-2">
                    <button
                        v-for="transaction in props.frequentTransactions"
                        :key="transaction.id"
                        type="button"
                        class="flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors hover:bg-gray-50"
                        @click="useFrequentTransaction(transaction)"
                    >
                        <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                            <i :class="{
                                    'pi pi-arrow-up-right':
                                        transaction.type === 'expense',
                                    'pi pi-arrow-down-right':
                                        transaction.type === 'income',
                                    'pi pi-building-columns':
                                        transaction.type === 'investment',
                                    'pi pi-arrow-u-turn-up-left':
                                        transaction.type === 'lending',
                                    'pi pi-arrow-u-turn-up-right':
                                        transaction.type === 'borrowing',
                                }"
                                class="text-sm"
                            />
                        </div>

                        <div class="flex min-w-0 flex-1 flex-col">
                            <span class="truncate text-sm font-medium">{{ transaction.title }}</span>

                            <span class="text-xs text-gray-400">{{ transaction.account.name }}
                                <span v-if="transaction.category">
                                    · {{ transaction.category.name }}
                                </span>
                            </span>
                        </div>

                        <div class="flex flex-col items-end">
                            <span class="text-sm font-medium">{{ transaction.amount }}</span>
                            <span class="text-xs text-gray-400">{{ transaction.account.currency }}</span>
                        </div>
                    </button>
                </div>

                <div v-else class="mt-4 text-sm text-gray-400">
                    No recent transactions
                </div>
            </div>
        </div>
    </template>
</AppLayout>
</template>
