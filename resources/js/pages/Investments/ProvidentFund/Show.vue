<script lang="ts" setup>
import { computed, ref } from 'vue';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import { router } from '@inertiajs/vue3';
import { update } from '@/routes/investments/provident-fund/rates';
import { edit, destroy as destroyPF, } from '@/routes/investments/provident-fund';
import { formatCurrency } from '@/lib/formatters.js';
import RecordContributionDialog from '@/pages/Investments/ProvidentFund/RecordContributionDialog.vue';
import EditContributionDialog from '@/pages/Investments/ProvidentFund/EditContributionDialog.vue';
import { destroy } from '@/routes/investments/provident-fund/contribution/index';
import StatCard from '@/pages/Investments/StatCard.vue';

const contributionDialog = ref(false);
const editContributionDialog = ref(false);
const selectedContribution = ref<Contribution | null>(null);

interface EmployerRate {
    id: number;
    provident_fund_id: number;
    boundary_years: number;
    employer_rate: number;
    created_at: string;
    updated_at: string;
}

interface EditableEmployerRate {
    id: number | null;
    boundary_years: number | null;
    employer_rate: number | null;
}

interface Contribution {
    id: number;
    amount: number;
    contribution_date: string;
}

interface ProvidentFund {
    id: number;
    user_id: number;
    start_date: string;
    created_at: string;
    updated_at: string;
    contributions_sum_amount: number | null;
    contributions_count: number;
    employer_rates: EmployerRate[];
    contributions: Contribution[];
}

const props = defineProps<{
    providentFund: ProvidentFund;
    calculation?: {
        employee_contribution: number;
        employer_rate: number;
        employer_contribution: number;
        total_contribution: number;
        total_value: number;
        elapsed_years: number;
    };
}>();

/*
|--------------------------------------------------------------------------
| Employer rates
|--------------------------------------------------------------------------
*/

const rates = ref<EditableEmployerRate[]>(
    props.providentFund.employer_rates.map((rate) => ({
        id: rate.id,
        boundary_years: rate.boundary_years,
        employer_rate: rate.employer_rate,
    })),
);

const editing = ref(false);
const saving = ref(false);

/*
|--------------------------------------------------------------------------
| Sorted rates
|--------------------------------------------------------------------------
*/

const displayedRates = computed(() => {
    if (editing.value) { return rates.value; }

    return [...rates.value].sort((a, b) => {
        return (a.boundary_years ?? 0) - (b.boundary_years ?? 0);
    });
});
/*
|--------------------------------------------------------------------------
| Formatting
|--------------------------------------------------------------------------
*/

function formatDate(dateString: string) {
    if (!dateString) return '';

    const date = new Date(dateString);

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date).replace(/(\d+) (\w+) (\d+)/, '$1 $2, $3');
}

/*
|--------------------------------------------------------------------------
| Rate editing
|--------------------------------------------------------------------------
*/

function startEditing() { editing.value = true; }

function cancelEditing() {
    rates.value = props.providentFund.employer_rates.map((rate) => ({
        id: rate.id,
        boundary_years: rate.boundary_years,
        employer_rate: rate.employer_rate,
    }));

    editing.value = false;
}

function addRate() {
    editing.value = true;

    rates.value.push({
        id: null,
        boundary_years: null,
        employer_rate: null,
    });
}

function removeRate(index: number) { rates.value.splice(index, 1); }

/*
|--------------------------------------------------------------------------
| Save rates
|--------------------------------------------------------------------------
*/

function saveRates() {
    const validRates = rates.value.every(
        (rate) => rate.boundary_years !== null && rate.employer_rate !== null,
    );

    if (!validRates) { return; }

    saving.value = true;

    router.put(
        update.url(),
        {
            employer_rates: rates.value.map((rate) => ({
                boundary_years: rate.boundary_years,
                employer_rate: rate.employer_rate,
            })),
        },
        {
            preserveScroll: true,
            onSuccess: () => { editing.value = false; },
            onFinish: () => { saving.value = false; },
        },
    );
}

function editContribution(contribution: Contribution) {
    selectedContribution.value = contribution;
    editContributionDialog.value = true;
}

