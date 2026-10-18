<script setup lang="ts">
import Sidebar from '@/layouts/Sidebar.vue';
import PageLoadingSkeleton from './PageLoadingSkeleton.vue';
import Toast from 'primevue/toast';
import { usePage, Link, Head, router } from '@inertiajs/vue3';
import { ref, watch, onUnmounted } from 'vue';
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
const isNavigating = ref(false);
const navigationSkeletonType = ref<'grid' | 'list' | 'mixed'>('mixed');
let navigationTimer: ReturnType<typeof setTimeout> | null = null;

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

const matchesPath = (path: string, base: string) => path === base || path.startsWith(`${base}/`);

const getDestinationSkeleton = (url: URL): { enabled: boolean; type: 'grid' | 'list' | 'mixed' } => {
    const path = url.pathname.replace(/\/+$/, '') || '/';

    // Never show skeletons for Settings pages.
    if (matchesPath(path, '/settings')) return { enabled: false, type: 'mixed' };
    if (matchesPath(path, '/transactions')) return { enabled: false, type: 'mixed' };

    // Specific nested routes must be checked before their parent resource routes.
    if (path === '/transactions/categories')          return { enabled: true, type: 'grid'  };
    if (path === '/investments/savings-certificates') return { enabled: true, type: 'mixed' };
    if (path === '/investments/dps')                  return { enabled: true, type: 'mixed' };
    if (path === '/investments/provident-fund')       return { enabled: true, type: 'mixed' };
    if (path === '/income-taxes/salary-tds')          return { enabled: true, type: 'list'  };

    const routes: [string, 'grid' | 'list' | 'mixed'][] = [
        ['/dashboard', 'mixed'],
        ['/accounts', 'grid'],
        ['/budgets', 'grid'],
        ['/transfers', 'list'],
        ['/investments', 'grid'],
        ['/obligations', 'list'],
        ['/income-taxes', 'list'],
    ];

    const match = routes.find(([base]) => matchesPath(path, base));

    return match ? { enabled: true, type: match[1] } : { enabled: false, type: 'mixed' };
};

const removeStartListener = router.on('start', (event) => {
    if (navigationTimer) clearTimeout(navigationTimer);
    navigationTimer = null;
    isNavigating.value = false;

    if (event.detail.visit.method.toLowerCase() !== 'get') return;

    const destination = new URL(event.detail.visit.url, window.location.origin);
    const policy = getDestinationSkeleton(destination);   

    if (!policy.enabled) return;

    navigationSkeletonType.value = policy.type;
    navigationTimer = setTimeout(() => {
        isNavigating.value = true;
    }, 150);
});

const removeFinishListener = router.on('finish', () => {
    if (navigationTimer) clearTimeout(navigationTimer);
    navigationTimer = null;
    isNavigating.value = false;
});

onUnmounted(() => {
    if (navigationTimer) clearTimeout(navigationTimer);
    removeStartListener();
    removeFinishListener();
});

const page = usePage();
const toast = useToast();

watch(
    () => page.props.flash,
    (flash: any) => {
        if (!flash) return;

        if (flash.success) toast.add({ severity: 'success', summary: 'Success', detail: flash.success, life: 3000 });
        if (flash.error) toast.add({ severity: 'error', summary: 'Error', detail: flash.error, life: 4000 });
        if (flash.info) toast.add({ severity: 'info', summary: 'Information', detail: flash.info, life: 3000 });
        if (flash.warning) toast.add({ severity: 'warn', summary: 'Warning', detail: flash.warning, life: 4000 });
    },
    { deep: true },
);
</script>

<template>
    <Head :title="pageTitle" />

    <div class="flex min-h-screen w-full flex-col overflow-x-hidden p-0 lg:h-screen lg:min-w-screen lg:w-screen lg:overflow-hidden lg:p-4">
        <div class="fixed z-60 w-full shrink-0 bg-white p-3 lg:relative lg:bg-transparent lg:p-0">
            <Header :collapsed="collapsed" :mobile-sidebar-open="mobileSidebarOpen" @toggle-sidebar="toggleSidebar" />
        </div>

        <div class="relative mt-15 flex min-h-0 flex-1 gap-x-6 lg:mx-0 lg:mt-2">
            <!-- Desktop sidebar -->
            <aside class="hidden shrink-0 lg:flex">
                <Sidebar :collapsed="collapsed" />
            </aside>

            <!-- Mobile sidebar overlay -->
            <Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <button v-if="mobileSidebarOpen" type="button" aria-label="Close navigation" class="fixed inset-0 z-40 bg-black/40 lg:hidden" @click="closeMobileSidebar"></button>
            </Transition>

            <!-- Mobile sidebar -->
            <Transition enter-active-class="transition-transform duration-300 ease-out" enter-from-class="-translate-x-full" enter-to-class="translate-x-0" leave-active-class="transition-transform duration-250 ease-in" leave-from-class="translate-x-0" leave-to-class="-translate-x-full">
                <aside v-if="mobileSidebarOpen" class="fixed bottom-0 left-0 top-15 z-40 w-80 overflow-y-auto border border-gray-100 bg-white px-6 py-3 shadow-xl lg:hidden">
                    <Sidebar :collapsed="false" @close="closeMobileSidebar" />
                </aside>
            </Transition>

            <!-- Page content -->
            <div class="flex min-w-0 flex-1 flex-col px-6 py-4 lg:min-h-0 lg:rounded-xl sm:p-5" :class="{ 'bg-white shadow': !hideBackground }">
                <!-- Page header -->
                <div class="mb-4 flex flex-col gap-y-1 lg:gap-y-0">
                    <div class="flex min-w-0 items-center justify-between">
                        <div class="text-md text-gray-700 lg:text-xl">{{ pageTitle }}</div>
                        <div class="app-toolbar flex shrink-0 items-center gap-x-2">
                            <slot name="toolbar" />
                        </div>
                    </div>

                    <Breadcrumb v-if="page.url !== '/dashboard'" :model="breadcrumbs" class="p-0! text-xs" :pt="{ list: { class: 'gap-2!' }, separator: { class: 'mx-0!' } }">
                        <template #item="{ item }">
                            <Link v-if="item.url" :href="item.url" class="m-0 truncate text-xs text-gray-500 transition-colors hover:text-primary">
                                <i v-if="item.icon" :class="item.icon"></i>
                                <span v-else>{{ item.label }}</span>
                            </Link>
                            <span v-else class="truncate text-xs text-gray-400">
                                <i v-if="item.icon" :class="item.icon"></i>
                                <span v-else>{{ item.label }}</span>
                            </span>
                        </template>
                        <template #separator>/</template>
                    </Breadcrumb>
                </div>

                <!-- Route loading skeleton / page content -->
                <div class="min-h-0 flex-1">
                    <Transition mode="out-in" enter-active-class="transition-opacity duration-150 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                        <div v-if="isNavigating" key="skeleton" class="h-full min-h-48">
                            <PageLoadingSkeleton :type="navigationSkeletonType" />
                        </div>
                        <div v-else key="content" class="h-full min-h-0">
                            <slot name="content" />
                        </div>
                    </Transition>
                </div>
            </div>
        </div>

        <Toast position="bottom-right" />
    </div>
</template>