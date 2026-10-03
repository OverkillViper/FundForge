<script lang="ts" setup>
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import { router, useForm } from '@inertiajs/vue3';
import ScrollPanel from 'primevue/scrollpanel';
import { store } from '@/routes/investments/provident-fund';
import { index } from '@/routes/investments';

interface EmployerRate {
    boundary_years: number | null;
    employer_rate: number | null;
}

const form = useForm<{
    start_date: Date | null;
    employer_rates: EmployerRate[];
}>({
    start_date: null,

    employer_rates: [
        {
            boundary_years: null,
            employer_rate: null,
        },
    ],
});

const addRate = () => {
    form.employer_rates.push({
        boundary_years: null,
        employer_rate: null,
    });
};

const removeRate = (index: number) => {
    if (form.employer_rates.length <= 1) {
        return;
    }

    form.employer_rates.splice(index, 1);
};

const submit = () => {
    if (!form.start_date) {
        return;
    }

    const year = form.start_date.getFullYear();

    const month = String(form.start_date.getMonth() + 1).padStart(2, '0');

    const day = String(form.start_date.getDate()).padStart(2, '0');

    form.transform(() => ({
        start_date: `${year}-${month}-${day}`,
        employer_rates: form.employer_rates,
    })).post(store.url(), {
        preserveScroll: true,
    });
};

const cancel = () => {
    router.visit(index.url());
};
</script>

<template>
<AppLayout pageTitle="Provident Fund">
    <template #content>
        <div class="mx-auto mt-4 flex h-full max-w-2/3 flex-col">
            <!-- Information -->
            <div class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <span class="pi pi-exclamation-triangle text-sm text-amber-600"></span>
                </div>

                <div class="flex flex-col gap-0.5">
                    <span class="text-sm font-semibold">Provident Fund Not Found</span>

                    <p class="m-0 text-sm leading-5 text-amber-800">
                        No existing provident fund record was found. Please add a provident
                        fund record to continue.
                    </p>
                </div>
            </div>

            <form class="mt-2 flex flex-col gap-y-2" @submit.prevent="submit">
                <!-- Basic information -->
                <div class="flex items-start rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div class="w-1/2">
                        <div class="text-base font-medium">Provident Fund Details</div>

                        <div class="mt-1 text-xs text-gray-500">
                            Enter the date from which your provident fund
                            membership started.
                        </div>
                    </div>

                    <div class="w-1/2">
                        <label for="start_date" class="mb-2 block text-sm font-medium text-gray-700">
                            Start Date
                        </label>

                        <DatePicker
                            id="start_date"
                            v-model="form.start_date"
                            date-format="dd/mm/yy"
                            show-icon
                            size="small"
                            fluid
                            show-button-bar
                        />

                        <div v-if="form.errors.start_date" class="mt-1 text-xs text-red-500">
                            {{ form.errors.start_date }}
                        </div>
                    </div>
                </div>

                <!-- Employer rates -->
                <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div class="mb-5 flex items-start justify-between gap-4">
                        <div class="w-4/5">
                            <div class="text-base font-medium">
                                Employer Contribution Rates
                            </div>

                            <div class="mt-1 max-w-2xl text-xs text-gray-500">
                                Define how much the employer will add to your
                                accumulated employee contributions when the
                                provident fund is paid out.
                            </div>
                        </div>

                        <Button
                            type="button"
                            icon="pi pi-plus"
                            label="Add Rate"
                            size="small"
                            outlined
                            @click="addRate"
                        />
                    </div>

                    <!-- Explanation -->
                    <div class="mb-5 flex items-start gap-x-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
                        <span class="pi pi-info-circle mt-0.5"></span>

                        <div>
                            For example, a rate of
                            <strong>100%</strong> means the employer will add an
                            amount equal to 100% of your total accumulated
                            employee contributions.
                        </div>
                    </div>

                    <!-- Table header -->
                    <div class="mb-2 grid grid-cols-[1fr_1fr_48px] gap-x-4 px-1 text-xs font-medium text-gray-500">
                        <div>Minimum Years</div>

                        <div>Employer Rate</div>

                        <div></div>
                    </div>

                    <!-- Rate rows -->
                    <ScrollPanel class="mt-4 h-[120px] w-full">
                        <div class="flex flex-col gap-y-3">
                            <div
                                v-for="(rate, index) in form.employer_rates"
                                :key="index"
                                class="grid grid-cols-[1fr_1fr_48px] items-center gap-x-4"
                            >
                                <!-- Boundary -->
                                <InputNumber
                                    v-model="rate.boundary_years"
                                    :min="0"
                                    :max-fraction-digits="0"
                                    :use-grouping="false"
                                    placeholder="e.g. 2"
                                    fluid
                                    size="small"
                                />

                                <!-- Employer rate -->
                                <InputNumber
                                    v-model="rate.employer_rate"
                                    :min="0"
                                    :max="100"
                                    :max-fraction-digits="2"
                                    suffix="%"
                                    placeholder="e.g. 100"
                                    fluid
                                    size="small"
                                />

                                <!-- Remove -->
                                <Button
                                    type="button"
                                    icon="pi pi-trash"
                                    severity="danger"
                                    text
                                    rounded
                                    :disabled="form.employer_rates.length <= 1"
                                    @click="removeRate(index)"
                                    size="small"
                                />
                            </div>
                        </div>
                    </ScrollPanel>

                    <!-- General validation error -->
                    <div
                        v-if="form.errors.employer_rates"
                        class="mt-3 text-xs text-red-500"
                    >
                        {{ form.errors.employer_rates }}
                    </div>

                    <div class="mt-4 text-xs text-gray-500">
                        Example:
                        <span class="font-medium"> 0 years → 0% </span>,
                        <span class="font-medium"> 2 years → 100% </span>,
                        <span class="font-medium"> 3 years → 50% </span>.
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-x-3 my-2">
                    <Button
                        type="button"
                        label="Cancel"
                        severity="secondary"
                        @click="cancel"
                        size="small"
                    />

                    <Button
                        type="submit"
                        label="Create Provident Fund"
                        icon="pi pi-check"
                        :loading="form.processing"
                        size="small"
                    />
                </div>
            </form>
        </div>
    </template>
</AppLayout>
</template>
