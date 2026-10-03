<script lang="ts" setup>
import { Link } from '@inertiajs/vue3';
import { index } from '@/routes/accounts';
</script>

<template>
    <div class="mt-4 flex items-start gap-x-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <span class="pi pi-exclamation-triangle text-sm text-amber-600"></span>
        </div>

        <div class="flex flex-col gap-y-1">
            <span class="text-sm font-semibold">
                Account Required
            </span>

            <p class="m-0 text-sm leading-5 text-amber-800">
                You need at least one account to continue.
                <Link
                    :href="index.url()"
                    class="font-medium underline underline-offset-2 transition hover:text-amber-950"
                >
                    Set up an account
                </Link>
                to get started.
            </p>
        </div>
    </div>
</template>