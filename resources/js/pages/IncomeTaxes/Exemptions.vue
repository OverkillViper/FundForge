<script lang="ts" setup>
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
</script>

<template>
    <div class="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span class="pi pi-minus-circle text-sm"></span>
            </div>
            <div>
                <div class="text-sm font-semibold text-gray-900">Salary Exemption</div>
                <div class="mt-0.5 text-xs text-gray-500">Applicable exemption from employment income</div>
            </div>
        </div>

        <div v-if="!totalIncome" class="flex items-center justify-center gap-3 px-5 py-8 text-sm text-gray-500">
            <span class="pi pi-exclamation-triangle text-amber-500"></span>
            <span>Save the income tax information to calculate total income.</span>
        </div>

        <div v-else class="p-5 text-sm">
            <div class="grid grid-cols-5 border-b border-gray-100 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                <div class="col-span-2">Particulars</div>
                <div class="col-span-2">Calculation</div>
                <div class="text-right">Amount</div>
            </div>

            <div class="grid grid-cols-5 items-center border-b border-gray-100 py-3">
                <div class="col-span-2 font-medium text-gray-700">(a) 1/3 of total income from salary</div>
                <div class="col-span-2 text-gray-500">{{ formatCurrency(totalIncome.salary) }} / 3</div>
                <div class="text-right font-medium text-gray-800">{{ formatCurrency(totalIncome.salary_exemption) }} BDT</div>
            </div>

            <div class="py-2 text-xs font-medium text-gray-400">OR</div>

            <div class="grid grid-cols-5 items-center border-b border-gray-100 py-3">
                <div class="col-span-4 font-medium text-gray-700">(b) 5,00,000 BDT</div>
                <div class="text-right font-medium text-gray-800">5,00,000 BDT</div>
            </div>

            <div class="mt-2 grid grid-cols-5 items-center rounded-lg bg-gray-50 px-3 py-3">
                <div class="col-span-2 font-semibold text-gray-800">Lower of (a) & (b)</div>
                <div class="col-span-2 text-gray-500">{{ totalIncome.salary_exemption < 500000 ? '1/3 of total income from salary' : '5,00,000 BDT' }}</div>
                <div class="text-right font-bold text-gray-900">{{ formatCurrency(totalIncome.salary_exemption) }} BDT</div>
            </div>
        </div>
    </div>
</template>
