<script lang="ts" setup>
import { Head, useForm } from '@inertiajs/vue3';
import Button from 'primevue/button';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { update } from '@/routes/transfers';
import AppLayout from '@/layouts/AppLayout.vue';

interface Account {
    id: number;
    name: string;
    account_number: string;
    type: string;
    balance: string;
    currency: string;
    is_active: boolean;
}

interface Transfer {
    id: number;
    from_account_id: number;
    to_account_id: number;
    amount: string;
    transfer_date: string;
    reference: string | null;
    note: string | null;
}

const props = defineProps<{
    transfer: Transfer;
    accounts: Account[];
}>();

const toast = useToast();

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const createForm = useForm({
    from_account_id: props.transfer.from_account_id as number | null,
    to_account_id: props.transfer.to_account_id as number | null,
    amount: Number(props.transfer.amount) as number | null,
    transfer_date: props.transfer.transfer_date
        ? new Date(props.transfer.transfer_date)
        : null,
    reference: props.transfer.reference ?? '',
    note: props.transfer.note ?? '',
});

const errors = ref<Record<string, string>>({});

/*
|--------------------------------------------------------------------------
| Account Options
|--------------------------------------------------------------------------
*/

const fromAccountOptions = computed(() => {
    return props.accounts.filter(
        (account) => account.id !== createForm.to_account_id,
    );
});

const toAccountOptions = computed(() => {
    return props.accounts.filter(
        (account) => account.id !== createForm.from_account_id,
    );
});

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const getAccount = (id: number | null) => {
    if (!id) {
        return null;
    }

    return props.accounts.find((account) => account.id === id) ?? null;
};

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

