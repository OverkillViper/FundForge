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
        <div class="flex items-center gap-3 border-b border-gray-100 p-3 lg:p-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span class="pi pi-minus-circle text-sm"></span>
            </div>
            <div>
                <div class="text-sm font-semibold text-gray-900">Salary Exemption</div>
                <div class="mt-0.5 text-xs text-gray-500">Applicable exemption from employment income</div>
            </div>
        </div>

        <div v-if="!totalIncome" class="flex items-center lg:justify-center gap-3 p-3 lg:p-4 text-sm text-gray-500">
            <span class="pi pi-exclamation-triangle text-amber-500"></span>
            <span class="text-xs">Save the income information to calculate exemption.</span>
        </div>

        <div v-else class="p-3 lg:p-4 text-sm">
            <div class="flex">
                <div class="w-2/3 lg:w-4/5 flex flex-col lg:grid lg:grid-cols-2 gap-1 lg:gap-2">
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Particulars</div>
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 hidden lg:block">Calculation</div>
                    <div class="flex items-center font-medium text-gray-700 gap-x-1">
                        <div class="size-4 bg-gray-200 flex items-center justify-center rounded-sm font-semibold text-[10px]">A</div>
                        <div>1/3 of total income from salary</div>
                    </div>
                    <div class="text-gray-500 text-xs lg:text-sm">{{ formatCurrency(totalIncome.salary) }} / 3</div>
                </div>
                <div class="w-1/3 lg:w-1/5 lg:space-y-2 space-y-1">
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 text-right">Amount</div>
                    <div class="text-right font-medium text-gray-800">{{ formatCurrency(totalIncome.salary_exemption) }} BDT</div>
                </div>
            </div>

            <div class="py-2 text-xs font-medium text-gray-400">OR</div>

            <div class="flex justify-between items-center">
                <div class="flex items-center font-medium text-gray-700 gap-x-1">
                        <div class="size-4 bg-gray-200 flex items-center justify-center rounded-sm font-semibold text-[10px]">B</div>
                        <div>5,00,000 BDT</div>
                    </div>
                <span class="text-right font-medium text-gray-800">5,00,000 BDT</span>
            </div>

            <div class="mt-4 grid grid-cols-5 items-center rounded-lg bg-gray-50 px-3 py-3">
                <div class="col-span-3 lg:col-span-2 font-semibold text-gray-800 flex items-center gap-x-1">Lower of 
                    <div class="size-4 bg-gray-200 flex items-center justify-center rounded-sm font-semibold text-[10px]">A</div>
                    &
                    <div class="size-4 bg-gray-200 flex items-center justify-center rounded-sm font-semibold text-[10px]">B</div>
                </div>
                <div class="order-3 lg:order-2 col-span-3 lg:col-span-2 text-gray-500 text-xs lg:text-sm">{{ totalIncome.salary_exemption < 500000 ? '1/3 of total income from salary' : '5,00,000 BDT' }}</div>
                <div class="order-2 lg:order-3 col-span-2 lg:col-span-1 text-right font-bold text-gray-900">{{ formatCurrency(totalIncome.salary_exemption) }} BDT</div>
            </div>
        </div>
    </div>
</template>
