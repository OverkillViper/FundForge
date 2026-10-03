<script lang="ts" setup>
import Button from 'primevue/button';
import AccountCard from './AccountCard.vue';
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import Create from './Create.vue';
import Edit from './Edit.vue';
import Dialog from 'primevue/dialog';
import AppLayout from '@/layouts/AppLayout.vue';

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

const creating = ref(false);
const editing = ref(false);
const selectedAccount = ref(null);
const deleteDialogVisible = ref(false);
const deleting = ref(false);
const accountToDelete = ref<Account | null>(null);

const createAccount = () => {
    creating.value = true;
    editing.value = false;
    selectedAccount.value = null;
};

const editAccount = (account: any) => {
    creating.value = false;
    editing.value = true;
    selectedAccount.value = account;
};

const closeSidePanel = () => {
    creating.value = false;
    editing.value = false;
    selectedAccount.value = null;
};

const props = defineProps({
    accounts: {
        type: Object,
        required: true,
    },
});

const confirmDelete = (account: Account) => {
    accountToDelete.value = account;
    deleteDialogVisible.value = true;
};

const deleteAccount = () => {
    if (!accountToDelete.value) {
        return;
    }

    deleting.value = true;

    router.delete(`/accounts/${accountToDelete.value.id}`, {
        preserveScroll: true,

        onSuccess: () => {
            deleteDialogVisible.value = false;
            accountToDelete.value = null;
        },

        onFinish: () => {
            deleting.value = false;
        },
    });
};
</script>

<template>
<AppLayout pageTitle="Accounts">
    <template #toolbar>
        <Button
            label="New Account"
            icon="pi pi-plus"
            size="small"
            @click="createAccount"
        />
    </template>
    <template #content>
        <div class="grid grid-cols-3 gap-6 py-6">
            <AccountCard
                v-for="account in props.accounts"
                :key="account.id"
                :account="account"
                @edit="editAccount"
                @delete="confirmDelete"
            />

            <div v-if="props.accounts.length === 0" class="col-span-3 flex flex-col items-center justify-center py-16 text-center">
                <i class="pi pi-exclamation-triangle text-3xl text-gray-400"></i>

                <div class="mt-3 font-medium text-gray-700">
                    No accounts yet
                </div>

                <div class="mt-1 text-sm text-gray-500">
                    Your accounts will appear here.
                </div>

                <Button
                    label="Create Account"
                    icon="pi pi-plus"
                    size="small"
                    severity="secondary"
                    class="mt-4"
                    @click="createAccount"
                />
            </div>
        </div>
    </template>
</AppLayout>

    <Dialog
        :visible="creating"
        modal
        header="Create Account"
        :style="{ width: '32rem' }"
        @update:visible="(value) => !value && closeSidePanel()"
    >
        <Create @cancel="closeSidePanel" @success="closeSidePanel" />
    </Dialog>

    <Dialog
        :visible="editing && selectedAccount !== null"
        modal
        header="Edit Account"
        :style="{ width: '32rem' }"
        @update:visible="(value) => !value && closeSidePanel()"
    >
        <Edit
            v-if="selectedAccount"
            :account="selectedAccount"
            @cancel="closeSidePanel"
            @success="closeSidePanel"
        />
    </Dialog>

    <Dialog
        v-model:visible="deleteDialogVisible"
        modal
        header="Delete Account"
        :style="{ width: '28rem' }"
    >
        <div class="flex flex-col gap-4">
            <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                    <i class="pi pi-trash text-red-500"></i>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="font-medium text-[#181518]">
                        Delete this account?
                    </span>

                    <span class="text-sm text-gray-500">
                        You are about to delete
                        <span class="font-medium text-[#181518]">
                            {{ accountToDelete?.name }} </span
                        >. This action cannot be undone.
                    </span>
                </div>
            </div>

            <div class="flex justify-end gap-2 pt-2">
                <Button
                    label="Cancel"
                    severity="secondary"
                    text
                    size="small"
                    :disabled="deleting"
                    @click="deleteDialogVisible = false"
                />

                <Button
                    label="Delete Account"
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    :loading="deleting"
                    @click="deleteAccount"
                />
            </div>
        </div>
    </Dialog>
</template>