const validate = (): boolean => {
    errors.value = {};

    /*
    |--------------------------------------------------------------------------
    | Source Account
    |--------------------------------------------------------------------------
    */

    if (!createForm.from_account_id) {
        errors.value.from_account_id = 'Please select the source account.';
    }

    /*
    |--------------------------------------------------------------------------
    | Destination Account
    |--------------------------------------------------------------------------
    */

    if (!createForm.to_account_id) {
        errors.value.to_account_id = 'Please select the destination account.';
    }

    /*
    |--------------------------------------------------------------------------
    | Same Account
    |--------------------------------------------------------------------------
    */

    if (
        createForm.from_account_id &&
        createForm.to_account_id &&
        createForm.from_account_id === createForm.to_account_id
    ) {
        errors.value.to_account_id =
            'Source and destination accounts must be different.';
    }

    /*
    |--------------------------------------------------------------------------
    | Amount
    |--------------------------------------------------------------------------
    */

    if (
        createForm.amount === null ||
        createForm.amount === undefined ||
        createForm.amount <= 0
    ) {
        errors.value.amount = 'Transfer amount must be greater than 0.';
    }

    /*
    |--------------------------------------------------------------------------
    | Available Balance
    |--------------------------------------------------------------------------
    |
    | The existing transfer has already reduced the original
    | source account balance.
    |
    | If we're still using the same source account, we add the
    | original transfer amount back before checking the new amount.
    |
    */

    if (createForm.from_account_id && createForm.amount) {
        const sourceAccount = getAccount(createForm.from_account_id);

        if (sourceAccount) {
            let availableBalance = Number(sourceAccount.balance);

            // Restore the old transfer amount if using the same source account.
            if (createForm.from_account_id === props.transfer.from_account_id) {
                availableBalance += Number(props.transfer.amount);
            }

            if (Number(createForm.amount) > availableBalance) {
                errors.value.amount = `Insufficient balance. Available balance is ${availableBalance.toFixed(2)} ${sourceAccount.currency}.`;
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    */

    if (createForm.from_account_id && createForm.to_account_id) {
        const sourceAccount = getAccount(createForm.from_account_id);
        const destinationAccount = getAccount(createForm.to_account_id);

        if (
            sourceAccount &&
            destinationAccount &&
            sourceAccount.currency !== destinationAccount.currency
        ) {
            errors.value.to_account_id =
                'Source and destination accounts must use the same currency.';
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Date
    |--------------------------------------------------------------------------
    */

    if (!createForm.transfer_date) {
        errors.value.transfer_date = 'Transfer date is required.';
    }

    return Object.keys(errors.value).length === 0;
};

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
            detail: 'Please fix the highlighted fields.',
            life: 3000,
        });

        return;
    }

    createForm.put(update.url(props.transfer.id), {
        preserveScroll: true,

        onSuccess: () => {
            toast.add({
                severity: 'success',
                summary: 'Transfer Updated',
                detail: 'Transfer has been updated successfully.',
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
                summary: 'Unable to Update Transfer',
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

<template>
<AppLayout pageTitle="Edit Transfer">
    <template #content>
        <form
            class="mx-auto mt-8 flex w-1/2 flex-col gap-6"
            @submit.prevent="submit"
        >
            <!-- Accounts -->
            <div class="grid grid-cols-2 gap-6">
                <!-- Source Account -->
                <div class="flex flex-col">
                    <label class="font-medium text-gray-500">
                        Source Account
                    </label>

                    <Select
                        v-model="createForm.from_account_id"
                        :options="fromAccountOptions"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select source account"
                        size="small"
                        class="mt-2"
                        :class="{
                            'p-invalid': errors.from_account_id,
                        }"
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

                    <small
                        v-if="errors.from_account_id"
                        class="mt-1 text-xs text-red-500"
                    >
                        {{ errors.from_account_id }}
                    </small>
                </div>

                <!-- Destination Account -->
                <div class="flex flex-col">
                    <label class="font-medium text-gray-500">
                        Destination Account
                    </label>

                    <Select
                        v-model="createForm.to_account_id"
                        :options="toAccountOptions"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select destination account"
                        size="small"
                        class="mt-2"
                        :class="{
                            'p-invalid': errors.to_account_id,
                        }"
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
                                Select destination account
                            </span>
                        </template>
                    </Select>

                    <small
                        v-if="errors.to_account_id"
                        class="mt-1 text-xs text-red-500"
                    >
                        {{ errors.to_account_id }}
                    </small>
                </div>
            </div>

            <!-- Amount + Date -->
            <div class="grid grid-cols-2 gap-6">
                <!-- Amount -->
                <div class="flex flex-col">
                    <label class="font-medium text-gray-500"> Amount </label>

                    <InputNumber
                        v-model="createForm.amount"
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

                    <small
                        v-if="errors.amount"
                        class="mt-1 text-xs text-red-500"
                    >
                        {{ errors.amount }}
                    </small>
                </div>

                <!-- Date -->
                <div class="flex flex-col">
                    <label class="font-medium text-gray-500">
                        Transfer Date
                    </label>

                    <DatePicker
                        v-model="createForm.transfer_date"
                        placeholder="dd/mm/yyyy"
                        size="small"
                        class="mt-2"
                        dateFormat="dd/mm/yy"
                        showIcon
                        :class="{
                            'p-invalid': errors.transfer_date,
                        }"
                        showButtonBar
                    />

                    <small
                        v-if="errors.transfer_date"
                        class="mt-1 text-xs text-red-500"
                    >
                        {{ errors.transfer_date }}
                    </small>
                </div>
            </div>

            <!-- Note -->
            <div class="flex flex-col">
                <label class="font-medium text-gray-500"> Note </label>

                <Textarea
                    v-model="createForm.note"
                    placeholder="Write a description"
                    autoResize
                    rows="3"
                    class="mt-2 text-sm!"
                />
            </div>

            <!-- Reference -->
            <div class="flex flex-col">
                <label class="font-medium text-gray-500"> Reference </label>

                <InputText
                    v-model="createForm.reference"
                    placeholder="Transfer reference"
                    size="small"
                    class="mt-2 text-sm!"
                />
            </div>

            <!-- Summary -->
            <div
                v-if="
                    createForm.from_account_id &&
                    createForm.to_account_id &&
                    createForm.amount &&
                    createForm.from_account_id !== createForm.to_account_id
                "
                class="rounded-md border p-4 text-sm"
            >
                <div class="flex items-center justify-between">
                    <span class="text-gray-500"> Transfer </span>

                    <span class="font-semibold">
                        {{ createForm.amount }}
                        {{ getAccount(createForm.from_account_id)?.currency }}
                    </span>
                </div>

                <div class="mt-2 flex items-center justify-between">
                    <span class="text-gray-500"> From </span>

                    <span>
                        {{ getAccount(createForm.from_account_id)?.name }}
                    </span>
                </div>

                <div class="mt-1 flex items-center justify-between">
                    <span class="text-gray-500"> To </span>

                    <span>
                        {{ getAccount(createForm.to_account_id)?.name }}
                    </span>
                </div>

                <div
                    v-if="getAccount(createForm.from_account_id)"
                    class="mt-1 flex items-center justify-between"
                >
                    <span class="text-gray-500"> Remaining balance </span>

                    <span class="font-medium">
                        {{
                            (
                                Number(
                                    getAccount(createForm.from_account_id)
                                        ?.balance,
                                ) -
                                Number(createForm.amount) +
                                (createForm.from_account_id ===
                                props.transfer.from_account_id
                                    ? Number(props.transfer.amount)
                                    : 0)
                            ).toFixed(2)
                        }}
                        {{ getAccount(createForm.from_account_id)?.currency }}
                    </span>
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex items-center justify-end gap-x-4">
                <Button
                    type="button"
                    label="Cancel"
                    class="w-40"
                    size="small"
                    severity="secondary"
                    icon="pi pi-times"
                    @click="cancel"
                />

                <Button
                    type="submit"
                    label="Update Transfer"
                    class="w-40"
                    size="small"
                    icon="pi pi-check"
                    :loading="createForm.processing"
                />
            </div>
        </form>
    </template>
</AppLayout>
</template>
