<script lang="ts" setup>
import { Head, router, useForm } from '@inertiajs/vue3';
import { update } from '@/routes/investments/savings-certificates';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import AppLayout from '@/layouts/AppLayout.vue';

interface Certificate {
    id: number;
    investment_id: number;
    issue_date: string;
    duration_years: number;
    principal_value: string;
    interest_interval_months: number;

    investment: {
        id: number;
        name: string;
    };
}

const props = defineProps<{
    certificate: Certificate;
}>();

const form = useForm({
    name: props.certificate.investment.name,
    issue_date: new Date(props.certificate.issue_date),
    duration_years: props.certificate.duration_years,
    principal_value: Number(props.certificate.principal_value),
    interest_interval_months: props.certificate.interest_interval_months,
});

const submit = () => {
    // console.log('Submitting form:', form.issue_date);
    form.put(update.url(props.certificate.id));
};
</script>

<template>
<AppLayout page-title="Edit Certificate">
    <template #content>
        <form
            class="mx-auto mt-6 grid w-1/3 grid-cols-2 gap-x-4"
            @submit.prevent="submit"
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
                v-model="form.issue_date"
                dateFormat="dd-M-yy"
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
                    label="Update Certificate"
                    icon="pi pi-save"
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
