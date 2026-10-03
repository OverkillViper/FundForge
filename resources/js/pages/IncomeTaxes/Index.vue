<script lang="ts" setup>
import Button from 'primevue/button';
import Select from 'primevue/select';
import { computed, ref, watch } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import ScrollPanel from 'primevue/scrollpanel';

import { index } from '@/routes/income-taxes';
import { index as indexTds } from '@/routes/salary-tds';

import IncomeForm from './IncomeForm.vue';
import TotalIncome from './TotalIncome.vue';
import Exemptions from './Exemptions.vue';
import TaxBreakdown from './TaxBreakdown.vue';
import Rebates from './Rebates.vue';
import FinalTax from './FinalTax.vue';
import { formatCurrency } from '@/lib/formatters.js';
import ToggleSwitch from 'primevue/toggleswitch';
import AppLayout from '@/layouts/AppLayout.vue';

const toggleDiscount = ref(true);

interface IncomeYear {
    label: string;
    value: number;
}

interface IncomeTax {
    user_id: number;
    from_year: number;
    to_year: number;
    current_salary: number;
    previous_salary: number;
    festival_bonus: number;
    other_bonus: number;
    net_bank_interest: number;
    net_bank_tds: number;
    net_bank_charges: number;
}

interface TotalIncome {
    salary: number;
    salary_exemption: number;
    taxable_salary: number;
    bank: number;
    savings_certificate_interest: number | null;
    taxable_total: number | null;
    total: number | null;
    warnings: {
        type: string;
        name: string;
        message: string;
    }[];
}

interface ProvidentFund {
    start_date: string;
}

interface TaxBreakdown {
    income_from: number;
    income_to: number;
    taxable_amount: number;
    tax_percent: number;
    tax_amount: number;
}

interface Tax {
    taxable_income: number;
    tax_liability: number;
    breakdown: TaxBreakdown[];
}

interface RebateBreakdown {
    type: string;
    amount: number;
}

interface Rebate {
    taxable_income: number;
    taxable_income_rebate_limit: number;
    eligible_investment: number;
    rebate_percentage: number;
    investment_rebate_limit: number;
    max_rebate_cap: number;
    rebate: number;
    limiting_factor: string;
    breakdown: RebateBreakdown[];
}

interface EligibleInvestment {
    dps_payment: number;
    dps_eligible: number;
    dps_investment_cap: number;
    pf_employee: number;
    pf_employer: number;
    pf_eligible: number;
    savings_certificate_principal: number;
    savings_certificate_count: number;
    eligible_total: number;
}

interface FinalTax {
    tax_liability: number;
    tax_rebate: number;
    salary_tds: number;
    savings_certificate_tds: number;
    bank_tds: number;
    total_tds: number;
    final_tax: number;
    final_tax_after_discount: number;
    discount_amount: number;
    tax_payable: number;
    tax_refundable: number;
}

const props = defineProps<{
    startIncomeYear: number;
    selectedIncomeYear: number;
    salaryEffectiveMonth: number | null;
    providentFundPercentage: number | null;
    providentFund: ProvidentFund | null;
    incomeTax: IncomeTax | null;
    totalIncome: TotalIncome | null;
    tax: Tax | null;
    rebate: Rebate | null;
    eligibleInvestment: EligibleInvestment | null;
    finalTax: FinalTax | null;
}>();

const currentYear = new Date().getFullYear();

const latestIncomeYear = computed(() => {
    return currentYear;
});

const incomeYears = computed<IncomeYear[]>(() => {
    const years: IncomeYear[] = [];

    for (
        let year = latestIncomeYear.value;
        year >= props.startIncomeYear;
        year--
    ) {
        years.push({
            label: `${year}-${year + 1}`,
            value: year,
        });
    }

    return years;
});

const selectedYear = ref(props.selectedIncomeYear ?? latestIncomeYear.value);

const form = useForm({
    year: selectedYear.value,
});

watch(selectedYear, (year) => {
    form.year = year;

    form.get(index.url(), {
        preserveState: false,
        preserveScroll: true,
    });
});
</script>

