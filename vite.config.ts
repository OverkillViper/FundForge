import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

const isCodespaces = Boolean(process.env.CODESPACE_NAME);
const devHost = '192.168.0.198';
const codespacesHost = isCodespaces ? `${process.env.CODESPACE_NAME}-5173.app.github.dev` : null;

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        wayfinder({
            formVariants: true,
        }),
    ],
    // Development server settings only; production uses compiled assets.
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        cors: {
            origin: [
                'http://192.168.0.198:8000',
                'http://localhost:8000',
                ...(codespacesHost ? [`https://${codespacesHost}`] : []),
            ],
        },
        origin: isCodespaces ? `https://${codespacesHost}` : `http://${devHost}:5173`,
        ws: {
            host: isCodespaces ? codespacesHost! : devHost,
            protocol: isCodespaces ? 'wss' : 'ws',
            clientPort: isCodespaces ? 443 : 5173,
        },
        watch: {
            ignored: [
                '**/.agents/**',
                '**/.claude/**',
                '**/.cursor/**',
                '**/.junie/**',
                '**/vendor/**',
            ],
        },
    },
});