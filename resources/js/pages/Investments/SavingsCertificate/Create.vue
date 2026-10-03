<script lang="ts" setup>
import { Head, router, useForm } from '@inertiajs/vue3';
import { store } from '@/routes/investments/savings-certificates';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import AppLayout from '@/layouts/AppLayout.vue';

const form = useForm({
    name: '',
    issue_date: null,
    duration_years: 0,
    principal_value: 0,
    interest_interval_months: 0,
});
</script>

<template>
<AppLayout page-title="New Savings Certificate">
    <template #content>
        <form
            class="mx-auto mt-4 mt-6 grid w-1/3 grid-cols-2 gap-x-4"
            @submit.prevent
        >
            <div class="col-span-2 text-sm font-medium">Certificate Name</div>
            <InputText
                v-model="form.name"
                class="col-span-2 mt-2"
                fluid
                size="small"
                placeholder="Enter a easily recognisable certificate name"
            />

            <div class="mt-4 text-sm font-medium">Issue Date</div>
            <div class="mt-4 text-sm font-medium">Principal Value</div>

            <DatePicker
                dateFormat="dd-M-yy"
                v-model="form.issue_date"
                class="mt-2"
                fluid
                size="small"
                placeholder="Select issue date"
            />
            <InputNumber
                v-model="form.principal_value"
                locale="en-IN"
                suffix=" BDT"
                class="mt-2"
                fluid
                size="small"
                placeholder="Enter principal value"
            />

            <div class="mt-4 text-sm font-medium">Duration</div>
            <div class="mt-4 text-sm font-medium">Interest Interval</div>

            <InputNumber
                v-model="form.duration_years"
                suffix=" years"
                class="mt-2"
                fluid
                size="small"
                placeholder="Enter duration in years"
            />
            <InputNumber
                v-model="form.interest_interval_months"
                suffix=" months"
                class="mt-2"
                fluid
                size="small"
                placeholder="Enter interest interval in months"
            />

            <div class="col-span-2 flex justify-end gap-x-2 mt-4">
                <Button
                    label="Cancel"
                    severity="secondary"
                    icon="pi pi-times"
                    size="small"
                    class="mt-4"
                    @click="router.visit('/investments/savings-certificates')"
                />
                <Button
                    label="Create Certificate"
                    icon="pi pi-plus"
                    size="small"
                    class="mt-4"
                    @click="form.post(store.url())"
                    :loading="form.processing"
                />
            </div>
        </form>
    </template>
</AppLayout>
</template>
