import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export function usePolicy() {
    const { can } = usePage<PageProps>().props;

    return {
        can: (ability: string): boolean => {
            return (can as Record<string, boolean>)?.[ability] || false;
        },
    };
}
