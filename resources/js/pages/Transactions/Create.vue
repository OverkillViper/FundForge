<script lang="ts" setup>
import { useForm, Link } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import NoAccountWarning from '../Accounts/NoAccountWarning.vue';
import { index } from '@/routes/transactions/categories';

const toast = useToast();
const showingQuickAdd = ref(false);

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
    { label: 'Expense', value: 'expense', icon: 'pi pi-arrow-up-right' },
    { label: 'Income', value: 'income', icon: 'pi pi-arrow-down-right' },
]);

const errors = ref<Record<string, string>>({});

watch(() => createForm.type, (type) => {
    if (type !== 'expense') {
        createForm.category_id = null;
        delete errors.value.category_id;
        createForm.clearErrors('category_id');
    }
});

const validate = (): boolean => {
    errors.value = {};

    if (!createForm.title.trim()) {
        errors.value.title = 'Transaction title is required.';
    }

    if (!createForm.type) {
        errors.value.type = 'Please select a transaction type.';
    }

    if (!createForm.account_id) {
        errors.value.account_id = 'Please select an account.';
    }

    if (createForm.type === 'expense' && !createForm.category_id) {
        errors.value.category_id = 'Please select a category for this expense.';
    }

    if (createForm.amount === null || createForm.amount <= 0) {
        errors.value.amount = 'Amount must be greater than 0.';
    }

    if (!createForm.transaction_date) {
        errors.value.transaction_date = 'Transaction date is required.';
    }

    return Object.keys(errors.value).length === 0;
};

const useFrequentTransaction = (transaction: FrequentTransaction) => {
    createForm.title = transaction.title;
    createForm.account_id = transaction.account_id;
    createForm.category_id = transaction.category_id;
    createForm.type = transaction.type;
    createForm.amount = Number(transaction.amount);
    createForm.note = transaction.note ?? '';
    createForm.reference = transaction.reference ?? '';
    createForm.transaction_date = new Date();

    errors.value = {};
    createForm.clearErrors();
    showingQuickAdd.value = false;

    toast.add({
        severity: 'info',
        summary: 'Transaction Loaded',
        detail: `"${transaction.title}" has been loaded into the form.`,
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
            errors.value = {};
        },

        onError: (serverErrors) => {
            errors.value = { ...errors.value, ...serverErrors };

            toast.add({
                severity: 'error',
                summary: 'Unable to Create Transaction',
                detail: 'Please check the inputs and try again.',
                life: 3000,
            });
        },
    });
};

const cancel = () => window.history.back();
</script>

<style>
.input-field {
    border-bottom: 1px solid black !important;
    padding: 3px;
    margin-top: 5px;
    font-size: larger;
}

.panel-slide-enter-active,
.panel-slide-leave-active {
    transition: transform 150ms ease, opacity 150ms ease;
}

.panel-slide-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.panel-slide-leave-to {
    transform: translateX(-20%);
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    .panel-slide-enter-active,
    .panel-slide-leave-active {
        transition-duration: 0.01ms;
    }
}
</style>

