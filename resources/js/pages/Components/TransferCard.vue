<script lang="ts" setup>
import Button from 'primevue/button';
import ConfirmPopup from 'primevue/confirmpopup';
import Menu from 'primevue/menu';
import Popover from 'primevue/popover';
import { computed, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { edit, destroy } from '@/routes/transfers';
import { useConfirm } from 'primevue/useconfirm';

const confirm = useConfirm();

interface Account {
    id: number;
    name: string;
    account_number: string;
    type: string;
    currency: string;
}

interface Transfer {
    id: number;
    from_account_id: number;
    to_account_id: number;
    amount: string;
    transfer_date: string;
    reference: string | null;
    note: string | null;
    from_account: Account;
    to_account: Account;
    created_at: string;
    updated_at: string;
}

const props = defineProps<{
    transfer: Transfer;
}>();

const menu = ref();
const infoPopover = ref();

const formattedDate = computed(() => {
    return new Date(props.transfer.transfer_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
});

const formattedAmount = computed(() => {
    return Number(props.transfer.amount).toLocaleString('en-BD', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
});

const menuItems = computed(() => [
    {
        label: 'Edit transfer',
        icon: 'pi pi-pencil',
        command: () => router.visit(edit.url(props.transfer.id)),
    },
    {
        label: 'Delete transfer',
        icon: 'pi pi-trash',
        command: (event: any) => confirmDelete(event.originalEvent),
    },
]);

const toggleMenu = (event: Event) => {
    menu.value.toggle(event);
};

const toggleInfo = (event: Event) => {
    infoPopover.value.toggle(event);
};

const confirmDelete = (event: Event) => {
    confirm.require({
        target: event.currentTarget as HTMLElement,
        message: 'Delete this transfer?',
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
            router.delete(destroy.url(props.transfer.id), {
                preserveScroll: true,
            });
        },
    });
};
</script>

<template>
    <div
        class="group flex min-h-20 items-center gap-4 border-b border-gray-100 px-4 py-3 transition hover:bg-gray-50/70"
    >
        <!-- Icon -->
        <div class="w-10 shrink-0">
            <div
                class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
            >
                <span class="pi pi-arrow-right-arrow-left text-sm"></span>
            </div>
        </div>

        <!-- Transfer -->
        <div class="flex min-w-0 flex-1 items-center gap-3">
            <!-- From -->
            <div class="min-w-0 flex-1">
                <div
                    class="truncate text-sm font-semibold text-gray-800"
                    :title="transfer.from_account.name"
                >
                    {{ transfer.from_account.name }}
                </div>

                <div class="mt-0.5 truncate text-xs capitalize text-gray-500">
                    {{ transfer.from_account.type }} account
                </div>
            </div>

            <!-- Direction -->
            <div
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400"
            >
                <span class="pi pi-arrow-right text-xs"></span>
            </div>

            <!-- To -->
            <div class="min-w-0 flex-1">
                <div
                    class="truncate text-sm font-semibold text-gray-800"
                    :title="transfer.to_account.name"
                >
                    {{ transfer.to_account.name }}
                </div>

                <div class="mt-0.5 truncate text-xs capitalize text-gray-500">
                    {{ transfer.to_account.type }} account
                </div>
            </div>
        </div>

        <!-- Date -->
        <div class="hidden w-28 shrink-0 md:block">
            <div
                class="text-[10px] font-semibold uppercase tracking-wider text-gray-400"
            >
                Date
            </div>

            <div class="mt-1 text-sm font-medium text-gray-700">
                {{ formattedDate }}
            </div>
        </div>

        <!-- Amount -->
        <div class="w-36 shrink-0 text-right">
            <div
                class="text-[10px] font-semibold uppercase tracking-wider text-gray-400"
            >
                Amount
            </div>

            <div class="mt-1 whitespace-nowrap text-sm font-bold text-gray-800">
                {{ formattedAmount }}
                <span class="text-xs font-medium text-gray-400">
                    {{ transfer.from_account.currency }}
                </span>
            </div>
        </div>

        <!-- Actions -->
        <div
            class="flex w-24 shrink-0 items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100"
        >
            <Button
                v-if="transfer.note || transfer.reference"
                severity="secondary"
                text
                rounded
                size="small"
                icon="pi pi-info-circle"
                aria-label="Transfer information"
                @click="toggleInfo"
            />

            <Button
                severity="secondary"
                text
                rounded
                size="small"
                icon="pi pi-ellipsis-v"
                aria-label="Transfer actions"
                @click="toggleMenu"
            />

            <Menu ref="menu" :model="menuItems" :popup="true" class="text-sm!"/>
            <ConfirmPopup class="text-sm!" />

            <Popover ref="infoPopover">
                <div class="w-64 text-sm">
                    <div
                        v-if="transfer.reference"
                        class="mb-4"
                    >
                        <div
                            class="text-[10px] font-semibold uppercase tracking-wider text-gray-400"
                        >
                            Reference
                        </div>

                        <div class="mt-1 break-words font-medium text-gray-800">
                            {{ transfer.reference }}
                        </div>
                    </div>

                    <div>
                        <div
                            class="text-[10px] font-semibold uppercase tracking-wider text-gray-400"
                        >
                            Note
                        </div>

                        <div class="mt-1 break-words text-gray-700">
                            {{ transfer.note || 'No note added.' }}
                        </div>
                    </div>
                </div>
            </Popover>
        </div>
    </div>
</template>