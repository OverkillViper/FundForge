<script lang="ts" setup>
import { Head, Link, router } from '@inertiajs/vue3';
import Button from 'primevue/button';
import ScrollPanel from 'primevue/scrollpanel';
import { create } from '@/routes/transfers';
import TransferCard from '../Components/TransferCard.vue';
import AppLayout from '@/layouts/AppLayout.vue';

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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Transfers {
    data: Transfer[];

    current_page: number;
    last_page: number;
    per_page: number;
    total: number;

    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;

    links: PaginationLink[];
}

const props = defineProps<{
    transfers: Transfers;
}>();
</script>

<template>
<AppLayout page-title="Transfers">
    <template #toolbar>
        <Button
            label="New Transfer"
            size="small"
            icon="pi pi-plus"
            @click="router.visit(create.url())"
        />
    </template>

    <template #content>
        <ScrollPanel class="mt-4 h-[700px] w-full">
            <div class="mx-auto w-full space-y-3">
                <div
                    v-if="transfers.data.length === 0"
                    class="col-span-3 rounded-2xl flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-300 bg-gray-50/70"
                >
                    <i
                        class="pi pi-exclamation-triangle text-3xl text-gray-400"
                    ></i>

                    <div class="mt-3 font-medium text-gray-700">
                        No transfers yet
                    </div>

                    <div class="mt-1 text-sm text-gray-500">
                        Your account transfers will appear here.
                    </div>

                    <Link :href="create.url()" class="mt-4">
                        <Button
                            label="New Transfer"
                            icon="pi pi-plus"
                            size="small"
                            severity="secondary"
                        />
                    </Link>
                </div>

                <div class="flex flex-col gap-2 px-1 pb-4 w-2/3 mx-auto">
                    <TransferCard
                        v-for="transfer in transfers.data"
                        :key="transfer.id"
                        :transfer="transfer"
                    />
                </div>
            </div>
        </ScrollPanel>
    </template>
</AppLayout>
</template>