import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

interface BreadcrumbProps {
    [key: string]: unknown;
    breadcrumbLabels?: Record<string, string>;
}

export function useBreadcrumbs() {
    const page = usePage<BreadcrumbProps>();

    const breadcrumbs = computed(() => {
        const path = page.url.split('?')[0].split('#')[0];
        const segments = path.split('/').filter(Boolean);

        const items = segments.map((segment, index) => ({
            label: page.props.breadcrumbLabels?.[segment] ?? segment.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
            url: index === segments.length - 1 ? undefined : '/' + segments.slice(0, index + 1).join('/'),
        }));

        return [{ icon: 'pi pi-home', url: '/dashboard' }, ...items];
    });

    return { breadcrumbs };
}
