<script lang="ts" setup>
import { formatCurrency } from '@/lib/formatters';

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

const props = defineProps<{
    tax: Tax | null;
}>();
</script>

<template>
    <div class="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div class="flex items-center gap-3 border-b border-gray-100 p-3 lg:p-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span class="pi pi-chart-line text-sm"></span>
            </div>
            <div>
                <div class="text-sm font-semibold text-gray-900">Tax Liability Breakdown</div>
                <div class="mt-0.5 text-xs text-gray-500">Progressive tax calculated across applicable tax slabs</div>
            </div>
        </div>

        <div v-if="!tax" class="flex items-center lg:justify-center gap-3 p-3 lg:p-4 text-sm text-gray-500">
            <span class="pi pi-exclamation-triangle text-amber-500"></span>
            <span class="text-xs">Save the income information to calculate tax liability</span>
        </div>

        <div v-else class="p-3 lg:p-4 text-sm">
            <div class="grid grid-cols-10 border-b border-gray-100 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                <div class="col-span-2 lg:col-span-2">Slab</div>
                <div class="col-span-4 lg:col-span-3">Taxable Amount</div>
                <div class="col-span-1 lg:col-span-2">Rate</div>
                <div class="col-span-3 lg:col-span-3 text-right">Tax Amount</div>
            </div>

            <div v-for="(breakdown, index) in tax.breakdown" :key="breakdown.income_from" class="grid grid-cols-10 items-center border-b border-gray-100 py-3 last:border-b-0 gap-x-1">
                <div class="col-span-2 lg:col-span-2">
                    <span class="inline-flex rounded-md bg-gray-100 px-2 py-1 text-[10px] lg:text-xs font-semibold text-gray-600">
                        {{ index === 0 ? 'First' : index === tax.breakdown.length - 1 ? 'Remaining' : 'Next' }}
                    </span>
                </div>
                <div class="col-span-4 lg:col-span-3 font-medium text-gray-700">{{ formatCurrency(breakdown.taxable_amount) }} <span class="hidden lg:inline">BDT</span></div>
                <div class="col-span-1 lg:col-span-2">
                    <span class="font-semibold text-primary">{{ breakdown.tax_percent }}%</span>
                </div>
                <div class="col-span-3 lg:col-span-3 text-right font-semibold text-gray-800">{{ formatCurrency(breakdown.tax_amount) }} <span class="hidden lg:inline">BDT</span></div>
            </div>

            <div class="mt-3 flex flex-col lg:flex-row lg:items-center lg:justify-between rounded-xl bg-primary/5 p-4">
                <div>
                    <div class="text-xs font-semibold uppercase tracking-wider text-primary">Total Income Tax Liability</div>
                    <div class="mt-0.5 text-xs text-gray-500">Gross tax before rebate and tax deductions</div>
                </div>
                <div class="text-xl font-semibold text-primary mt-2 lg:mt-0">{{ formatCurrency(tax.tax_liability) }} <span class="text-xs font-medium text-gray-400">BDT</span></div>
            </div>
        </div>
    </div>
</template>
