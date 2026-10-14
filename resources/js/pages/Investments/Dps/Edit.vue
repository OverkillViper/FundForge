<script lang="ts" setup>
import { ref } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import { update } from '@/routes/investments/dps';

import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Select from 'primevue/select';

interface Investment {
    id: number;
    user_id: number;
    type: 'savings_certificate' | 'dps';
    name: string;
    start_date: string;
    created_at: string;
    updated_at: string;
}

interface Dps {
    id: number;
    investment_id: number;
    bank_name: string;
    installment_amount: number;
    duration_years: number;
    interest_rate: number;
    tax_rate: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    investment: Investment;
}

const props = defineProps<{
    dps: Dps;
}>();

const parseDateOnly = (date: string): Date => {
    const [year, month, day] = date.slice(0, 10).split('-').map(Number);

    return new Date(year, month - 1, day);
};

const formatDateForSubmission = (date: Date | null): string | null => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const form = useForm({
    name: props.dps.investment.name,
    issue_date: parseDateOnly(props.dps.investment.start_date),
    bank_name: props.dps.bank_name,
    installment_amount: Number(props.dps.installment_amount),
    duration_years: Number(props.dps.duration_years),
    interest_rate: Number(props.dps.interest_rate),
    tax_rate: Number(props.dps.tax_rate),
});

const updatingDps = ref(false);

const banks = ref([
    { label: 'AB Bank PLC' },
    { label: 'Agrani Bank PLC' },
    { label: 'Al-Arafah Islami Bank PLC' },
    { label: 'Bangladesh Commerce Bank Limited' },
    { label: 'Bangladesh Development Bank PLC' },
    { label: 'Bangladesh Krishi Bank' },
    { label: 'Bank Al-Falah Limited' },
    { label: 'Bank Asia PLC.' },
    { label: 'BASIC Bank PLC.' },
    { label: 'Bengal Commercial Bank PLC.' },
    { label: 'BRAC Bank PLC' },
    { label: 'Citibank N.A' },
    { label: 'Citizens Bank PLC' },
    { label: 'City Bank PLC' },
    { label: 'Commercial Bank of Ceylon Limited' },
    { label: 'Community Bank Bangladesh PLC.' },
    { label: 'Dhaka Bank PLC' },
    { label: 'Dutch-Bangla Bank PLC' },
    { label: 'Eastern Bank PLC' },
    { label: 'Export Import Bank of Bangladesh PLC' },
    { label: 'First Security Islami Bank PLC' },
    { label: 'Global Islami Bank PLC' },
    { label: 'Habib Bank Ltd.' },
    { label: 'ICB Islamic Bank Ltd.' },
    { label: 'IFIC Bank PLC' },
    { label: 'Islami Bank Bangladesh PLC' },
    { label: 'Jamuna Bank PLC' },
    { label: 'Janata Bank PLC' },
    { label: 'Meghna Bank PLC' },
    { label: 'Mercantile Bank PLC' },
    { label: 'Midland Bank Limited' },
    { label: 'Modhumoti Bank PLC' },
    { label: 'Mutual Trust Bank PLC' },
    { label: 'Nagad Digital Bank PLC.' },
    { label: 'National Bank of Pakistan' },
    { label: 'National Bank PLC' },
    { label: 'National Credit & Commerce Bank PLC' },
    { label: 'NRB Bank PLC' },
    { label: 'NRBC Bank PLC' },
    { label: 'One Bank PLC' },
    { label: 'Padma Bank PLC' },
    { label: 'Prime Bank PLC' },
    { label: 'Probashi Kollyan Bank' },
    { label: 'Pubali Bank PLC' },
    { label: 'Rajshahi Krishi Unnayan Bank' },
    { label: 'Rupali Bank PLC' },
    { label: 'Sammilito Islami Bank PLC' },
    { label: 'SBAC Bank PLC' },
    { label: 'Shahjalal Islami Bank PLC' },
    { label: 'Shimanto Bank PLC' },
    { label: 'Social Islami Bank PLC' },
    { label: 'Sonali Bank PLC' },
    { label: 'Southeast Bank PLC' },
    { label: 'Standard Chartered Bank' },
    { label: 'Standard Islami Bank PLC' },
    { label: 'State Bank of India' },
    { label: 'The Hong Kong and Shanghai Banking Corporation. Ltd.' },
    { label: 'The Premier Bank PLC' },
    { label: 'Trust Bank PLC' },
    { label: 'Union Bank PLC' },
    { label: 'United Commercial Bank PLC' },
    { label: 'Uttara Bank PLC' },
    { label: 'Woori Bank' },
]);

const submit = () => {
    if (form.processing || !form.issue_date) return;

    updatingDps.value = true;

    form.transform((data) => ({
        ...data,
        issue_date: formatDateForSubmission(data.issue_date),
    })).put(update.url(props.dps.id), {
        preserveScroll: true,
        onFinish: () => {
            updatingDps.value = false;
        },
    });
};
</script>

