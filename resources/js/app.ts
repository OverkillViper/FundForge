import { createInertiaApp, Head } from '@inertiajs/vue3';
import { initializeTheme } from '@/composables/useAppearance';
import AppLayout from '@/layouts/AppLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import DashboardLayout from './layouts/DashboardLayout.vue';
import { initializeFlashToast } from '@/lib/flashToast';
import ToastService from 'primevue/toastservice';;
import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';
import Tooltip from 'primevue/tooltip';
import { createApp, DefineComponent, h } from 'vue';
import ConfirmationService from 'primevue/confirmationservice';

const appName = import.meta.env.VITE_APP_NAME || 'FundForge';

const FundForgePreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#3e92af',
            100: '#3788a4',
            200: '#308099',
            300: '#2a758d',
            400: '#236a81',
            500: '#1a5f75',
            600: '#18566a',
            700: '#164d5e',
            800: '#144552',
            900: '#123d4b',
            950: '#113844',
        },

        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '#f8f8f8',
                    100: '#f3f3f3',
                    200: '#e8e8e8',
                    300: '#d8d8d8',
                    400: '#bdbdbd',
                    500: '#9e9e9e',
                    600: '#757575',
                    700: '#525252',
                    800: '#2f2f2f',
                    900: '#080808',
                    950: '#080808',
                },
            },

            dark: {
                surface: {
                    0: '#ffffff',
                    50: '#080808',
                    100: '#111111',
                    200: '#1a1a1a',
                    300: '#242424',
                    400: '#333333',
                    500: '#4a4a4a',
                    600: '#666666',
                    700: '#8a8a8a',
                    800: '#b0b0b0',
                    900: '#dedede',
                    950: '#f8f8f8',
                },
            },
        },
    },

    components: {
        button: {
            colorScheme: {
                light: {
                    root: {
                        primary: {
                            background: '#1a5f75',
                            hoverBackground: '#18566a',
                            activeBackground: '#144552',
                            borderColor: '#1a5f75',
                            hoverBorderColor: '#18566a',
                            activeBorderColor: '#144552',
                            color: '#ffffff',
                        },
                    },
                },

                dark: {
                    root: {
                        primary: {
                            background: '#1a5f75',
                            hoverBackground: '#236a81',
                            activeBackground: '#144552',
                            borderColor: '#1a5f75',
                            hoverBorderColor: '#236a81',
                            activeBorderColor: '#144552',
                            color: '#ffffff',
                        },
                    },
                },
            },
        },
    },
});

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    // layout: (name) => {
    //     switch (true) {
    //         case name === 'Welcome':
    //             return null;
    //         case name.startsWith('auth/'):
    //             return AuthLayout;
    //         // case name.startsWith('settings/'):
    //         //     return [AppLayout, SettingsLayout];
    //         // case name === 'Dashboard':
    //         //     return DashboardLayout;
    //         default:
    //             return AppLayout;
    //     }
    // },
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .component('Head', Head)
            .component('AppLayout', AppLayout)
            .component('AuthLayout', AuthLayout)
            .use(PrimeVue, {
                theme: {
                    preset: FundForgePreset,
                    options: {
                        darkModeSelector: '.dark', // Integrates with standard dark mode class toggles
                        cssLayer: false,
                    },
                },
                licenseKey: '',
            })
            .use(ToastService)
            .use(ConfirmationService)
            .directive('tooltip', Tooltip)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on page load...
initializeTheme();

// This will listen for flash toast data from the server...
initializeFlashToast();
