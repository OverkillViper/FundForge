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
                <div class="text-xl lg:text-3xl text-white font-light">
                    {{ value }}
                </div>
                <div class="text-xs lg:text-md text-gray-400">{{ prefix }}</div>
            </div>
            <div class="size-8 bg-primary-100 text-white flex items-center justify-center rounded-lg">
                <span class="text-md!" :class="icon"></span>
            </div>
        </div>
        <div class="text-gray-200 text-xs lg:text-sm">{{ title }}</div>
    </div>
</template>