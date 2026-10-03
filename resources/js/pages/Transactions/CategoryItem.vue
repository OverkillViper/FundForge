<script lang="ts" setup>
import { useForm, router, Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import Button from 'primevue/button';
import { update, destroy } from '@/routes/transactions/categories';
import { useToast } from 'primevue/usetoast';
import IconPicker from '@/pages/Components/IconPicker.vue';

const toast = useToast();
const editing = ref(false);

const props = defineProps({
    category: {
        type: Object,
        required: true,
    },
});

const editForm = useForm({
    name: props.category.name,
    icon: props.category.icon,
});

const editCategory = () => {
    editForm.put(update.url(props.category.id), {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({
                severity: 'success',
                summary: 'Category Updated',
                detail: `${editForm.name} has been updated successfully.`,
                life: 3000,
            });
            editing.value = false;
        },
    });
};
</script>

<template>
    <div class="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">
        <div class="flex items-center p-3">
            <IconPicker
                v-if="editing"
                v-model="editForm.icon"
                class="h-11"
                showLabel
            />

            <div
                v-else
                class="bg-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
            >
                <span :class="`icon-${category.icon} text-lg! text-white`"></span>
            </div>

            <div class="ms-3 min-w-0 flex-1">
                <form v-if="editing" @submit.prevent="editCategory">
                    <input
                        v-model="editForm.name"
                        class="h-9 w-full border-b border-gray-300 bg-transparent text-base font-medium text-gray-800 outline-none focus:border-primary"
                        autofocus
                    />
                </form>

                <Link
                    v-else
                    :href="`/transactions?category=${category.id}`"
                    class="block truncate text-base font-semibold text-gray-800 transition-colors hover:text-primary"
                >
                    {{ category.name }}
                </Link>

                <Link
                    v-if="!editing"
                    :href="`/transactions?category=${category.id}`"
                    class="mt-0.5 inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-primary"
                >
                    View transactions
                    <i class="pi pi-arrow-up-right text-[9px]"></i>
                </Link>
            </div>

            <div class="ms-2 flex items-center gap-1">
                <template v-if="editing">
                    <Button
                        size="small"
                        severity="secondary"
                        text
                        rounded
                        icon="pi pi-times"
                        @click="editing = false"
                    />

                    <Button
                        size="small"
                        severity="primary"
                        text
                        rounded
                        icon="pi pi-check"
                        :loading="editForm.processing"
                        @click="editCategory"
                    />
                </template>

                <template v-else>
                    <Button
                        size="small"
                        severity="secondary"
                        text
                        rounded
                        icon="pi pi-pencil"
                        aria-label="Edit category"
                        @click="editing = true"
                    />

                    <Button
                        size="small"
                        severity="danger"
                        text
                        rounded
                        icon="pi pi-trash"
                        aria-label="Delete category"
                        @click="router.delete(destroy.url(category.id))"
                    />
                </template>
            </div>
        </div>

        <div v-if="editing" class="border-t border-gray-100 px-3 pb-3 pt-2">
            <div class="text-xs text-gray-400">
                Press check to save your changes.
            </div>
        </div>

        <Link
            v-else
            :href="`/transactions?category=${category.id}`"
            class="mx-3 mb-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 transition-colors hover:bg-primary hover:text-white"
        >
            <div class="flex items-center gap-x-2">
                <i class="pi pi-receipt text-xs"></i>
                <span class="text-xs font-medium">Transactions</span>
            </div>

            <div class="flex items-center gap-x-1.5">
                <span class="text-xs font-semibold">
                    {{ category.transactions_count || 0 }}
                </span>
                <i class="pi pi-chevron-right text-[9px]"></i>
            </div>
        </Link>

        <div
            v-if="!editing"
            class="grid grid-cols-2 divide-x border-t border-gray-100 bg-gray-50"
        >
            <div class="flex flex-col px-4 py-3">
                <span class="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    Total Expense
                </span>
                <span class="mt-1 text-sm font-semibold text-gray-700">
                    {{ category.total_expense || 0 }}
                    <span class="text-[10px] font-medium text-gray-400">BDT</span>
                </span>
            </div>

            <div class="flex flex-col px-4 py-3">
                <span class="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    Transactions
                </span>
                <span class="mt-1 text-sm font-semibold text-gray-700">
                    {{ category.transactions_count || 0 }}
                </span>
            </div>
        </div>
    </div>
</template>