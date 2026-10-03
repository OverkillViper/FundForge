<script lang="ts" setup>
import { formatCurrency } from '@/lib/formatters';

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

const props = defineProps<{
    rebate: Rebate | null;
    eligibleInvestment: EligibleInvestment | null;
}>();
</script>

<template>
    <div class="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <span class="pi pi-percentage text-sm"></span>
            </div>
            <div>
                <div class="text-sm font-semibold text-gray-900">Tax Rebates</div>
                <div class="mt-0.5 text-xs text-gray-500">Eligible investments and applicable rebate limits</div>
            </div>
        </div>

        <div v-if="!rebate" class="flex items-center justify-center gap-3 px-5 py-8 text-sm text-gray-500">
            <span class="pi pi-exclamation-triangle text-amber-500"></span>
            <span>Save the income tax information to calculate total rebate.</span>
        </div>

        <div v-else class="p-5 text-sm">
            <!-- Investment Breakdown -->
            <div class="mb-3">
                <div class="text-xs font-semibold uppercase tracking-wider text-gray-400">Investment Breakdown</div>
            </div>

            <div v-if="eligibleInvestment" class="overflow-hidden rounded-xl border border-gray-100 bg-gray-50/60">
                <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <span class="font-medium text-gray-700">Savings Certificate</span>
                    <span class="font-medium text-xs text-gray-700">{{ formatCurrency(eligibleInvestment.savings_certificate_principal) }} BDT</span>
                </div>

                <div class="border-b border-gray-100 px-4 py-3">
                    <div class="flex items-center justify-between">
                        <span class="font-medium text-gray-700">Deposit Pension Scheme</span>
                        <span class="text-xs font-semibold text-gray-400">DPS</span>
                    </div>
                    <div class="mt-2 space-y-1.5 pl-4">
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>DPS Payment</span>
                            <span class="font-medium text-gray-700">{{ formatCurrency(eligibleInvestment.dps_payment) }} BDT</span>
                        </div>
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>Investment Cap</span>
                            <span class="font-medium text-gray-700">{{ formatCurrency(eligibleInvestment.dps_investment_cap) }} BDT</span>
                        </div>
                        <div class="mt-2 flex justify-between border-t border-gray-100 pt-2 text-xs font-semibold text-gray-700">
                            <span>Eligible Investment</span>
                            <span>{{ formatCurrency(eligibleInvestment.dps_eligible) }} BDT</span>
                        </div>
                    </div>
                </div>

                <div class="px-4 py-3">
                    <div class="flex items-center justify-between">
                        <span class="font-medium text-gray-700">Provident Fund</span>
                        <span class="text-xs font-semibold text-gray-400">PF</span>
                    </div>
                    <div class="mt-2 space-y-1.5 pl-4">
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>Employee Contribution</span>
                            <span class="font-medium text-gray-700">{{ formatCurrency(eligibleInvestment.pf_employee) }} BDT</span>
                        </div>
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>Employer Contribution</span>
                            <span class="font-medium text-gray-700">{{ formatCurrency(eligibleInvestment.pf_employer) }} BDT</span>
                        </div>
                        <div class="mt-2 flex justify-between border-t border-gray-100 pt-2 text-xs font-semibold text-gray-700">
                            <span>Eligible Investment</span>
                            <span>{{ formatCurrency(eligibleInvestment.pf_eligible) }} BDT</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rebate Inputs -->
            <div class="mt-5 grid grid-cols-2 gap-3">
                <div class="rounded-xl bg-gray-50 px-4 py-3 border">
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Taxable Income</div>
                    <div class="mt-1 text-base font-bold text-gray-900">{{ formatCurrency(rebate.taxable_income) }} <span class="text-xs font-medium text-gray-400">BDT</span></div>
                </div>
                <div class="rounded-xl bg-gray-50 px-4 py-3 border">
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Eligible Investment</div>
                    <div class="mt-1 text-base font-bold text-gray-900">
                        <template v-if="eligibleInvestment">{{ formatCurrency(eligibleInvestment.eligible_total) }} <span class="text-xs font-medium text-gray-400">BDT</span></template>
                        <template v-else>N/A</template>
                    </div>
                </div>
            </div>

            <!-- Rebate Limits -->
            <div class="mt-5">
                <div class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Rebate Limits</div>

                <div class="grid grid-cols-5 border-b border-gray-100 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    <div class="col-span-2">Particulars</div>
                    <div class="col-span-2">Calculation</div>
                    <div class="text-right">Limit</div>
                </div>

                <div class="grid grid-cols-5 items-center border-b border-gray-100 py-3">
                    <div class="col-span-2 font-medium text-gray-700">(a) Taxable Income Rebate Limit</div>
                    <div class="col-span-2 flex items-center gap-2 text-gray-500">
                        {{ formatCurrency(rebate.taxable_income) }}
                        <span class="pi pi-times text-[9px]"></span>
                        <span>3%</span>
                    </div>
                    <div class="text-right font-medium text-gray-800">{{ formatCurrency(rebate.taxable_income_rebate_limit) }} BDT</div>
                </div>

                <div class="grid grid-cols-5 items-center border-b border-gray-100 py-3">
                    <div class="col-span-2 font-medium text-gray-700">(b) Investment Rebate Limit</div>
                    <div v-if="eligibleInvestment" class="col-span-2 flex items-center gap-2 text-gray-500">
                        {{ formatCurrency(eligibleInvestment.eligible_total) }}
                        <span class="pi pi-times text-[9px]"></span>
                        <span>10%</span>
                    </div>
                    <div v-else class="col-span-2 text-gray-400">N/A</div>
                    <div class="text-right font-medium text-gray-800">{{ formatCurrency(rebate.investment_rebate_limit) }} BDT</div>
                </div>

                <div class="grid grid-cols-5 items-center border-b border-gray-100 py-3">
                    <div class="col-span-2 font-medium text-gray-700">(c) Maximum Rebate Limit</div>
                    <div class="col-span-2 text-gray-500">Maximum allowed rebate</div>
                    <div class="text-right font-medium text-gray-800">{{ formatCurrency(rebate.max_rebate_cap) }} BDT</div>
                </div>
            </div>

            <!-- Final Rebate -->
            <div class="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-4">
                <div>
                    <div class="text-xs font-semibold uppercase tracking-wider text-emerald-700">Applicable Tax Rebate</div>
                    <div class="mt-0.5 text-xs text-emerald-600">Limited by {{ rebate.limiting_factor.replaceAll('_', ' ') }}</div>
                </div>
                <div class="text-xl font-semibold text-emerald-700">{{ formatCurrency(rebate.rebate) }} <span class="text-xs font-medium text-emerald-500">BDT</span></div>
            </div>
        </div>
    </div>
</template>
