<script lang="ts" setup>
import { computed } from 'vue';
import Button from 'primevue/button';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';
import { router } from '@inertiajs/vue3';
import { destroy, edit } from '@/routes/transactions';

const confirm = useConfirm();

interface Account {
    id: number;
    name: string;
    account_number: string;
    type: string;
    balance: string;
    currency: string;
    is_active: boolean;
}

interface Category {
    id: number;
    name: string;
}

interface Transaction {
    id: number;
    user_id: number;
    account_id: number;
    category_id: number | null;

    title: string;

    type: 'income' | 'expense' | 'investment' | 'lending' | 'borrowing';

    amount: string | number;
    transaction_date: string;

    note: string | null;
    reference: string | null;

    created_at: string;
    updated_at: string;

    account?: Account;
    category?: Category;
}

const props = defineProps<{
    transaction: Transaction;
}>();

const typeConfig = computed(() => {
    switch (props.transaction.type) {
        case 'income':
            return {
                label: 'Income',
                icon: 'pi pi-arrow-down-right',
                color: 'text-green-600',
                bg: 'bg-green-50',
            };

        case 'expense':
            return {
                label: 'Expense',
                icon: 'pi pi-arrow-up-right',
                color: 'text-gray-800',
                bg: 'bg-red-100',
            };

        case 'investment':
            return {
                label: 'Investment',
                icon: 'pi pi-building-columns',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
            };

        case 'lending':
            return {
                label: 'Lending',
                icon: 'pi pi-arrow-u-turn-up-left',
                color: 'text-orange-600',
                bg: 'bg-orange-50',
            };

        case 'borrowing':
            return {
                label: 'Borrowing',
                icon: 'pi pi-arrow-u-turn-up-right',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
            };

        default:
            return {
                label: 'Transaction',
                icon: 'pi pi-circle',
                color: 'text-gray-600',
                bg: 'bg-gray-50',
            };
    }
});

const formattedAmount = computed(() => {
    return Number(props.transaction.amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
});

const formattedDate = computed(() => {
    return new Date(props.transaction.transaction_date).toLocaleDateString(
        'en-GB',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        },
    );
});

const amountPrefix = computed(() => {
    return props.transaction.type === 'income' ||
        props.transaction.type === 'borrowing'
        ? '+'
        : '-';
});

const confirmDelete = (event: Event) => {
    confirm.require({
        target: event.currentTarget as HTMLElement,

        message: `Delete "${props.transaction.title}"?`,

        icon: 'pi pi-exclamation-triangle',

        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
            size: 'small',
        },

        acceptProps: {
            label: 'Delete',
            severity: 'danger',
            size: 'small',
        },

        accept: () => {
            router.delete(destroy.url(props.transaction.id), {
                preserveScroll: true,
            });
        },
    });
};
</script>

<template>
    <div
        class="flex items-center gap-4 bg-white p-2 transition-shadow hover:shadow-sm"
    >
        <!-- Type Icon -->
        <div
            class="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg"
            :class="typeConfig.bg"
        >
            <i
                :class="[typeConfig.icon, typeConfig.color]"
                class="text-lg!"
            ></i>
            <div class="text-xs" :class="[typeConfig.color]">
                {{ typeConfig.label }}
            </div>
        </div>

        <!-- Main Information -->
        <div class="flex min-w-0 flex-1 flex-col gap-y-1">
            <div class="flex items-center gap-2">
                <span class="truncate font-medium text-[#181518]">
                    {{ transaction.title }}
                </span>
            </div>

            <div class="flex items-center gap-x-2 text-xs text-gray-600">
                <span class="text-xs">
                    {{ formattedDate }}
                </span>
                <span v-if="transaction.type === 'expense'">•</span>

                <span v-if="transaction.type === 'expense'">
                    {{ transaction.category?.name ?? 'Uncategorized' }}
                </span>
            </div>
        </div>

        <div class="mt-1 flex items-center gap-2">
            <span>
                {{ transaction.account?.name ?? 'Unknown account' }}
            </span>
        </div>

        <!-- Amount -->
        <div class="flex min-w-28 shrink-0 flex-col items-end">
            <span class="text-sm font-semibold" :class="typeConfig.color">
                {{ amountPrefix }}{{ formattedAmount }}
            </span>

            <span class="text-[10px] text-gray-400">
                {{ transaction.account?.currency ?? 'BDT' }}
            </span>
        </div>

        <!-- Actions -->
        <div class="flex shrink-0 items-center gap-1">
            <Button
                icon="pi pi-pencil"
                severity="secondary"
                text
                rounded
                size="small"
                aria-label="Edit transaction"
                @click="router.visit(edit.url(transaction.id))"
            />

            <Button
                icon="pi pi-trash"
                severity="secondary"
                text
                rounded
                size="small"
                aria-label="Delete transaction"
                @click="confirmDelete"
            />
            <ConfirmPopup class="text-sm!"></ConfirmPopup>
        </div>
    </div>
</template>
