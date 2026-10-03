<script setup lang="ts">
import { Head } from '@inertiajs/vue3';

const { title = '', description = '' } = defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<style scoped>
.img {
    filter: drop-shadow(2px 2px 2px rgba(54, 54, 54, 0.5));
}

.bg {
    background: radial-gradient(circle at 15% 20%, #3f8ca1 0%, transparent 35%),
            radial-gradient(circle at 85% 15%, #2f7890 0%, transparent 30%),
            radial-gradient(circle at 70% 85%, #3a879d 0%, transparent 35%),
            #338099;
}
</style>

<template>
    <Head :title="title" />

    <div class="flex min-h-screen h-screen min-w-screen w-screen overflow-hidden p-4 gap-x-6">
        <div class="w-1/2">
            <div class="bg rounded-lg h-full flex flex-col overflow-hidden">
                <div class="flex justify-end -me-30 mt-10 flex-1">
                    <img src="/logo.png" alt="FundForge Logo" class="size-80 object-contain shrink-0 img" />
                </div>
                <div class="font-berlin text-7xl text-white m-15 select-none">
                    <div>Fund</div>
                    <div>Forge</div>

                    <div class="flex font-crique mt-4 text-xl capitalize">
                        Manage your funds
                    </div>
                </div>
            </div>
        </div>
        <div class="w-1/2 h-full flex items-center justify-center">
            <div class="w-1/2 bg-white p-4 rounded-xl shadow-sm">
                <slot />
            </div>  
        </div>
    </div>
</template>
