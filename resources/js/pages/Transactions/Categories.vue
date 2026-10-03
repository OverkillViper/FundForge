<script lang="ts" setup>
import { router } from '@inertiajs/vue3';
import Button from 'primevue/button';
import ScrollPanel from 'primevue/scrollpanel';
import CreateCategoryModal from './CreateCategoryModal.vue';
import CategoryItem from './CategoryItem.vue';
import { index } from '@/routes/transactions';
import AppLayout from '@/layouts/AppLayout.vue';

interface Category {
    id: number;
    name: string;
    transactions_count: number;
    total_expense: string | number | null;
}

const props = defineProps<{
    categories: Category[];
}>();
</script>

<template>
<AppLayout page-title="Transaction Categories">
    <template #toolbar>
        <CreateCategoryModal />
        <Button
            label="Back to Transactions"
            icon="pi pi-arrow-left"
            severity="secondary"
            size="small"
            @click="router.visit(index.url())"
        />
    </template>
    <template #content>
        <ScrollPanel class="mt-6 h-[700px] w-full">
            <div class="space-y-2">
                <div class="mx-auto grid grid-cols-4 gap-6">
                    <CategoryItem
                        v-for="category in props.categories"
                        :key="category.id"
                        :category="category"
                        class="max-w-2xl"
                    />
                </div>

                
                <div
                    v-if="props.categories.length === 0"
                    class="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300"
                >
                    <div class="text-center">
                        <div class="text-sm font-medium text-gray-600">
                            No categories yet
                        </div>

                        <div class="mt-1 text-xs text-gray-400">
                            Create a category to organize your transactions.
                        </div>
                    </div>
                </div>
            </div>
        </ScrollPanel>
    </template>
</AppLayout>
</template>
