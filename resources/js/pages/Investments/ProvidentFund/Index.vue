<script lang="ts" setup>
import Button from 'primevue/button';
import { router } from '@inertiajs/vue3';
import { formatCurrency } from '@/lib/formatters.js';

interface ProvidentFund {
    id: number;
    user_id: number;
    start_date: Date;
    created_at: string;
    updated_at: string;
}

const props = defineProps<{
    providentFund: ProvidentFund;
}>();
</script>

<template>
    <Head title="Provident Fund" />

    <div class="flex h-full flex-col p-6">
        <div class="flex items-center">
            <div class="flex flex-1 flex-col">
                <span class="text-xl font-medium">Provident Fund</span>
                <span class="font-crique text-xs text-gray-600">
                    Manage your provident fund
                </span>
            </div>

            <Button
                label="Create Provident Fund"
                icon="pi pi-plus"
                size="small"
                @click=""
            />
        </div>

        <div class="mt-6 flex h-full flex-col">
            <div class="flex flex-col">
                <div class="mb-4 grid grid-cols-3 gap-x-6 border-b pb-4">
                    <div class="flex rounded-lg bg-white p-3">
                        <div
                            class="flex h-8 w-8 items-center justify-center rounded-md bg-primary"
                        >
                            <i class="icon-landmark text-lgl! text-white" />
                        </div>
                        <div class="flex flex-col gap-y-1 p-1 px-2">
                            <div class="text-sm text-gray-500">
                                Total Employee Contributions
                            </div>
                            <div class="text-xl font-medium">
                                0 <span class="text-xs text-gray-500">BDT</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-4">
                    <div
                        v-if="providentFund"
                        class="col-span-3 flex flex-col items-center justify-center py-16 text-center"
                    >
                        <i
                            class="pi pi-exclamation-triangle text-3xl text-gray-400"
                        ></i>

                        <div class="mt-3 font-medium text-gray-700">
                            No Provident Fund yet
                        </div>

                        <div class="mt-1 text-sm text-gray-500">
                            Your Provident Fund record will appear here.
                        </div>

                        <Button
                            label="Create Record"
                            icon="pi pi-plus"
                            size="small"
                            severity="secondary"
                            class="mt-4"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
