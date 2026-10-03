<script setup lang="ts">
import { ref } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';

const collapsed = ref(false);
const page = usePage();

const toggleSidebar = () => {
    collapsed.value = !collapsed.value;
};

const sidebarItems = [
    { name: 'Overview', icon: 'pi-th-large', href: '/dashboard' },
    { name: 'Transactions', icon: 'pi-money-bill', href: '/transactions' },
    {
        name: 'Transfers',
        icon: 'pi-arrow-right-arrow-left',
        href: '/transfers',
    },
    { name: 'Accounts', icon: 'pi-book', href: '/accounts' },
    { name: 'Plan', icon: 'pi-bullseye', href: '/plan' },
    { name: 'Budget', icon: 'pi-wallet', href: '/budget' },
    { name: 'Settings', icon: 'pi-cog', href: '/settings' },
    { name: 'Investments', icon: 'pi-building-columns', href: '/investments' },
    { name: 'Obligations', icon: 'pi-users', href: '/obligations' },
    { name: 'Reports', icon: 'pi-file', href: '/reports' },
];
</script>

<template>
    <aside
        class="flex h-full flex-col overflow-hidden border-r border-[#e5e5e5] bg-[#f9f9f9] p-4 transition-all duration-300 ease-out select-none"
        :class="collapsed ? 'w-20' : 'w-64'"
    >
        <!-- Header / Logo -->
        <div class="flex h-10 shrink-0 items-center overflow-hidden px-2">
            <!-- Wrap image in a fixed box with locked dimensions -->
            <div
                class="flex h-8 min-h-8 w-8 min-w-8 shrink-0 items-center justify-center"
            >
                <img
                    src="/fund_forge.ico"
                    alt="FundForge Logo"
                    class="h-8 w-8 shrink-0 object-contain"
                />
            </div>

            <div
                class="ml-3 shrink-0 text-lg font-semibold whitespace-nowrap transition-opacity duration-200"
                :class="
                    collapsed
                        ? 'pointer-events-none hidden opacity-0'
                        : 'opacity-100'
                "
            >
                Fund<span class="font-light">Forge</span>
            </div>
        </div>

        <!-- Navigation List -->
        <nav class="mt-8 flex-1">
            <ul class="space-y-2">
                <li v-for="item in sidebarItems" :key="item.name">
                    <Link
                        :href="item.href"
                        class="group flex h-11 items-center rounded-lg px-3 text-gray-700 transition-colors duration-200 hover:bg-gray-200/60 hover:text-gray-900"
                        :class="{
                            'bg-gray-200/80 font-semibold text-gray-900':
                                page.url === item.href,
                        }"
                    >
                        <i
                            :class="[
                                'pi',
                                item.icon,
                                'min-w-6 shrink-0 text-center text-lg',
                            ]"
                        ></i>
                        <span
                            class="ml-3 text-sm font-medium whitespace-nowrap transition-opacity duration-200"
                            :class="
                                collapsed
                                    ? 'pointer-events-none hidden opacity-0'
                                    : 'opacity-100'
                            "
                        >
                            {{ item.name }}
                        </span>
                    </Link>
                </li>
            </ul>
        </nav>

        <!-- Collapse Toggle Button -->
        <div class="border-t border-gray-200 pt-2">
            <button
                @click="toggleSidebar"
                class="flex h-11 w-full items-center rounded-lg px-3 text-gray-700 transition-colors duration-200 hover:bg-gray-200/60 hover:text-gray-900"
            >
                <i
                    :class="[
                        'pi',
                        collapsed
                            ? 'pi-angle-double-right'
                            : 'pi-angle-double-left',
                        'min-w-6 shrink-0 text-center text-lg',
                    ]"
                ></i>
                <span
                    class="ml-3 text-sm font-medium whitespace-nowrap transition-opacity duration-200"
                    :class="
                        collapsed
                            ? 'pointer-events-none hidden opacity-0'
                            : 'opacity-100'
                    "
                >
                    Collapse
                </span>
            </button>
        </div>
    </aside>
</template>
