<script lang="ts" setup>
import { computed, ref } from 'vue';
import { usePage, Link, router } from '@inertiajs/vue3';
import Popover from 'primevue/popover';
import Button from 'primevue/button';
import { destroy } from '@/actions/Laravel/Fortify/Http/Controllers/AuthenticatedSessionController';

interface User {
    id: number;
    name: string;
    email: string;
}

const props = defineProps<{
    collapsed: boolean;
}>();

const emit = defineEmits<{
    toggleSidebar: [];
}>();

const page = usePage<{
    auth: {
        user: User;
    };
}>();

const notificationPopover = ref();
const userPopover = ref();

const toggleNotification = (event: Event) => {
    notificationPopover.value.toggle(event);
};

const toggleUserPopover = (event: Event) => {
    userPopover.value.toggle(event);
};

const user = page.props.auth.user;

const userInitials = computed(() => {
    if (!user.name) {
        return '';
    }

    return user.name
        .split(' ')
        .filter(Boolean)
        .map((name) => name.charAt(0))
        .join('')
        .toUpperCase();
});

const handleLogout = () => {
    router.post(destroy.url());
};

const greeting = computed(() => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';

    return 'Good Evening';
});
</script>

<template>
    <div class="flex items-center gap-x-6">
        <Link class="flex items-center w-54" href="/dashboard">
            <div class="flex items-center gap-x-4">
                <div class="bg-white p-2.5 rounded-lg overflow-hidden shadow flex justify-center items-center">
                    <img src="/logo.png" alt="FundForge Logo" class="w-6 h-6 object-contain shrink-0" />
                </div>
                <div class="font-berlin">FundForge</div>
            </div>
        </Link>

        <button
            class="flex items-center text-gray-400 hover:text-primary transition-colors duration-200"
            @click="emit('toggleSidebar')"
        >
            <span
                class="text-lg! transition-transform duration-300"
                :class="props.collapsed ? 'icon-panel-left-open' : 'icon-panel-left-close'"
            ></span>
        </button>

        <div class="text-lg flex-1 ps-4.5">
            <span class="text-gray-500 font-light">{{ greeting }}, </span>
            <span>{{ user.name }}</span>
        </div>

        <div class="flex items-center gap-x-2">
            <Button
                rounded
                icon="pi pi-bell"
                size="small"
                text
                @click="toggleNotification"
            />

            <Popover ref="notificationPopover">
                <div class="w-60 p-3 text-sm">
                    <div class="flex items-center gap-x-2">
                        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <span class="pi pi-bell text-sm"></span>
                        </div>
                        <div>
                            <div class="font-semibold text-gray-800">Notifications</div>
                            <div class="text-xs text-gray-400">Your latest updates</div>
                        </div>
                    </div>

                    <div class="mt-4 py-3 text-center text-xs text-gray-400">
                        No new notifications.
                    </div>
                </div>
            </Popover>

            <button
                class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent text-sm font-semibold text-white transition hover:bg-gray-800"
                @click="toggleUserPopover"
            >
                {{ userInitials }}
            </button>

            <Popover
                ref="userPopover"
                :pt="{ content: { class: 'p-0!' } }"
            >
                <div class="w-60 p-1 text-sm">
                    <div class="flex items-center gap-x-2 p-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-white">
                            {{ userInitials }}
                        </div>

                        <div class="flex min-w-0 flex-col text-sm">
                            <div class="truncate font-semibold">{{ user.name }}</div>
                            <div class="truncate text-xs text-gray-500">{{ user.email }}</div>
                        </div>
                    </div>

                    <hr class="border-gray-100" />

                    <div class="flex flex-col gap-y-1 p-2">
                        <Link
                            href="/settings/profile"
                            class="flex items-center gap-x-4 rounded-md p-2 transition hover:bg-gray-100"
                        >
                            <span class="pi pi-user"></span>
                            <span>Manage Profile</span>
                        </Link>

                        <button
                            class="flex items-center gap-x-4 rounded-md p-2 transition hover:bg-gray-100"
                            @click="handleLogout"
                        >
                            <span class="pi pi-sign-out"></span>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </Popover>
        </div>
    </div>
</template>