<script setup lang="ts">
import Sidebar from '@/layouts/Sidebar.vue';
import Toast from 'primevue/toast';
import { usePage, Link, Head } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import Breadcrumb from 'primevue/breadcrumb';
import { useBreadcrumbs } from '@/composables/useBreadcrumbs';
import Header from '@/pages/Header.vue';
import { useToast } from 'primevue/usetoast';

const props = withDefaults(defineProps<{
    pageTitle?: string;
    hideBackground?: boolean;
}>(), {
    hideBackground: false,
});

const { breadcrumbs } = useBreadcrumbs();

const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
};

const collapsed = ref(getCookie('sidebar_collapsed') === 'true');

watch(collapsed, (value) => {
    document.cookie = `sidebar_collapsed=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
});

const toggleSidebar = () => {
    collapsed.value = !collapsed.value;
};

const page = usePage();
const toast = useToast();

watch(
    () => page.props.flash,
    (flash: any) => {
        if (!flash) {
            return;
        }

        if (flash.success) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: flash.success,
                life: 3000,
            });
        }

        if (flash.error) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: flash.error,
                life: 4000,
            });
        }

        if (flash.info) {
            toast.add({
                severity: 'info',
                summary: 'Information',
                detail: flash.info,
                life: 3000,
            });
        }

        if (flash.warning) {
            toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: flash.warning,
                life: 4000,
            });
        }
    },
    { deep: true },
);
</script>

<template>
    <Head :title="pageTitle" />

    <div class="flex flex-col min-h-screen h-screen min-w-screen w-screen overflow-hidden p-4">
        <Header
            :collapsed="collapsed"
            @toggle-sidebar="toggleSidebar"
        />

        <div class="flex flex-1 gap-x-6 mt-2">
            <Sidebar :collapsed="collapsed" />

            <div class="rounded-xl flex-1 flex flex-col p-5" :class="{'bg-white shadow' : !hideBackground }">
                <!-- Page header -->
                <div class="flex items-start justify-between mb-4">
                    <div class="flex flex-col">
                        <div class="text-xl text-gray-700">{{ pageTitle }}</div>

                        <Breadcrumb
                            v-if="page.url !== '/dashboard'"
                            :model="breadcrumbs"
                            class="text-xs p-0! mt-1"
                            :pt="{
                                list: { class: 'gap-2!' },
                                separator: { class: 'mx-0!' }
                            }"
                        >
                            <template #item="{ item }">
                                <Link
                                    v-if="item.url"
                                    :href="item.url"
                                    class="text-xs text-gray-500 hover:text-primary transition-colors m-0"
                                >
                                    <i v-if="item.icon" :class="item.icon"></i>
                                    <span v-else>{{ item.label }}</span>
                                </Link>

                                <span v-else class="text-xs text-gray-400">
                                    <i v-if="item.icon" :class="item.icon"></i>
                                    <span v-else>{{ item.label }}</span>
                                </span>
                            </template>

                            <template #separator>/</template>
                        </Breadcrumb>
                    </div>

                    <div class="flex items-center gap-x-2">
                        <slot name="toolbar" />
                    </div>
                </div>

                <!-- Page content -->
                <div class="flex-1 min-h-0">
                    <slot name="content" />
                </div>
            </div>
        </div>

        <Toast position="bottom-right" />
    </div>
</template>