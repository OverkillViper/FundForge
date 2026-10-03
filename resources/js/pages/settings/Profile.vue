<script setup lang="ts">
import { Form, Head, usePage } from '@inertiajs/vue3';
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/DeleteUser.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import ScrollPanel from 'primevue/scrollpanel';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Profile settings',
                href: edit(),
            },
        ],
    },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
</script>

<template>
<AppLayout pageTitle="Manage Profile">
    <template #content>
        <ScrollPanel class="mt-4 h-[720px] w-full">
            <div class="mx-auto max-w-5xl space-y-5 pb-8">
                <div class="px-1">
                    <h1 class="text-lg font-semibold text-gray-900">Profile</h1>
                    <p class="mt-1 text-sm text-gray-500">Manage your personal information and account details.</p>
                </div>

                <!-- Profile Information -->
                <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <i class="pi pi-user text-sm"></i>
                        </div>

                        <div>
                            <div class="text-sm font-semibold text-gray-900">Profile Information</div>
                            <div class="mt-0.5 text-xs text-gray-500">Update your name and email address.</div>
                        </div>
                    </div>

                    <Form
                        v-bind="ProfileController.update.form()"
                        v-slot="{ errors, processing }"
                    >
                        <div class="grid grid-cols-2 gap-4 p-5">
                            <div class="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                                <label
                                    for="name"
                                    class="text-[10px] font-semibold uppercase tracking-wider text-gray-400"
                                >
                                    Name
                                </label>

                                <p class="mb-3 mt-1 text-xs text-gray-500">
                                    Your name as it appears throughout FundForge.
                                </p>

                                <Input
                                    id="name"
                                    class="w-full"
                                    name="name"
                                    :default-value="user.name"
                                    required
                                    autocomplete="name"
                                    placeholder="Full name"
                                />

                                <InputError class="mt-2" :message="errors.name" />
                            </div>

                            <div class="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                                <label
                                    for="email"
                                    class="text-[10px] font-semibold uppercase tracking-wider text-gray-400"
                                >
                                    Email Address
                                </label>

                                <p class="mb-3 mt-1 text-xs text-gray-500">
                                    Used for account access and email notifications.
                                </p>

                                <Input
                                    id="email"
                                    type="email"
                                    class="w-full"
                                    name="email"
                                    :default-value="user.email"
                                    required
                                    autocomplete="username"
                                    placeholder="Email address"
                                />

                                <InputError class="mt-2" :message="errors.email" />
                            </div>
                        </div>

                        <div
                            v-if="page.props.mustVerifyEmail && !user.email_verified_at"
                            class="mx-5 mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900"
                        >
                            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                                <span class="pi pi-envelope text-sm text-amber-600"></span>
                            </div>

                            <div class="flex flex-col gap-0.5">
                                <span class="text-sm font-semibold">Email address not verified</span>

                                <p class="m-0 text-sm leading-5 text-amber-800">
                                    Your email address is currently unverified.
                                    <Link
                                        :href="send()"
                                        as="button"
                                        class="font-medium underline underline-offset-2 hover:no-underline"
                                    >
                                        Re-send verification email
                                    </Link>
                                </p>

                                <div
                                    v-if="page.props.status === 'verification-link-sent'"
                                    class="mt-1 text-xs font-medium text-emerald-700"
                                >
                                    A new verification link has been sent to your email address.
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                            <Button
                                :disabled="processing"
                                data-test="update-profile-button"
                            >
                                <i class="pi pi-check mr-2 text-xs"></i>
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </section>

                <!-- Account -->
                <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                            <i class="pi pi-shield text-sm"></i>
                        </div>

                        <div>
                            <div class="text-sm font-semibold text-gray-900">Account</div>
                            <div class="mt-0.5 text-xs text-gray-500">Manage security-sensitive account actions.</div>
                        </div>
                    </div>

                    <div class="p-5">
                        <div class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                            <div class="flex items-center gap-3">
                                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500">
                                    <span class="pi pi-lock text-sm"></span>
                                </div>

                                <div>
                                    <div class="text-sm font-semibold text-gray-800">Password & Security</div>
                                    <div class="mt-0.5 text-xs text-gray-500">
                                        Update your password and manage account security.
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/settings/security"
                                class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
                            >
                                <span>Manage</span>
                                <i class="pi pi-arrow-right text-[10px]"></i>
                            </Link>
                        </div>
                    </div>
                </section>

                <!-- Danger Zone -->
                <section class="overflow-hidden rounded-2xl border border-red-200 bg-white">
                    <div class="flex items-center gap-3 border-b border-red-100 px-5 py-4">
                        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <i class="pi pi-exclamation-triangle text-sm"></i>
                        </div>

                        <div>
                            <div class="text-sm font-semibold text-gray-900">Danger Zone</div>
                            <div class="mt-0.5 text-xs text-gray-500">Permanent actions that affect your FundForge account.</div>
                        </div>
                    </div>

                    <div class="p-5">
                        <DeleteUser />
                    </div>
                </section>
            </div>
        </ScrollPanel>
    </template>
</AppLayout>
</template>