<template>
    <AppLayout pageTitle="Edit DPS">
        <template #content>
            <form
                class="mx-auto mt-6 grid lg:w-1/2 grid-cols-2 gap-x-4"
                @submit.prevent="submit"
            >
                <!-- Scheme Name -->
                <div class="col-span-2 text-sm font-medium">Scheme Name</div>

                <InputText
                    v-model="form.name"
                    class="col-span-2 mt-2"
                    fluid
                    size="small"
                    placeholder="Enter a easily recognisable scheme name"
                    :disabled="form.processing"
                />

                <small v-if="form.errors.name" class="col-span-2 mt-1 text-red-500">
                    {{ form.errors.name }}
                </small>

                <!-- Issue Date / Bank Name -->
                <div class="col-span-1 mt-4 text-sm font-medium lg:col-span-1">
                    Issue Date
                </div>

                <div class="col-span-1 mt-4 hidden text-sm font-medium lg:block lg:col-span-1">
                    Bank Name
                </div>

                <DatePicker
                    v-model="form.issue_date"
                    dateFormat="dd-M-yy"
                    class="col-span-2 mt-2 lg:col-span-1"
                    fluid
                    size="small"
                    placeholder="Select issue date"
                    showButtonBar
                    :disabled="form.processing"
                />

                <div class="col-span-1 mt-4 text-sm font-medium lg:hidden">
                    Bank Name
                </div>

                <Select
                    v-model="form.bank_name"
                    :options="banks"
                    showClear
                    filter
                    size="small"
                    class="col-span-2 mt-2 text-sm! lg:col-span-1"
                    optionValue="label"
                    optionLabel="label"
                    placeholder="Select bank name"
                    :disabled="form.processing"
                    :pt="{
                        pcFilter: {
                            class: '!py-1 !px-1 !text-xs',
                        },
                    }"
                />

                <small v-if="form.errors.issue_date" class="mt-1 text-red-500">
                    {{ form.errors.issue_date }}
                </small>

                <small v-if="form.errors.bank_name" class="mt-1 text-red-500">
                    {{ form.errors.bank_name }}
                </small>

                <!-- Installment Amount / Duration -->
                <div class="mt-4 text-sm font-medium">Installment Amount</div>
                <div class="mt-4 text-sm font-medium">Duration</div>

                <InputNumber
                    v-model="form.installment_amount"
                    locale="en-IN"
                    suffix=" BDT"
                    class="mt-2"
                    fluid
                    size="small"
                    placeholder="Enter installment amount"
                    :disabled="form.processing"
                />

                <InputNumber
                    v-model="form.duration_years"
                    suffix=" years"
                    class="mt-2"
                    fluid
                    size="small"
                    placeholder="Enter duration in years"
                    :disabled="form.processing"
                />

                <small v-if="form.errors.installment_amount" class="mt-1 text-red-500">
                    {{ form.errors.installment_amount }}
                </small>

                <small v-if="form.errors.duration_years" class="mt-1 text-red-500">
                    {{ form.errors.duration_years }}
                </small>

                <!-- Interest Rate / Tax Rate -->
                <div class="mt-4 text-sm font-medium">Interest Rate</div>
                <div class="mt-4 text-sm font-medium">Tax Rate</div>

                <InputNumber
                    v-model="form.interest_rate"
                    suffix=" %"
                    mode="decimal"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                    class="mt-2"
                    fluid
                    size="small"
                    placeholder="Enter interest rate"
                    :disabled="form.processing"
                />

                <InputNumber
                    v-model="form.tax_rate"
                    suffix=" %"
                    mode="decimal"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                    class="mt-2"
                    fluid
                    size="small"
                    placeholder="Enter tax rate on interest"
                    :disabled="form.processing"
                />

                <small v-if="form.errors.interest_rate" class="mt-1 text-red-500">
                    {{ form.errors.interest_rate }}
                </small>

                <small v-if="form.errors.tax_rate" class="mt-1 text-red-500">
                    {{ form.errors.tax_rate }}
                </small>

                <!-- Buttons -->
                <div class="col-span-2 flex justify-end gap-x-2">
                    <Button
                        label="Cancel"
                        severity="secondary"
                        icon="pi pi-times"
                        size="small"
                        class="mt-4"
                        type="button"
                        :disabled="form.processing"
                        @click="router.visit(`/investments/dps/${props.dps.id}`)"
                    />

                    <Button
                        label="Update Scheme"
                        icon="pi pi-save"
                        size="small"
                        class="mt-4"
                        type="submit"
                        :loading="updatingDps"
                        :disabled="form.processing"
                    />
                </div>
            </form>
        </template>
    </AppLayout>
</template>