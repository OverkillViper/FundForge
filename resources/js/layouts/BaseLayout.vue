<script setup lang="ts">
import Header from '@/pages/Header.vue';
import Toast from 'primevue/toast';
</script>

<template>
    <div class="flex min-h-screen h-screen min-w-screen w-screen overflow-hidden">
        <div class="flex flex-col flex-1">
            <Header />

            <slot />

            <Toast position="bottom-right" />
        </div>
    </div>
</template>