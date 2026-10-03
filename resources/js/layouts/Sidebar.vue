<script lang="ts" setup>
import { Link, usePage, router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import { navigation, type NavigationItem } from '@/config/navigation';
import Button from 'primevue/button';
import { create } from '@/routes/transactions';

const props = defineProps<{
    collapsed: boolean;
}>();

const page = usePage();
const sidebarItems = navigation;
const expandedItems = ref<string[]>([]);

const isActive = (item: NavigationItem): boolean => {
    return page.url === item.href;
};

const hasActiveChild = (item: NavigationItem): boolean => {
    return item.children?.some(child => isActive(child) || hasActiveChild(child)) ?? false;
};

const isParentActive = (item: NavigationItem): boolean => {
    return isActive(item) || hasActiveChild(item);
};

const isExpanded = (item: NavigationItem): boolean => {
    return expandedItems.value.includes(item.href);
};

const toggleItem = (item: NavigationItem) => {
    if (!item.children?.length) {
        return;
    }

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
    <div class="flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden" :class="collapsed ? 'w-8' : 'w-64'">
        <Button @click="router.visit(create.url())" label="New Transaction" icon="pi pi-plus" :icon-only="collapsed" size="small" class="my-4" :class="{'max-h-8': collapsed}"/>        
        <div v-for="(item, index) in sidebarItems" :key="item.section" class="flex flex-col" :class="[collapsed ? 'mt-0' : (index === 0 ? 'mt-1' : 'mt-2'), { 'flex-1': index === sidebarItems.length - 2 }]">
            <!-- Section title -->
            <div class="ps-2 mb-0.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase whitespace-nowrap transition-all duration-300" :class="collapsed ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100'">
                {{ item.section }}
            </div>

            <!-- Top-level items -->
            <template v-for="i in item.items" :key="i.href">
                <div class="relative">
                    <Link :href="i.href" class="group flex items-center text-[13px] font-semibold text-gray-500 rounded-md border border-transparent hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 py-1 overflow-hidden" :class="[collapsed ? 'justify-center' : 'gap-x-1.5', !collapsed && isActive(i) ? 'text-primary bg-gray-100' : '']">
                        <!-- Active bar -->
                        <div v-if="!collapsed" class="w-0.5 h-5 rounded-r-full shrink-0" :class="isActive(i) ? 'bg-primary' : 'bg-transparent'"></div>

                        <!-- Icon -->
                        <div class="flex items-center justify-center w-7 h-7 rounded-md shrink-0 transition-all duration-200" :class="isActive(i) ? collapsed ? 'text-primary' : 'bg-primary text-white' : isParentActive(i) && !collapsed ? 'text-primary' : ''">
                            <span class="pi text-sm" :class="i.icon"></span>
                        </div>

                        <!-- Label -->
                        <span class="whitespace-nowrap overflow-hidden transition-all duration-300" :class="collapsed ? 'w-0 opacity-0 ms-0' : 'w-auto opacity-100 ms-1.5'">
                            {{ i.name }}
                        </span>

                        <!-- Expand/collapse -->
                        <button v-if="i.children?.length && !collapsed" type="button" class="ml-auto mr-1 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded transition-colors duration-200" @click.prevent.stop="toggleItem(i)">
                            <span class="pi pi-chevron-right text-[9px] transition-transform duration-200" :class="isExpanded(i) ? 'rotate-90' : ''"></span>
                        </button>
                    </Link>

                    <!-- Children -->
                    <div v-if="i.children?.length" class="overflow-hidden transition-all duration-300" :class="showChildren && isExpanded(i) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'">
                        <Link v-for="child in i.children" :key="child.href" :href="child.href" class="group flex items-center text-[13px] font-medium text-gray-500 rounded-md py-1 ps-10 pe-2 border border-transparent hover:bg-gray-50 hover:border-gray-200 transition-all duration-200" :class="isActive(child) ? 'text-primary bg-gray-50' : ''">
                            <div class="flex items-center justify-center w-6 h-6 shrink-0">
                                <span class="pi text-[11px]" :class="child.icon"></span>
                            </div>

                            <span class="ms-1.5 whitespace-nowrap">
                                {{ child.name }}
                            </span>
                        </Link>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>