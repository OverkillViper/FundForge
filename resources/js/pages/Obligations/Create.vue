<script lang="ts" setup>
import Button from 'primevue/button';
import { store, index } from '@/routes/obligations';
import SelectButton from 'primevue/selectbutton';
import { ref } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import NoAccountWarning from '../Accounts/NoAccountWarning.vue';
import Textarea from 'primevue/textarea';
import ScrollPanel from 'primevue/scrollpanel';
import AppLayout from '@/layouts/AppLayout.vue';

const form = useForm({
    account_id: null,
    type: 'lending',
    person: '',
    amount: null,
    date: null,
    due_date: null,
    note: '',
});

const obligationTypes = ref([
    { label: 'Lending', value: 'lending' },
    { label: 'Borrowing', value: 'borrowing' },
]);

interface Account {
    id: number;
    name: string;
    account_number: string;
    type: string;
    balance: string;
    currency: string;
    is_active: boolean;
}

const props = defineProps<{
    accounts: Account[];
}>();

const getAccount = (id: number | null) => {
    if (!id) {
        return null;
    }

    return props.accounts.find((account) => account.id === id) ?? null;
};

const submit = () => {
    form.post(store.url());
};
</script>

<template>
<AppLayout page-title="New Obligation">
    <template #content>
        <NoAccountWarning v-if="!accounts.length" />

        <ScrollPanel v-else class="h-[740px]">
            <form
                @submit.prevent="submit"
                class="mx-auto mt-4 flex w-1/3 flex-col gap-y-2 text-sm"
            >
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
                    <div class="font-medium">Person Name</div>
                    <div class="font-medium">
                        {{
                            form.type === 'lending' ? 'Lent' : 'Borrowed'
                        }}
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

                    <div class="mt-2 font-medium">Date</div>
                    <div class="mt-2 font-medium">Due Date <span class="text-gray-500">(Optional)</span></div>

                    <DatePicker
                        date-format="dd-M-yy"
                        v-model="form.date"
                        placeholder="Enter obligation date"
                        size="small"
                        show-button-bar
                    />
                    <DatePicker
                        date-format="dd-M-yy"
                        v-model="form.due_date"
                        placeholder="Enter obligation due date"
                        size="small"
                        show-button-bar
                    />

                    <div class="col-span-2 mt-2 font-medium">
                        {{
                            form.type === 'lending' ? 'Source' : 'Destination'
                        }}
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
                                Select account
                            </span>
                        </template>
                    </Select>

                    <div class="col-span-2 mt-2 font-medium">Note</div>
                    <Textarea
                        v-model="form.note"
                        placeholder="Enter note"
                        auto-resize
                        rows="5"
                        class="col-span-2"
                    />
                </div>

                <div class="mt-4 flex justify-end gap-x-4">
                    <Button
                        size="small"
                        severity="secondary"
                        label="Cancel"
                        icon="pi pi-times"
                        @click="router.visit(index.url())"
                    />
                    <Button
                        size="small"
                        label="Create record"
                        icon="pi pi-check"
                        @click="submit"
                        :loading="form.processing"
                    />
                </div>
            </form>
        </ScrollPanel>
    </template>
</AppLayout>
</template>
