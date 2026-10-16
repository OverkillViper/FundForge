<script lang="ts" setup>
import { formatCurrency } from '@/lib/formatters';
import { ref } from 'vue';

interface FinalTax {
    tax_liability: number;
    tax_rebate: number;
    salary_tds: number;
    savings_certificate_tds: number;
    bank_tds: number;
    total_tds: number;
    final_tax: number;
    discount_amount: number;
    final_tax_after_discount: number;
    tax_payable: number;
    tax_refundable: number;
}

const props = defineProps<{
    finalTax: FinalTax | null;
    toggleDiscount: boolean;
}>();
</script>

<template>
    <div class="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div class="flex items-center gap-3 border-b border-gray-100 p-3 lg:p-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span class="pi pi-file-check text-sm"></span>
            </div>
            <div>
                <div class="text-sm font-semibold text-gray-900">Income Tax Payable</div>
                <div class="mt-0.5 text-xs text-gray-500">Final tax position after rebate, TDS and applicable discount</div>
            </div>
        </div>

        <div v-if="!finalTax" class="flex items-center lg:justify-center gap-3 p-3 lg:p-4 text-sm text-gray-500">
            <span class="pi pi-exclamation-triangle text-amber-500"></span>
            <span class="text-xs">Save the income information to calculate final tax.</span>
        </div>

        <div v-else class="p-3 lg:p-4 text-sm">
            <div class="grid grid-cols-5 border-b border-gray-100 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                <div class="col-span-4">Particulars</div>
                <div class="text-right">Amount</div>
            </div>

            <div class="flex justify-between items-center border-b border-gray-100 py-1 lg:py-3">
                <div class="font-medium text-gray-700">Total Income Tax Liability</div>
                <div class="text-right font-medium text-gray-800">{{ formatCurrency(finalTax.tax_liability) }} BDT</div>
            </div>

            <div class="flex justify-between items-center border-b border-gray-100 py-1 lg:py-3">
                <div class="font-medium text-gray-700">Tax Rebate</div>
                <div class="text-right font-medium text-emerald-600">− {{ formatCurrency(finalTax.tax_rebate) }} BDT</div>
            </div>

            <div class="flex justify-between items-center border-b border-gray-100 py-1 lg:py-3">
                <div class="font-medium text-gray-700">Tax Deducted at Source</div>
                <div class="text-right font-medium text-gray-800">{{ formatCurrency(finalTax.total_tds) }} BDT</div>
            </div>

            <div class="space-y-1 border-b border-gray-100 py-1 lg:py-3 pl-4">
                <div class="flex justify-between items-center">
                    <div class="text-gray-500">Salary TDS</div>
                    <div class="text-right text-gray-600">{{ formatCurrency(finalTax.salary_tds) }} BDT</div>
                </div>
                <div class="flex justify-between items-center">
                    <div class="text-gray-500">Savings Certificate TDS</div>
                    <div class="text-right text-gray-600">{{ formatCurrency(finalTax.savings_certificate_tds) }} BDT</div>
                </div>
                <div class="flex justify-between items-center">
                    <div class="text-gray-500">Bank TDS</div>
                    <div class="text-right text-gray-600">{{ formatCurrency(finalTax.bank_tds) }} BDT</div>
                </div>
            </div>

            <div v-if="toggleDiscount" class="flex justify-between items-center border-b border-gray-100 py-1 lg:py-3">
                <div class="w-1/2 font-medium text-gray-700">5% Discount if submitted before September</div>
                <div class="w-1/2 text-right font-medium text-emerald-600">− {{ formatCurrency(finalTax.discount_amount) }} BDT</div>
            </div>

            <div class="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between rounded-xl p-4" :class="finalTax.tax_refundable === 0 ? 'bg-primary/5' : 'bg-emerald-50'">
                <div>
                    <div class="text-xs font-semibold uppercase tracking-wider" :class="finalTax.tax_refundable === 0 ? 'text-primary' : 'text-emerald-700'">
                        {{ finalTax.tax_refundable === 0 ? 'Tax Payable' : 'Tax Refundable' }}
                    </div>
                    <div class="mt-1 text-xs" :class="finalTax.tax_refundable === 0 ? 'text-gray-500' : 'text-emerald-600'">
                        {{ toggleDiscount ? 'After applicable 5% discount' : 'Final calculated tax position' }}
                    </div>
                </div>

                <div class="text-xl font-semibold mt-2 lg:mt-0" :class="finalTax.tax_refundable === 0 ? 'text-primary' : 'text-emerald-700'">
                    {{ toggleDiscount ? formatCurrency(finalTax.final_tax_after_discount) : formatCurrency(finalTax.final_tax) }}
                    <span class="text-xs font-medium text-gray-400">BDT</span>
                </div>
            </div>
        </div>
    </div>
</template>
