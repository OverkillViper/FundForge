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
const mobileSidebarOpen = ref(false);

watch(collapsed, (value) => {
    document.cookie = `sidebar_collapsed=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
});

const toggleSidebar = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
        collapsed.value = !collapsed.value;
    } else {
        mobileSidebarOpen.value = !mobileSidebarOpen.value;
    }
};

const closeMobileSidebar = () => {
    mobileSidebarOpen.value = false;
};

const page = usePage();
const toast = useToast();

watch(
    () => page.props.flash,
    (flash: any) => {
        if (!flash) return;

        if (flash.success) {
            toast.add({ severity: 'success', summary: 'Success', detail: flash.success, life: 3000 });
        }

        if (flash.error) {
            toast.add({ severity: 'error', summary: 'Error', detail: flash.error, life: 4000 });
        }

        if (flash.info) {
            toast.add({ severity: 'info', summary: 'Information', detail: flash.info, life: 3000 });
        }

        if (flash.warning) {
            toast.add({ severity: 'warn', summary: 'Warning', detail: flash.warning, life: 4000 });
        }
    },
    { deep: true },
);
</script>

<template>
    <Head :title="pageTitle" />

    <div class="flex min-h-screen w-full flex-col overflow-x-hidden p-0 lg:h-screen lg:min-w-screen lg:w-screen lg:overflow-hidden lg:p-4">
        <div class="fixed lg:relative z-60 shrink-0 p-3 lg:p-0 bg-white lg:bg-transparent">
            <Header
                :collapsed="collapsed"
                :mobile-sidebar-open="mobileSidebarOpen"
                @toggle-sidebar="toggleSidebar"
            />
        </div>

        <div class="relative flex min-h-0 flex-1 gap-x-6 mt-15 lg:mt-2 lg:mx-0">
            <!-- Desktop sidebar -->
            <aside class="hidden shrink-0 lg:flex">
                <Sidebar :collapsed="collapsed" />
            </aside>

            <!-- Mobile sidebar overlay -->
            <template v-if="mobileSidebarOpen">
                <button
                    type="button"
                    aria-label="Close navigation"
                    class="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    @click="closeMobileSidebar"
                ></button>

                <aside class="fixed bottom-0 left-0 top-15 z-40 w-80 overflow-y-auto border border-gray-100 bg-white px-6 py-3 shadow-xl lg:hidden">
                    <Sidebar :collapsed="false" @close="closeMobileSidebar" />
                </aside>
            </template>

            <!-- Page content -->
            <div
                class="flex min-w-0 flex-1 flex-col lg:rounded-xl px-6 py-4 sm:p-5 lg:min-h-0"
                :class="{ 'bg-white shadow': !hideBackground }"
            >
                <!-- Page header -->
                <div class="mb-4 flex items-start justify-between gap-3">
                    <div class="flex min-w-0 flex-col">
                        <div class="text-md lg:text-xl text-gray-700">{{ pageTitle }}</div>

                        <Breadcrumb
                            v-if="page.url !== '/dashboard'"
                            :model="breadcrumbs"
                            class="mt-1 p-0! text-xs"
                            :pt="{
                                list: { class: 'gap-2!' },
                                separator: { class: 'mx-0!' }
                            }"
                        >
                            <template #item="{ item }">
                                <Link
                                    v-if="item.url"
                                    :href="item.url"
                                    class="m-0 text-xs text-gray-500 transition-colors hover:text-primary"
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

                    <div class="flex shrink-0 items-center gap-x-2 app-toolbar">
                        <slot name="toolbar" />
                    </div>
                </div>

                <div class="min-h-0 flex-1">
                    <slot name="content" />
                </div>
            </div>
        </div>

        <Toast position="bottom-right" />
    </div>
</template>