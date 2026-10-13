<script lang="ts" setup>
import { Link, usePage, router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import { navigation, type NavigationItem } from '@/config/navigation';
import Button from 'primevue/button';
import { create } from '@/routes/transactions';

const props = defineProps<{
    collapsed: boolean;
}>();

const emit = defineEmits<{
    close: [];
}>();

const page = usePage();
const sidebarItems = navigation;
const expandedItems = ref<string[]>([]);

const isActive = (item: NavigationItem): boolean => page.url === item.href;

const hasActiveChild = (item: NavigationItem): boolean => {
    return item.children?.some(child => isActive(child) || hasActiveChild(child)) ?? false;
};

const isParentActive = (item: NavigationItem): boolean => isActive(item) || hasActiveChild(item);

const isExpanded = (item: NavigationItem): boolean => expandedItems.value.includes(item.href);

const toggleItem = (item: NavigationItem) => {
    if (!item.children?.length) return;

    if (isExpanded(item)) {
        expandedItems.value = expandedItems.value.filter(href => href !== item.href);
    } else {
        expandedItems.value.push(item.href);
    }
};

const initializeExpandedItems = () => {
    sidebarItems.forEach(section => {
        section.items.forEach(item => {
            if (item.children?.length && !isExpanded(item)) {
                expandedItems.value.push(item.href);
            }
        });
    });
};

initializeExpandedItems();

const showChildren = computed(() => !props.collapsed);
</script>

<template>
    <div class="flex min-w-0 shrink-0 flex-col overflow-hidden transition-all duration-300 ease-in-out" :class="collapsed ? 'w-8' : 'w-64'">
        <Button
            @click="() => { emit('close'); router.visit(create.url()); }"
            label="New Transaction"
            icon="pi pi-plus"
            :icon-only="collapsed"
            size="small"
            class="my-4"
            :class="{ 'max-h-8': collapsed }"
        />

        <div
            v-for="(item, index) in sidebarItems"
            :key="item.section"
            class="flex flex-col"
            :class="[collapsed ? 'mt-0' : (index === 0 ? 'mt-1' : 'mt-2'), { 'flex-1': index === sidebarItems.length - 2 }]"
        >
            <div
                class="mb-0.5 whitespace-nowrap ps-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 transition-all duration-300"
                :class="collapsed ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'"
            >
                {{ item.section }}
            </div>

            <template v-for="i in item.items" :key="i.href">
                <div class="relative">
                    <Link
                        :href="i.href"
                        @click="emit('close')"
                        class="group flex min-w-full items-center overflow-hidden rounded-md border border-transparent py-1 text-[13px] font-semibold text-gray-500 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50"
                        :method="i.href === '/logout' ? 'POST' : 'GET'"
                        :class="[collapsed ? 'justify-center' : 'gap-x-1.5', !collapsed && isActive(i) ? 'bg-gray-100 text-primary' : '']"
                    >
                        <div v-if="!collapsed" class="h-5 w-0.5 shrink-0 rounded-r-full" :class="isActive(i) ? 'bg-primary' : 'bg-transparent'"></div>

                        <div
                            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-all duration-200"
                            :class="isActive(i) ? (collapsed ? 'text-primary' : 'bg-primary text-white') : (isParentActive(i) && !collapsed ? 'text-primary' : '')"
                        >
                            <span class="pi text-sm" :class="i.icon"></span>
                        </div>

                        <span class="ms-1.5 w-auto overflow-hidden whitespace-nowrap transition-all duration-300" :class="collapsed ? 'ms-0 w-0 opacity-0' : 'opacity-100'">
                            {{ i.name }}
                        </span>

                        <button
                            v-if="i.children?.length && !collapsed"
                            type="button"
                            class="ml-auto mr-1 flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-colors duration-200 hover:text-gray-700"
                            @click.prevent.stop="toggleItem(i)"
                        >
                            <span class="pi pi-chevron-right text-[9px] transition-transform duration-200" :class="isExpanded(i) ? 'rotate-90' : ''"></span>
                        </button>
                    </Link>

                    <div
                        v-if="i.children?.length"
                        class="overflow-hidden transition-all duration-300"
                        :class="showChildren && isExpanded(i) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
                    >
                        <Link
                            v-for="child in i.children"
                            :key="child.href"
                            :href="child.href"
                            @click="emit('close')"
                            class="group flex items-center rounded-md border border-transparent py-1 pe-2 ps-10 text-[13px] font-medium text-gray-500 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50"
                            :class="isActive(child) ? 'bg-gray-50 text-primary' : ''"
                        >
                            <div class="flex h-6 w-6 shrink-0 items-center justify-center">
                                <span class="pi text-[11px]" :class="child.icon"></span>
                            </div>

                            <span class="ms-1.5 whitespace-nowrap">{{ child.name }}</span>
                        </Link>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>