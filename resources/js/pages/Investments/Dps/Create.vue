<script lang="ts" setup>
import { Head, router, useForm } from '@inertiajs/vue3';
import { store } from '@/routes/investments/dps';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Select from 'primevue/select';
import { ref } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';

const form = useForm({
    name: '',
    bank_name: '',
    issue_date: null,
    installment_amount: 0,
    duration_years: 0,
    interest_rate: 0,
    tax_rate: 0,
});

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
    form.post(store.url());
};
</script>

<template>
<AppLayout pageTitle="New Scheme">
    <template #content>
        <form
            class="mx-auto mt-4 mt-6 grid w-1/2 grid-cols-2 gap-x-4"
            @submit.prevent="submit"
        >
            <div class="col-span-2 text-sm font-medium">Scheme Name</div>
            <InputText
                v-model="form.name"
                class="col-span-2 mt-2"
                fluid
                size="small"
                placeholder="Enter a easily recognisable scheme name"
            />

            <div class="mt-4 text-sm font-medium">Issue Date</div>
            <div class="mt-4 text-sm font-medium">Bank Name</div>

            <DatePicker
                dateFormat="dd-M-yy"
                v-model="form.issue_date"
                class="mt-2"
                fluid
                size="small"
                placeholder="Select issue date"
                showButtonBar
            />
            <Select
                :options="banks"
                v-model="form.bank_name"
                showClear
                filter
                size="small"
                class="mt-2 text-sm!"
                optionValue="label"
                optionLabel="label"
                placeholder="Select bank name"
                :pt="{
                    pcFilter: { class: '!py-1 !px-1 !text-xs' },
                }"
            />

            <div class="mt-4 text-sm font-medium">Installment Amount</div>
            <div class="mt-4 text-sm font-medium">Duration</div>

            <InputNumber
                v-model="form.installment_amount"
                locale="en-IN"
                suffix=" BDT"
                class="mt-2"
                fluid
                size="small"
                placeholder="Enter principal value"
            />
            <InputNumber
                v-model="form.duration_years"
                suffix=" years"
                class="mt-2"
                fluid
                size="small"
                placeholder="Enter duration in years"
            />

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
            />

            <div class="col-span-2 flex justify-end gap-x-2 mt-4">
                <Button
                    label="Cancel"
                    severity="secondary"
                    icon="pi pi-times"
                    size="small"
                    class="mt-4"
                    @click="router.visit('/investments/dps')"
                />
                <Button
                    label="Create Scheme"
                    icon="pi pi-plus"
                    size="small"
                    class="mt-4"
                    type="submit"
                    :loading="form.processing"
                />
            </div>
        </form>
    </template>
</AppLayout>
</template>