<template>
    <AppLayout page-title="Create Transactions">
        <template #toolbar>
            <Button
                :label="showingQuickAdd ? 'Create Form' : 'Quick Add'"
                size="small"
                :icon="showingQuickAdd ? 'pi pi-arrow-left' : 'pi pi-clock'"
                class="lg:hidden!"
                :severity="showingQuickAdd ? 'secondary' : 'primary'"
                v-tooltip.bottom="{ value: showingQuickAdd ? 'Create Form' : 'Quick Add', class: 'text-xs' }"
                @click="showingQuickAdd = !showingQuickAdd"
            />
        </template>

        <template #content>
            <NoAccountWarning v-if="!accounts.length" />

            <div v-else>
                <!-- Mobile layout -->
                <div class="overflow-hidden lg:hidden">
                    <Transition name="panel-slide" mode="out-in">
                        <div v-if="!showingQuickAdd" key="mobile-create" class="flex flex-col">
                            <div class="flex flex-col gap-3">
                                <div class="flex flex-col gap-1">
                                    <label for="mobile-title" class="text-sm font-medium text-gray-500">Transaction Title</label>
                                    <input id="mobile-title" v-model="createForm.title" class="input-field focus:outline-0" :class="{ '!border-red-500': errors.title }" placeholder="Bus fare / Salary" />
                                    <small v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</small>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <label class="text-sm font-medium text-gray-500">Transaction Type</label>
                                    <SelectButton v-model="createForm.type" :options="transactionTypes" option-label="label" option-value="value" size="small" fluid>
                                        <template #option="{ option }">
                                            <div class="flex items-center justify-center gap-3">
                                                <i :class="option.icon"></i>
                                                <span>{{ option.label }}</span>
                                            </div>
                                        </template>
                                    </SelectButton>
                                    <small v-if="errors.type" class="text-xs text-red-500">{{ errors.type }}</small>
                                </div>

                                <div class="grid grid-cols-1 gap-3">
                                    <div class="flex flex-col gap-1">
                                        <label class="text-sm font-medium text-gray-500">Source Account</label>
                                        <Select v-model="createForm.account_id" :options="props.accounts" option-label="name" option-value="id" placeholder="Select an account" size="small" :invalid="!!errors.account_id">
                                            <template #option="{ option }">
                                                <div class="flex w-full items-center justify-between gap-3">
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
                                                    <span>{{ accounts.find((account) => account.id === value)?.name }}</span>
                                                    <span class="text-xs text-gray-400">{{ accounts.find((account) => account.id === value)?.balance }} {{ accounts.find((account) => account.id === value)?.currency }}</span>
                                                </div>
                                                <span v-else class="text-gray-400">Select an account</span>
                                            </template>
                                        </Select>
                                        <small v-if="errors.account_id" class="text-xs text-red-500">{{ errors.account_id }}</small>
                                    </div>

                                    <div class="flex flex-col gap-1">
                                        <div class="flex items-center justify-between gap-2">
                                            <label class="text-sm font-medium text-gray-500">Category</label>
                                            <Link :href="index.url()" class="flex items-center gap-x-2 text-xs text-gray-500 hover:text-gray-700">
                                                <span class="icon-circle-plus"></span>
                                                Create new category
                                            </Link>
                                        </div>
                                        <Select v-model="createForm.category_id" :options="props.categories" option-label="name" option-value="id" placeholder="Select a category" size="small" filter filter-placeholder="Search category..." show-clear :disabled="createForm.type !== 'expense'" :invalid="!!errors.category_id">
                                            <template #value="{ value }">
                                                <span v-if="value">{{ categories.find((category) => category.id === value)?.name }}</span>
                                                <span v-else class="text-gray-400">Select a category</span>
                                            </template>
                                        </Select>
                                        <small v-if="errors.category_id" class="text-xs text-red-500">{{ errors.category_id }}</small>
                                    </div>

                                    <div class="flex flex-col gap-1">
                                        <label class="text-sm font-medium text-gray-500">Amount</label>
                                        <InputNumber v-model="createForm.amount" size="small" :invalid="!!errors.amount" placeholder="0.00" mode="decimal" :min="0" :min-fraction-digits="0" :max-fraction-digits="2" :use-grouping="true" locale="en-IN" />
                                        <small v-if="errors.amount" class="text-xs text-red-500">{{ errors.amount }}</small>
                                    </div>

                                    <div class="flex flex-col gap-1">
                                        <label class="text-sm font-medium text-gray-500">Transaction Date</label>
                                        <DatePicker v-model="createForm.transaction_date" placeholder="dd/mm/yyyy" size="small" date-format="dd/mm/yy" v-mask="'99/99/9999'" show-icon show-button-bar :invalid="!!errors.transaction_date" />
                                        <small v-if="errors.transaction_date" class="text-xs text-red-500">{{ errors.transaction_date }}</small>
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <label class="text-sm font-medium text-gray-500">Note</label>
                                    <Textarea v-model="createForm.note" placeholder="Write a description" auto-resize rows="3" class="text-sm!" />
                                </div>

                                <div class="flex flex-col gap-1">
                                    <label class="text-sm font-medium text-gray-500">Reference</label>
                                    <InputText v-model="createForm.reference" placeholder="Transaction Reference" class="text-sm!" size="small" />
                                </div>

                                <div class="flex items-center justify-end gap-3">
                                    <Button label="Cancel" class="w-40" size="small" severity="secondary" icon="pi pi-times" type="button" @click="cancel" />
                                    <Button type="button" label="Create" class="w-40" size="small" icon="pi pi-plus" :loading="createForm.processing" @click="submit" />
                                </div>
                            </div>
                        </div>

                        <div v-else key="mobile-quick-add">
                            <div class="flex items-center gap-x-2 text-xs text-gray-500 uppercase">
                                <span>Quick Add</span>
                                <hr class="flex-1 border" />
                            </div>

                            <div v-if="props.frequentTransactions.length" class="mt-4 flex flex-col gap-2">
                                <button v-for="transaction in props.frequentTransactions" :key="transaction.id" type="button" class="flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors hover:bg-gray-50" @click="useFrequentTransaction(transaction)">
                                    <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                                        <i :class="{
                                            'pi pi-arrow-up-right': transaction.type === 'expense',
                                            'pi pi-arrow-down-right': transaction.type === 'income',
                                            'pi pi-building-columns': transaction.type === 'investment',
                                            'pi pi-arrow-u-turn-up-left': transaction.type === 'lending',
                                            'pi pi-arrow-u-turn-up-right': transaction.type === 'borrowing',
                                        }" class="text-sm" />
                                    </div>
                                    <div class="flex min-w-0 flex-1 flex-col">
                                        <span class="truncate text-sm font-medium">{{ transaction.title }}</span>
                                        <span class="text-xs text-gray-400">{{ transaction.account.name }}<span v-if="transaction.category"> · {{ transaction.category.name }}</span></span>
                                    </div>
                                    <div class="flex flex-col items-end">
                                        <span class="text-sm font-medium">{{ transaction.amount }}</span>
                                        <span class="text-xs text-gray-400">{{ transaction.account.currency }}</span>
                                    </div>
                                </button>
                            </div>
                            <div v-else class="mt-4 text-sm text-gray-400">No recent transactions</div>
                        </div>
                    </Transition>
                </div>

                <!-- Desktop layout: both panels always visible -->
                <div class="hidden lg:flex lg:gap-x-10">
                    <!-- Create form -->
                    <div class="flex min-w-0 flex-1 flex-col">
                        <div class="flex items-center gap-x-2 text-xs text-gray-500 uppercase">
                            <span>New transaction</span>
                            <hr class="flex-1 border" />
                        </div>

                        <form class="flex flex-col gap-3 lg:mt-4 lg:gap-6" @submit.prevent="submit">
                            <div class="flex flex-col gap-1">
                                <label for="desktop-title" class="text-sm font-medium text-gray-500">Transaction Title</label>
                                <input id="desktop-title" v-model="createForm.title" class="input-field focus:outline-0" :class="{ '!border-red-500': errors.title }" placeholder="Bus fare / Salary" />
                                <small v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</small>
                            </div>

                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium text-gray-500">Transaction Type</label>
                                <SelectButton v-model="createForm.type" :options="transactionTypes" option-label="label" option-value="value" size="small" fluid>
                                    <template #option="{ option }"><div class="flex items-center justify-center gap-3"><i :class="option.icon"></i><span>{{ option.label }}</span></div></template>
                                </SelectButton>
                                <small v-if="errors.type" class="text-xs text-red-500">{{ errors.type }}</small>
                            </div>

                            <div class="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-6">
                                <div class="flex flex-col gap-1">
                                    <label class="text-sm font-medium text-gray-500">Source Account</label>
                                    <Select v-model="createForm.account_id" :options="props.accounts" option-label="name" option-value="id" placeholder="Select an account" size="small" :invalid="!!errors.account_id">
                                        <template #option="{ option }"><div class="flex w-full items-center justify-between gap-3"><div class="flex flex-col"><span class="text-sm font-medium">{{ option.name }}</span><span class="text-xs text-gray-400 capitalize">{{ option.type }} account</span></div><div class="flex flex-col items-end"><span class="text-sm font-medium">{{ option.balance }}</span><span class="text-xs text-gray-400">{{ option.currency }}</span></div></div></template>
                                        <template #value="{ value }"><div v-if="value" class="flex w-full items-center justify-between"><span>{{ accounts.find((account) => account.id === value)?.name }}</span><span class="text-xs text-gray-400">{{ accounts.find((account) => account.id === value)?.balance }} {{ accounts.find((account) => account.id === value)?.currency }}</span></div><span v-else class="text-gray-400">Select an account</span></template>
                                    </Select>
                                    <small v-if="errors.account_id" class="text-xs text-red-500">{{ errors.account_id }}</small>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <div class="flex items-center justify-between gap-2"><label class="text-sm font-medium text-gray-500">Category</label><Link :href="index.url()" class="flex items-center gap-x-2 text-xs text-gray-500 hover:text-gray-700"><span class="icon-circle-plus"></span>Create new category</Link></div>
                                    <Select v-model="createForm.category_id" :options="props.categories" option-label="name" option-value="id" placeholder="Select a category" size="small" filter filter-placeholder="Search category..." show-clear :disabled="createForm.type !== 'expense'" :invalid="!!errors.category_id">
                                        <template #value="{ value }"><span v-if="value">{{ categories.find((category) => category.id === value)?.name }}</span><span v-else class="text-gray-400">Select a category</span></template>
                                    </Select>
                                    <small v-if="errors.category_id" class="text-xs text-red-500">{{ errors.category_id }}</small>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <label class="text-sm font-medium text-gray-500">Amount</label>
                                    <InputNumber v-model="createForm.amount" size="small" :invalid="!!errors.amount" placeholder="0.00" mode="decimal" :min="0" :min-fraction-digits="0" :max-fraction-digits="2" :use-grouping="true" locale="en-IN" />
                                    <small v-if="errors.amount" class="text-xs text-red-500">{{ errors.amount }}</small>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <label class="text-sm font-medium text-gray-500">Transaction Date</label>
                                    <DatePicker v-model="createForm.transaction_date" placeholder="dd/mm/yyyy" size="small" date-format="dd/mm/yy" v-mask="'99/99/9999'" show-icon show-button-bar :invalid="!!errors.transaction_date" />
                                    <small v-if="errors.transaction_date" class="text-xs text-red-500">{{ errors.transaction_date }}</small>
                                </div>
                            </div>

                            <div class="flex flex-col gap-1"><label class="text-sm font-medium text-gray-500">Note</label><Textarea v-model="createForm.note" placeholder="Write a description" auto-resize rows="3" class="text-sm!" /></div>
                            <div class="flex flex-col gap-1"><label class="text-sm font-medium text-gray-500">Reference</label><InputText v-model="createForm.reference" placeholder="Transaction Reference" class="text-sm!" size="small" /></div>

                            <div class="flex items-center justify-end gap-3">
                                <Button label="Cancel" class="w-40" size="small" severity="secondary" icon="pi pi-times" type="button" @click="cancel" />
                                <Button type="submit" label="Create" class="w-40" size="small" icon="pi pi-plus" :loading="createForm.processing" />
                            </div>
                        </form>
                    </div>

                    <!-- Quick Add list -->
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-x-2 text-xs text-gray-500 uppercase"><span>Quick Add</span><hr class="flex-1 border" /></div>

                        <div v-if="props.frequentTransactions.length" class="mt-4 flex flex-col gap-2">
                            <button v-for="transaction in props.frequentTransactions" :key="transaction.id" type="button" class="flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors hover:bg-gray-50" @click="useFrequentTransaction(transaction)">
                                <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                                    <i :class="{
                                        'pi pi-arrow-up-right': transaction.type === 'expense',
                                        'pi pi-arrow-down-right': transaction.type === 'income',
                                        'pi pi-building-columns': transaction.type === 'investment',
                                        'pi pi-arrow-u-turn-up-left': transaction.type === 'lending',
                                        'pi pi-arrow-u-turn-up-right': transaction.type === 'borrowing',
                                    }" class="text-sm" />
                                </div>
                                <div class="flex min-w-0 flex-1 flex-col">
                                    <span class="truncate text-sm font-medium">{{ transaction.title }}</span>
                                    <span class="text-xs text-gray-400">{{ transaction.account.name }}<span v-if="transaction.category"> · {{ transaction.category.name }}</span></span>
                                </div>
                                <div class="flex flex-col items-end"><span class="text-sm font-medium">{{ transaction.amount }}</span><span class="text-xs text-gray-400">{{ transaction.account.currency }}</span></div>
                            </button>
                        </div>
                        <div v-else class="mt-4 text-sm text-gray-400">No recent transactions</div>
                    </div>
                </div>
            </div>
        </template>
    </AppLayout>
</template>