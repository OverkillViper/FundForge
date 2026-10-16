<script setup lang="ts">
import Skeleton from 'primevue/skeleton';

withDefaults(defineProps<{
    type?: 'grid' | 'list' | 'mixed';
}>(), {
    type: 'mixed',
});
</script>

<template>
    <div v-if="type === 'grid'" class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading page">
        <div v-for="i in 6" :key="i" class="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4">
            <Skeleton width="2.5rem" height="2.5rem" borderRadius="0.5rem" />
            <Skeleton width="65%" height="1rem" />
            <Skeleton width="40%" height="1.5rem" />
            <Skeleton width="85%" height="0.65rem" />
        </div>
    </div>

    <div v-else-if="type === 'list'" class="flex flex-col gap-3" role="status" aria-label="Loading page">
        <div v-for="i in 8" :key="i" class="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
            <Skeleton shape="circle" size="2.5rem" />
            <div class="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton width="45%" height="0.8rem" />
                <Skeleton width="28%" height="0.65rem" />
            </div>
            <Skeleton width="4rem" height="0.9rem" />
        </div>
    </div>

    <div v-else class="flex flex-col gap-4" role="status" aria-label="Loading page">
        <!-- Three larger summary boxes -->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div v-for="i in 3" :key="`card-${i}`" class="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4">
                <Skeleton width="2.25rem" height="2.25rem" borderRadius="0.5rem" />
                <Skeleton width="55%" height="0.8rem" />
                <Skeleton width="70%" height="1.5rem" />
            </div>
        </div>

        <!-- Smaller list rows -->
        <div class="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
            <div class="mb-2 flex items-center justify-between gap-3">
                <Skeleton width="8rem" height="1.1rem" />
                <Skeleton width="5rem" height="2rem" borderRadius="0.5rem" />
            </div>

            <div v-for="i in 6" :key="`row-${i}`" class="flex items-center gap-3 py-1">
                <Skeleton shape="circle" size="2.25rem" />
                <div class="flex min-w-0 flex-1 flex-col gap-2">
                    <Skeleton :width="`${45 + (i % 3) * 10}%`" height="0.8rem" />
                    <Skeleton width="28%" height="0.65rem" />
                </div>
                <Skeleton width="3.5rem" height="0.8rem" />
            </div>
        </div>
    </div>
</template>