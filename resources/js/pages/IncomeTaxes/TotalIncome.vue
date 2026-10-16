<script setup lang="ts">
import { computed } from 'vue';
import { formatCurrency } from '@/lib/formatters';

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

const props = defineProps<{
    totalIncome: TotalIncome | null;
}>();

const hasWarnings = computed(() => {
    return (props.totalIncome?.warnings?.length ?? 0) > 0;
});
</script>

<template>
    <div class="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div class="flex items-center gap-3 border-b border-gray-100 p-3 lg:p-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span class="pi pi-calculator text-sm"></span>
            </div>
            <div>
                <div class="text-sm font-semibold text-gray-900">Total Taxable Income</div>
                <div class="mt-0.5 text-xs text-gray-500">Income remaining after applicable exemptions</div>
            </div>
        </div>

        <div v-if="!totalIncome" class="flex items-center lg:justify-center gap-3 p-3 lg:p-4 text-sm text-gray-500">
            <span class="pi pi-exclamation-triangle text-amber-500"></span>
            <span class="text-xs">Save the income information to calculate total taxable income.</span>
        </div>

        <div v-else class="p-3 lg:p-4 text-sm">
            <div class="grid grid-cols-5 border-b border-gray-100 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                <div class="col-span-4 lg:col-span-2">Particulars</div>
                <div class="col-span-2 hidden lg:block">Calculation</div>
                <div class="text-right">Amount</div>
            </div>

            <div class="grid grid-cols-5 items-center border-b border-gray-100 py-1 lg:py-3">
                <div class="col-span-3 lg:col-span-2 font-medium text-gray-700">Taxable Income from Salary</div>
                <div class="order-3 lg:order-2 col-span-4 lg:col-span-2 text-gray-500">{{ formatCurrency(totalIncome.salary) }} − {{ formatCurrency(totalIncome.salary_exemption) }}</div>
                <div class="col-span-2 lg:col-span-1 order-2 lg:order-3 text-right font-medium text-gray-800">{{ formatCurrency(totalIncome.taxable_salary) }} BDT</div>
            </div>

            <div class="grid grid-cols-5 items-center border-b border-gray-100 py-1 lg:py-3">
                <div class="col-span-3 lg:col-span-4 font-medium text-gray-700">Income from Bank Accounts</div>
                <div class="col-span-2 lg:col-span-1 text-right font-medium text-gray-800">{{ formatCurrency(totalIncome.bank) }} BDT</div>
            </div>

            <div v-if="totalIncome.savings_certificate_interest" class="grid grid-cols-5 items-center border-b border-gray-100 py-1 lg:py-3">
                <div class="col-span-3 lg:col-span-4 font-medium text-gray-700">Income from Savings Certificate</div>
                <div class="col-span-2 lg:col-span-1 text-right font-medium text-gray-800">{{ formatCurrency(totalIncome.savings_certificate_interest.toString()) }} BDT</div>
            </div>

            <div class="mt-3 flex flex-col lg:flex-row lg:items-center lg:justify-between rounded-xl bg-primary/5 px-4 py-4">
                <div>
                    <div class="text-xs font-semibold uppercase tracking-wider text-primary">Total Taxable Income</div>
                    <div class="mt-0.5 text-xs text-gray-500">Amount used for progressive tax calculation</div>
                </div>
                <div class="text-xl font-semibold text-primary mt-2 lg:mt-0">
                    <template v-if="totalIncome.total !== null">{{ formatCurrency(totalIncome.total.toString()) }} <span class="text-xs font-medium text-gray-400">BDT</span></template>
                    <template v-else>N/A</template>
                </div>
            </div>
        </div>
    </div>
</template>
