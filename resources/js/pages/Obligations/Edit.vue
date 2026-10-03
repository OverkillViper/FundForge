<script lang="ts" setup>
import Button from 'primevue/button';
import { update, index } from '@/routes/obligations';
import SelectButton from 'primevue/selectbutton';
import { ref } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import ScrollPanel from 'primevue/scrollpanel';
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

interface Transaction {
    id: number;
    account_id: number;
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
    obligation: Obligation;
    accounts: Account[];
}>();

const obligationTypes = ref([
    {
        label: 'Lending',
        value: 'lending',
    },
    {
        label: 'Borrowing',
        value: 'borrowing',
    },
]);

const parseDate = (date: string | null): Date | null => {
    if (!date) {
        return null;
    }

    const [year, month, day] = date.substring(0, 10).split('-').map(Number);

    return new Date(year, month - 1, day);
};

const form = useForm({
    account_id: props.obligation.transaction?.account_id ?? null,

    type: props.obligation.type,

    person: props.obligation.person,

    amount: Number(props.obligation.amount),

    date: parseDate(props.obligation.date),

    due_date: parseDate(props.obligation.due_date),

    note: props.obligation.note ?? '',
});

const getAccount = (id: number | null) => {
    if (!id) {
        return null;
    }

    return props.accounts.find((account) => account.id === id) ?? null;
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

const submit = () => {
    if (!form.date) {
        return;
    }

    form.transform(() => ({
        account_id: form.account_id,
        type: form.type,
        person: form.person,
        amount: form.amount,
        date: formatDate(form.date),
        due_date: formatDate(form.due_date),
        note: form.note,
    })).put(update.url(props.obligation.id), {
        preserveScroll: true,
    });
};

const cancel = () => {
    router.visit(index.url());
};
</script>

<template>
<AppLayout page-title="Edit Obligation">
    <template #content>
        <form
            @submit.prevent="submit"
            class="mx-auto mt-4 flex w-1/2 flex-col gap-y-2 text-sm"
        >
            <!-- Obligation Type -->
            <div class="flex items-center justify-between">
                <div class="font-medium">Obligation Type</div>

                <SelectButton
                    v-model="form.type"
                    :options="obligationTypes"
                    optionLabel="label"
                    optionValue="value"
                    aria-labelledby="basic"
                />
            </div>

            <div class="mt-2 grid grid-cols-2 gap-2">
                <!-- Person Name -->
                <div class="font-medium">Person Name</div>

                <!-- Amount -->
                <div class="font-medium">
                    {{ form.type === 'lending' ? 'Lent' : 'Borrowed' }}
                    Amount
                </div>

                <InputText
                    v-model="form.person"
                    size="small"
                    :placeholder="
                        'Enter person name you are ' +
                        (form.type === 'lending'
                            ? 'lending to'
                            : 'borrowing from')
                    "
                    fluid
                />

                <InputNumber
                    v-model="form.amount"
                    locale="en-IN"
                    suffix=" BDT"
                    placeholder="Enter amount"
                />

                <!-- Date -->
                <div class="mt-2 font-medium">Date</div>

                <!-- Due Date -->
                <div class="mt-2 font-medium">Due Date (Optional)</div>

                <DatePicker
                    v-model="form.date"
                    date-format="dd-M-yy"
                    placeholder="Enter obligation date"
                    size="small"
                    show-button-bar
                />

                <DatePicker
                    v-model="form.due_date"
                    date-format="dd-M-yy"
                    placeholder="Enter obligation due date"
                    size="small"
                    show-button-bar
                />

                <!-- Account -->
                <div class="col-span-2 mt-2 font-medium">
                    {{ form.type === 'lending' ? 'Source' : 'Destination' }}
                    Account
                </div>

                <Select
                    v-model="form.account_id"
                    :options="accounts"
                    optionLabel="name"
                    optionValue="id"
                    class="col-span-2"
                    placeholder="Select account"
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
                                    {{ option.type }}
                                    account
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
                            Select account
                        </span>
                    </template>
                </Select>

                <!-- Note -->
                <div class="col-span-2 mt-2 font-medium">Note</div>

                <Textarea
                    v-model="form.note"
                    placeholder="Enter note"
                    auto-resize
                    rows="5"
                    class="col-span-2"
                />
            </div>

            <!-- Actions -->
            <div class="mt-4 flex justify-end gap-x-4">
                <Button
                    size="small"
                    severity="secondary"
                    label="Cancel"
                    icon="pi pi-times"
                    type="button"
                    @click="cancel"
                />

                <Button
                    size="small"
                    label="Save changes"
                    icon="pi pi-check"
                    type="submit"
                    :loading="form.processing"
                />
            </div>
        </form>
    </template>
</AppLayout>
</template>
