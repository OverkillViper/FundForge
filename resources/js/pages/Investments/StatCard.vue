<script lang="ts" setup>
defineProps<{
    icon: string;
    title: string;
    value: number | string;
    prefix: string;
}>();
</script>

<template>
    <div class="rounded-lg bg-primary p-4">
        <div class="flex justify-between">
            <div class="flex mt-4 gap-x-2 items-baseline">
                <div class="text-3xl text-white font-light">
                    {{ value }}
                </div>
                <div class="text-gray-400">{{ prefix }}</div>
            </div>
            <div class="size-8 bg-primary-100 text-white flex items-center justify-center rounded-lg">
                <span class="text-md!" :class="icon"></span>
            </div>
        </div>
        <div class="text-gray-200 text-sm">{{ title }}</div>
    </div>
    <!-- <div class="rounded-2xl border border-gray-200 bg-white p-2 flex items-center gap-3">
        <div class="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <i class="text-lg! text-primary" :class="icon"></i>
        </div>

        <div class="min-w-0">
            <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{{ title }}/div>
                <div class="mt-1 flex items-baseline gap-1.5">
                    <span class="text-lg font-bold text-gray-800">{{ value }}</span>
                    <span class="text-[10px] font-medium text-gray-400">{{ prefix }}</span>
                </div>
            </div>
        </div>
    </div> -->
</template>