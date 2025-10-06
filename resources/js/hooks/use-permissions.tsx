import { PageProps, UsePermissionsReturn } from '@/types';
import { usePage } from '@inertiajs/react';

export function usePermissions(): UsePermissionsReturn {
    const { auth } = usePage<PageProps>().props;

    const hasPermission = (permission: string): boolean => {
        if (auth.user?.is_super_admin) return true;
        return auth.user?.permissions?.includes(permission) || false;
    };

    const hasRole = (role: string): boolean => {
        if (auth.user?.is_super_admin) return true;
        return auth.user?.roles?.includes(role) || false;
    };

    const hasAnyPermission = (permissions: string[]): boolean => {
        if (auth.user?.is_super_admin) return true;
        return permissions.some((permission) =>
            auth.user?.permissions?.includes(permission),
        );
    };

    const hasAllPermissions = (permissions: string[]): boolean => {
        if (auth.user?.is_super_admin) return true;
        return permissions.every((permission) =>
            auth.user?.permissions?.includes(permission),
        );
    };

    const isSuperAdmin = (): boolean => {
        return auth.user?.is_super_admin || false;
    };

    return {
        hasPermission,
        hasRole,
        hasAnyPermission,
        hasAllPermissions,
        isSuperAdmin,
    };
}
