<script lang="ts" setup>
import { router } from '@inertiajs/vue3';
import Button from 'primevue/button';
import { index } from '@/routes/obligations';

interface Obligation {
    lent: number;
    borrowed: number;
}

const props = defineProps<{
    obligations: Obligation;
}>();

const formattedAmount = (amount: number) => amount.toLocaleString('en-IN');
</script>

<template>
    <div class="rounded-xl border border-gray-200 bg-white p-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <div class="text-sm font-semibold text-gray-700">Obligations</div>
                <div class="mt-0.5 text-[10px] text-gray-400">
                    Your outstanding lending and borrowing
                </div>
            </div>

            <Button
                @click="router.visit(index.url())"
                label="View All"
                icon="pi pi-arrow-up-right"
                size="small"
                severity="secondary"
                rounded
                outlined
                class="text-[10px]!"
            />
        </div>

        <!-- Summary -->
        <div class="mt-4 grid grid-cols-2 gap-3">
            <!-- Lent -->
            <div class="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div class="flex items-center gap-2">
                    <div class="flex size-5 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                        <i class="pi pi-arrow-up-right text-[10px]"></i>
                    </div>

                    <span class="text-[10px] font-medium text-gray-500">
                        Total Lent
                    </span>
                </div>

                <div class="mt-2 text-base font-semibold text-gray-700">
                    {{ formattedAmount(props.obligations.lent) }}
                    <span class="text-[9px] font-medium text-gray-400">BDT</span>
                </div>
            </div>

            <!-- Borrowed -->
            <div class="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div class="flex items-center gap-2">
                    <div class="flex size-5 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                        <i class="pi pi-arrow-down-left text-[10px]"></i>
                    </div>

                    <span class="text-[10px] font-medium text-gray-500">
                        Total Borrowed
                    </span>
                </div>

                <div class="mt-2 text-base font-semibold text-gray-700">
                    {{ formattedAmount(props.obligations.borrowed) }}
                    <span class="text-[9px] font-medium text-gray-400">BDT</span>
                </div>
            </div>
        </div>
    </div>
</template>