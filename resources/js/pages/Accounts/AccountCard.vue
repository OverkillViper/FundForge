<script lang="ts" setup>
import { computed, ref } from 'vue';
import { router } from '@inertiajs/vue3';

import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import ToggleSwitch from 'primevue/toggleswitch';
import Menu from 'primevue/menu';

interface Account {
    id: number;
    name: string;
    account_number: string | null;
    type: string;
    opening_balance: string | number;
    balance: string | number;
    currency: string;
    is_active: boolean;
}

const props = defineProps<{
    account: Account;
}>();

const emit = defineEmits<{
    edit: [account: Account];
    delete: [account: Account];
}>();

const toast = useToast();
const isCopied = ref(false);
const menu = ref();
const isUpdatingStatus = ref(false);

const accountNumber = computed(() => props.account.account_number?.toString() ?? '');
const digits = computed(() => accountNumber.value.split(''));

const menuItems = [
    {
        label: 'Edit account',
        icon: 'pi pi-pencil',
        command: () => emit('edit', props.account),
    },
    {
        label: 'Delete account',
        icon: 'pi pi-trash',
        command: () => emit('delete', props.account),
    },
];

const toggleMenu = (event: Event) => {
    menu.value.toggle(event);
};

const toggleActive = (isActive: boolean) => {
    if (isUpdatingStatus.value) return;

    isUpdatingStatus.value = true;

    router.patch(
        `/accounts/${props.account.id}/status`,
        { is_active: isActive },
        {
            preserveScroll: true,
            onSuccess: () => {
                toast.add({
                    severity: 'success',
                    summary: 'Account Updated',
                    detail: `Account is now ${isActive ? 'active' : 'inactive'}.`,
                    life: 2000,
                });
            },
            onError: () => {
                toast.add({
                    severity: 'error',
                    summary: 'Update Failed',
                    detail: 'Unable to update the account status.',
                    life: 3000,
                });
            },
            onFinish: () => {
                isUpdatingStatus.value = false;
            },
        },
    );
};

const copyToClipboard = async () => {
    if (!accountNumber.value) {
        toast.add({
            severity: 'warn',
            summary: 'Account Number Unavailable',
            detail: 'This account does not have an account number.',
            life: 2000,
        });
        return;
    }

    try {
        await navigator.clipboard.writeText(accountNumber.value);

        isCopied.value = true;

        toast.add({
            severity: 'success',
            summary: 'Copied',
            detail: 'Account number copied to clipboard.',
            life: 2000,
        });

        setTimeout(() => {
            isCopied.value = false;
        }, 2000);
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Copy Failed',
            detail: 'Unable to copy the account number.',
            life: 2000,
        });
    }
};
</script>

<template>
    <div class="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">
        <!-- Header -->
        <div class="flex items-start gap-3 px-4 pt-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <i class="pi pi-building-columns text-sm text-primary"></i>
            </div>

            <div class="min-w-0 flex-1">
                <div class="truncate text-base font-semibold text-gray-800">
                    {{ account.name }}
                </div>

                <div class="mt-0.5 text-xs font-medium text-gray-400 capitalize">
                    {{ account.type }} account
                </div>
            </div>

            <Menu
                ref="menu"
                :model="menuItems"
                popup
                class="w-44 text-sm! font-medium!"
            />

            <Button
                variant="text"
                rounded
                size="small"
                class="!h-8 !w-8 !text-gray-400 hover:!bg-gray-100 hover:!text-gray-700"
                aria-label="Account menu"
                @click="toggleMenu"
            >
                <i class="pi pi-ellipsis-v text-sm"></i>
            </Button>
        </div>

        <!-- Status -->
        <div class="flex items-center justify-between px-4 pt-4">
            <div class="flex items-center gap-2">
                <span
                    class="h-2 w-2 rounded-full"
                    :class="account.is_active ? 'bg-emerald-500' : 'bg-gray-300'"
                ></span>

                <span class="text-xs font-medium text-gray-500">
                    {{ account.is_active ? 'Active account' : 'Inactive account' }}
                </span>
            </div>

            <ToggleSwitch
                :model-value="account.is_active"
                :input-id="`active-${account.id}`"
                :disabled="isUpdatingStatus"
                @update:model-value="toggleActive"
            />
        </div>

        <!-- Account Number -->
        <div class="mt-4 border-t border-gray-100 px-4 pt-3">
            <div class="mb-2 flex items-center justify-between">
                <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Account Number
                </span>

                <Button
                    :icon="isCopied ? 'pi pi-check' : 'pi pi-copy'"
                    :label="isCopied ? 'Copied' : 'Copy'"
                    severity="secondary"
                    text
                    rounded
                    size="small"
                    :disabled="!accountNumber"
                    aria-label="Copy account number"
                    class="!h-7 !px-2 !text-xs !text-gray-500 hover:!bg-gray-100 hover:!text-gray-700"
                    v-tooltip.top="{
                        value: isCopied ? 'Copied' : 'Copy account number',
                        class: 'text-xs! font-medium!',
                    }"
                    @click="copyToClipboard"
                />
            </div>

            <div class="flex min-h-7 items-center gap-1 overflow-x-auto pb-1">
                <template v-if="digits.length">
                    <div
                        v-for="(digit, index) in digits"
                        :key="index"
                        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 font-crique text-xs font-medium text-gray-700"
                    >
                        {{ digit }}
                    </div>
                </template>

                <span v-else class="text-xs text-gray-400">
                    No account number available
                </span>
            </div>
        </div>

        <!-- Balance -->
        <div class="mt-4 mx-3 mb-3 rounded-xl bg-primary px-4 py-3.5">
            <div class="flex items-end justify-between gap-x-4">
                <div class="min-w-0">
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                        Opening Balance
                    </div>

                    <div class="mt-1 flex items-baseline gap-1.5">
                        <span class="text-lg font-semibold text-white">
                            {{ account.opening_balance }}
                        </span>
                        <span class="text-[10px] font-medium text-white/60">
                            {{ account.currency }}
                        </span>
                    </div>
                </div>

                <div class="h-8 w-px bg-white/15"></div>

                <div class="min-w-0 text-right">
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                        Current Balance
                    </div>

                    <div class="mt-1 flex items-baseline justify-end gap-1.5">
                        <span class="text-lg font-bold text-white">
                            {{ account.balance }}
                        </span>
                        <span class="text-[10px] font-medium text-white/60">
                            {{ account.currency }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>