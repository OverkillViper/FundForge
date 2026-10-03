<script lang="ts" setup>
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import ScrollPanel from 'primevue/scrollpanel';
import { router, useForm } from '@inertiajs/vue3';
import { update, show } from '@/routes/investments/provident-fund';

interface EmployerRate {
    id: number;
    boundary_years: number;
    employer_rate: number;
}

interface ProvidentFund {
    id: number;
    start_date: string;
    employer_rates: EmployerRate[];
}

const props = defineProps<{
    providentFund: ProvidentFund;
}>();

interface EditableEmployerRate {
    boundary_years: number | null;
    employer_rate: number | null;
}

function parseDate(date: string): Date {
    const [year, month, day] = date.substring(0, 10).split('-').map(Number);

    return new Date(year, month - 1, day);
}

const form = useForm<{
    start_date: Date | null;
    employer_rates: EditableEmployerRate[];
}>({
    start_date: parseDate(props.providentFund.start_date),

    employer_rates: props.providentFund.employer_rates.map((rate) => ({
        boundary_years: rate.boundary_years,
        employer_rate: rate.employer_rate,
    })),
});

function addRate() {
    form.employer_rates.push({
        boundary_years: null,
        employer_rate: null,
    });
}

function removeRate(index: number) {
    if (form.employer_rates.length <= 1) {
        return;
    }

    form.employer_rates.splice(index, 1);
}

function submit() {
    if (!form.start_date) {
        return;
    }

    const year = form.start_date.getFullYear();

    const month = String(form.start_date.getMonth() + 1).padStart(2, '0');

    const day = String(form.start_date.getDate()).padStart(2, '0');

    form.transform(() => ({
        start_date: `${year}-${month}-${day}`,

        employer_rates: form.employer_rates,
    })).put(update.url(), {
        preserveScroll: true,
    });
}

function cancel() {
    router.visit(show.url());
}
</script>

<template>
    <Head title="Edit Provident Fund" />

    <div class="flex h-full flex-col p-6">
        <!-- Header -->
        <div class="flex items-center">
            <div class="flex flex-1 flex-col">
                <span class="text-xl font-medium"> Edit Provident Fund </span>

                <span class="font-crique text-xs text-gray-600">
                    Update your provident fund details
                </span>
            </div>
        </div>

        <div class="mx-auto mt-4 flex h-full max-w-2/3 flex-col">
            <form class="flex flex-col gap-y-2" @submit.prevent="submit">
                <!-- Basic information -->
                <div
                    class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                    <div class="mb-5">
                        <div class="text-base font-medium">
                            Provident Fund Details
                        </div>

                        <div class="mt-1 text-xs text-gray-500">
                            Update the date from which your provident fund
                            membership started.
                        </div>
                    </div>

                    <div class="max-w-md">
                        <label
                            for="start_date"
                            class="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Start Date
                        </label>

                        <DatePicker
                            id="start_date"
                            v-model="form.start_date"
                            date-format="dd/mm/yy"
                            show-icon
                            size="small"
                            fluid
                            :invalid="!!form.errors.start_date"
                        />

                        <div
                            v-if="form.errors.start_date"
                            class="mt-1 text-xs text-red-500"
                        >
                            {{ form.errors.start_date }}
                        </div>
                    </div>
                </div>

                <!-- Employer rates -->
                <div
                    class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                    <div class="mb-5 flex items-start justify-between gap-4">
                        <div>
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
                    <div
                        class="mb-5 flex items-start gap-x-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600"
                    >
                        <span class="pi pi-info-circle mt-0.5"></span>

                        <div>
                            A rate of
                            <strong>100%</strong> means the employer will add an
                            amount equal to 100% of your total accumulated
                            employee contributions.
                        </div>
                    </div>

                    <!-- Table header -->
                    <div
                        class="mb-2 grid grid-cols-[1fr_1fr_48px] gap-x-4 px-1 text-xs font-medium text-gray-500"
                    >
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
                                    :invalid="
                                        !!form.errors[
                                            `employer_rates.${index}.boundary_years`
                                        ]
                                    "
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
                                    :invalid="
                                        !!form.errors[
                                            `employer_rates.${index}.employer_rate`
                                        ]
                                    "
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

                    <div
                        v-if="form.employer_rates.length > 0"
                        class="mt-4 flex items-start gap-x-3 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-500"
                    >
                        <span class="pi pi-info-circle mt-0.5"></span>

                        <div>
                            Before
                            <span class="font-medium text-gray-700">
                                {{
                                    Math.min(
                                        ...form.employer_rates
                                            .filter(
                                                (rate) =>
                                                    rate.boundary_years !==
                                                    null,
                                            )
                                            .map(
                                                (rate) => rate.boundary_years!,
                                            ),
                                    )
                                }}
                                years </span
                            >, the employer rate is
                            <span class="font-medium text-gray-700"> 0% </span>.
                            Only the employee contribution is returned.
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div
                    class="flex justify-end gap-x-3 border-t border-gray-200 pt-2"
                >
                    <Button
                        type="button"
                        label="Cancel"
                        severity="secondary"
                        text
                        @click="cancel"
                        size="small"
                        :disabled="form.processing"
                    />

                    <Button
                        type="submit"
                        label="Save Changes"
                        icon="pi pi-check"
                        :loading="form.processing"
                        size="small"
                    />
                </div>
            </form>
        </div>
    </div>
</template>