function deleteContribution(contribution: Contribution) {
    router.delete(destroy.url(contribution.id));
}
</script>

<template>
<AppLayout pageTitle="Provident Fund">
    <template #toolbar>
        <Button
            label="Delete Provident Fund"
            icon="pi pi-trash"
            size="small"
            variant="outlined"
            @click="router.delete(destroyPF.url())"
        />
        <Button
            label="Edit Provident Fund"
            icon="pi pi-pencil"
            size="small"
            @click="router.visit(edit.url())"
        />
    </template>
    <template #content>
        <div class="mt-6 flex h-full flex-col">
            <div class="flex flex-col">
                <!-- ===================================================== -->
                <!-- Summary cards -->
                <!-- ===================================================== -->
                <div class="grid grid-cols-4 gap-4">
                    <StatCard 
                        icon="icon-calendar"
                        :value="formatDate(providentFund.start_date)"
                        title="Start Date"
                        prefix=""
                    />
                    <StatCard 
                        icon="icon-landmark"
                        :value="formatCurrency(providentFund.contributions_sum_amount ?? 0,)"
                        title="Total Contribution"
                        prefix="BDT"
                    />
                    <StatCard 
                        icon="icon-hash"
                        :value="providentFund.contributions_count"
                        title="Contributions"
                        prefix=""
                    />
                    <StatCard 
                        icon="icon-badge-dollar-sign"
                        :value="formatCurrency(calculation?.total_value ?? 0,)"
                        title="Current Payout Amount"
                        prefix="BDT"
                    />
                </div>
                <div class="mt-4 flex gap-x-4">
                    <div class="p-5 w-2/3">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="font-medium">Contribution Records</div>
                                <div class="mt-0.5 text-xs text-gray-500">
                                    Employee contributions made to the
                                    provident fund
                                </div>
                            </div>
                            <Button
                                size="small"
                                label="Add Record"
                                icon="pi pi-plus"
                                @click="contributionDialog = true"
                            />
                            <RecordContributionDialog v-model:visible="contributionDialog"/>
                        </div>

                        <div class="mt-4">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr>
                                        <th class="border-y border-y-gray-300 p-2 text-left font-semibold">Date</th>
                                        <th class="border-y border-y-gray-300 p-2 text-right font-semibold">Amount</th>
                                        <th class="w-20 border-y border-y-gray-300 p-2"></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="contribution in providentFund.contributions" :key="contribution.id" class="group transition-colors hover:bg-gray-50">
                                        <td class="p-2.5 text-gray-700">{{ formatDate( contribution.contribution_date, ) }}</td>
                                        <td class="p-2.5 text-right font-medium">{{ formatCurrency( contribution.amount, ) }} BDT </td>

                                        <td class="p-2.5">
                                            <div class="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button
                                                    icon="pi pi-pencil"
                                                    text
                                                    rounded
                                                    size="small"
                                                    severity="secondary"
                                                    aria-label="Edit contribution"
                                                    @click="editContribution( contribution)"
                                                />

                                                <EditContributionDialog v-model:visible="editContributionDialog" :contribution="selectedContribution"/>

                                                <Button
                                                    icon="pi pi-trash"
                                                    text
                                                    rounded
                                                    size="small"
                                                    severity="danger"
                                                    aria-label="Delete contribution"
                                                    @click="deleteContribution(contribution)"
                                                />
                                            </div>
                                        </td>
                                    </tr>

                                    <tr v-if="providentFund.contributions.length === 0">
                                        <td colspan="3" class="py-8 text-center text-gray-400">
                                            No contribution records yet.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="w-1/3 rounded-xl bg-white shadow-sm overflow-hidden border">
                        <!-- Header -->
                        <div class="flex items-center justify-between bg-primary text-white p-4">
                            <div class="font-medium">Employer Rates</div>
                            <div class="flex items-center gap-1 bg-primary-50 rounded-lg text-white!">
                                <!-- Add Rate -->
                                <Button
                                    v-if="editing"
                                    size="small"
                                    label="Add Rate"
                                    icon="pi pi-plus"
                                    text
                                    @click="addRate"
                                    class="text-white!"
                                />
                                <!-- Edit -->
                                <Button
                                    v-if="!editing"
                                    icon="pi pi-pencil"
                                    text
                                    rounded
                                    size="small"
                                    @click="startEditing"
                                    class="text-white!"
                                />
                            </div>
                        </div>

                        <div class="p-4">
                            <table class="text-sm w-full">
                                <thead>
                                    <tr>
                                        <th
                                            class="w-2/4 border-y border-y-gray-300 p-2 text-left font-semibold"
                                        >
                                            After
                                        </th>
                                        <th
                                            class="w-2/4 border-y border-y-gray-300 p-2 text-left font-semibold"
                                        >
                                            Employer Rate
                                        </th>
                                        <th
                                            v-if="editing"
                                            class="w-0 w-8 border-y border-y-gray-300 p-2"
                                        ></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- ================================================= -->
                                    <!-- Rates -->
                                    <!-- ================================================= -->
                                    <tr
                                        v-for="(rate, index) in displayedRates"
                                        :key="rate.id ?? `new-${index}`"
                                        class="group transition-colors hover:bg-gray-50"
                                    >
                                        <!-- Boundary -->
                                        <td class="p-2 text-left">
                                            <template v-if="editing">
                                                <div
                                                    class="flex items-center gap-1"
                                                >
                                                    <span
                                                        class="me-4 text-gray-400"
                                                    >
                                                        After
                                                    </span>
                                                    <InputNumber
                                                        v-model="
                                                            rate.boundary_years
                                                        "
                                                        :min="0"
                                                        :max="100"
                                                        :use-grouping="false"
                                                        size="small"
                                                        fluid
                                                        suffix=" years"
                                                    />
                                                </div>
                                            </template>
                                            <template v-else>
                                                After
                                                {{ rate.boundary_years }} years
                                            </template>
                                        </td>
                                        <!-- Employer rate -->
                                        <td class="p-2 text-left">
                                            <template v-if="editing">
                                                <InputNumber
                                                    v-model="rate.employer_rate"
                                                    :min="0"
                                                    :max="100"
                                                    :min-fraction-digits="0"
                                                    :max-fraction-digits="2"
                                                    suffix="%"
                                                    size="small"
                                                    fluid
                                                />
                                            </template>
                                            <template v-else>
                                                {{ rate.employer_rate }}%
                                            </template>
                                        </td>
                                        <!-- Delete -->
                                        <td v-if="editing" class="p-2 text-end!">
                                            <Button
                                                icon="pi pi-trash"
                                                text
                                                rounded
                                                size="small"
                                                severity="danger"
                                                @click="removeRate(index)"
                                            />
                                        </td>
                                    </tr>
                                    <!-- ================================================= -->
                                    <!-- Empty state -->
                                    <!-- ================================================= -->
                                    <tr v-if="displayedRates.length === 0">
                                        <td
                                            :colspan="editing ? 3 : 2"
                                            class="py-6 text-center text-gray-400"
                                        >
                                            No employer rates configured.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- ================================================= -->
                        <!-- Notice -->
                        <!-- ================================================= -->
                        <div v-if="displayedRates.length > 0" class="flex items-center gap-2 rounded-md bg-gray-100 p-3 m-3 text-xs text-gray-500">
                            <i class="pi pi-info-circle"></i>
                            <span>
                                Before <span class="font-medium text-gray-600">{{ displayedRates[0].boundary_years }} years </span>,
                                the employer rate is <span class="font-medium text-gray-600"> 0% </span>. Only the employee contribution is returned.
                            </span>
                        </div>
                        <!-- ================================================= -->
                        <!-- Edit actions -->
                        <!-- ================================================= -->
                        <div v-if="editing" class="flex justify-end gap-2 p-3">
                            <Button
                                label="Cancel"
                                severity="secondary"
                                text
                                size="small"
                                :disabled="saving"
                                @click="cancelEditing"
                            />
                            <Button
                                label="Save Changes"
                                icon="pi pi-check"
                                size="small"
                                :loading="saving"
                                @click="saveRates"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
</AppLayout>
</template>