<template>
<AppLayout page-title="Income Tax">
    <template #toolbar>
        <div class="flex flex-col items-end gap-y-1">
            <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Income Year</div>
            <Select
                v-model="selectedYear"
                :options="incomeYears"
                optionLabel="label"
                optionValue="value"
                class="w-40 text-sm!"
                size="small"
                :disabled="form.processing"
            />
        </div>
    </template>

    <template #content>
        <ScrollPanel class="mt-4 h-[720px]">
            <div class="mx-auto w-2/3 space-y-4 pb-8">
                <!-- Income Form -->
                <IncomeForm
                    :selected-income-year="selectedYear"
                    :income-tax="props.incomeTax"
                    :salary-effective-month="props.salaryEffectiveMonth"
                    :provident-fund-percentage="props.providentFundPercentage"
                    :provident-fund="props.providentFund"
                />

                <!-- Warnings -->
                <div v-if="totalIncome?.warnings.length" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm">
                    <div class="flex items-start gap-3">
                        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                            <span class="pi pi-exclamation-triangle text-sm text-amber-600"></span>
                        </div>
                        <div class="min-w-0">
                            <div class="text-sm font-semibold text-amber-900">Calculation Warning</div>
                            <div class="mt-1 space-y-1">
                                <div v-for="warning in totalIncome.warnings" :key="`${warning.name}-${warning.message}`" class="flex items-start gap-2 text-xs leading-5 text-amber-800">
                                    <span class="pi pi-circle-fill mt-2 text-[5px]"></span>
                                    <span><span class="font-medium">{{ warning.name }}:</span> {{ warning.message }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tax Return Discount -->
                <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
                    <div class="flex items-start gap-3">
                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <span class="pi pi-percentage text-sm"></span>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-gray-800">Tax Return Discount</div>
                            <div class="mt-0.5 text-xs text-gray-500">A 5% discount will be applied when the return is submitted before September.</div>
                        </div>
                    </div>
                    <ToggleSwitch v-model="toggleDiscount" inputId="switch" />
                </div>

                <!-- Tax Summary -->
                <div class="rounded-2xl bg-primary p-4">
                    <div class="mb-4 flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-white">Tax Summary</div>
                            <div class="mt-0.5 text-xs text-gray-300">Overview of your calculated income tax</div>
                        </div>
                        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-primary">
                            <span class="pi pi-chart-bar text-sm"></span>
                        </div>
                    </div>

                    <div class="grid grid-cols-5 divide-x divide-primary-200">
                        <div class="px-3 first:pl-0">
                            <div class="text-[10px] uppercase tracking-wider text-gray-200">Taxable Income</div>
                            <div class="mt-1 text-lg font-medium text-gray-100">
                                <template v-if="totalIncome?.taxable_total">{{ formatCurrency(totalIncome.taxable_total.toFixed(0)) }} <span class="text-xs font-medium text-gray-200">BDT</span></template>
                                <template v-else>N/A</template>
                            </div>
                        </div>

                        <div class="px-3">
                            <div class="text-[10px] uppercase tracking-wider text-gray-200">Tax Liability</div>
                            <div class="mt-1 text-lg font-medium text-gray-100">
                                <template v-if="tax?.tax_liability">{{ formatCurrency(tax.tax_liability.toFixed(0)) }} <span class="text-xs font-medium text-gray-400">BDT</span></template>
                                <template v-else>N/A</template>
                            </div>
                        </div>

                        <div class="px-3">
                            <div class="text-[10px] uppercase tracking-wider text-gray-200">Tax Rebate</div>
                            <div class="mt-1 text-lg font-medium text-emerald-300">
                                <template v-if="rebate?.rebate">{{ formatCurrency(rebate.rebate.toFixed(0)) }} <span class="text-xs font-medium text-gray-400">BDT</span></template>
                                <template v-else>N/A</template>
                            </div>
                        </div>

                        <div class="px-3">
                            <div class="text-[10px] uppercase tracking-wider text-gray-200">TDS</div>
                            <div class="mt-1 text-lg font-medium text-gray-100">
                                <template v-if="finalTax">{{ formatCurrency(finalTax.total_tds.toFixed(0)) }} <span class="text-xs font-medium text-gray-400">BDT</span></template>
                                <template v-else>N/A</template>
                            </div>
                        </div>

                        <div class="px-3 last:pr-0">
                            <div class="text-[10px] uppercase tracking-wider text-gray-200">{{ finalTax?.tax_refundable === 0 ? 'Tax Payable' : 'Tax Refundable' }}</div>
                            <div class="mt-1 text-lg font-medium" :class="finalTax?.tax_refundable === 0 ? 'text-white' : 'text-emerald-600'">
                                <template v-if="finalTax">
                                    {{ toggleDiscount ? formatCurrency(finalTax.final_tax_after_discount.toFixed(0)) : formatCurrency(finalTax.final_tax.toFixed(0)) }}
                                    <span class="text-xs font-medium text-gray-400">BDT</span>
                                </template>
                                <template v-else>N/A</template>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Calculation Sections -->
                <Exemptions :total-income="totalIncome" />
                <TotalIncome :total-income="props.totalIncome" />
                <TaxBreakdown :tax="tax" />
                <Rebates :rebate="rebate" :eligible-investment="eligibleInvestment" />
                <FinalTax :final-tax="finalTax" :toggle-discount="toggleDiscount" />
            </div>
        </ScrollPanel>
    </template>
</AppLayout>
</template>
