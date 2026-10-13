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

    <div class="relative min-h-screen w-screen overflow-x-hidden p-4 lg:flex lg:h-screen lg:gap-x-6 lg:overflow-hidden">
        <!-- Green background / branding -->
        <div class="bg absolute inset-0 flex justify-center rounded-lg lg:relative lg:inset-auto lg:h-full lg:w-1/2 overflow-hidden lg:flex lg:flex-col gap-x-4">
            <div class="flex justify-center mt-9 lg:pt-8 lg:mt-10 lg:flex-1 lg:justify-end lg:-me-30">
                <img src="/logo.png" alt="FundForge Logo" class="img size-12 shrink-0 object-contain lg:size-80" />
            </div>

            <div class="lg:m-6 select-none font-berlin text-2xl text-white sm:text-5xl lg:m-15 lg:text-7xl">
                <div class="flex lg:flex-col mt-8 lg:mt-0">
                    <div>Fund</div>
                    <div>Forge</div>
                </div>
                

                <div class="mt-1 lg:mt-4 flex font-crique text-base capitalize sm:text-lg lg:text-xl">
                    Manage your funds
                </div>
            </div>
        </div>

        <!-- Form foreground -->
        <div class="relative z-10 flex min-h-[calc(100vh-2rem)] w-full items-center justify-center py-6 lg:min-h-0 lg:h-full lg:w-1/2 lg:flex-none lg:py-0">
            <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl sm:p-6 lg:w-1/2 lg:max-w-none lg:p-12 lg:shadow-sm">
                <slot />
            </div>
        </div>
    </div>
</template>