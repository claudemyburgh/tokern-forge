import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import React from 'react';

interface CanProps {
    permissions?: string | string[];
    roles?: string | string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const Can: React.FC<CanProps> = ({
    permissions,
    roles,
    children,
    fallback = null,
}) => {
    const { auth } = usePage<SharedData>().props;

    // If user is not authenticated, show fallback
    if (!auth.user) {
        return <>{fallback}</>;
    }

    // Ensure user has roles and permissions arrays
    const userRoles = Array.isArray(auth.user.roles) ? auth.user.roles : [];
    const userPermissions = Array.isArray(auth.user.permissions) ? auth.user.permissions : [];

    // Convert permissions and roles to arrays if they're strings
    const permissionArray =
        typeof permissions === 'string' ? [permissions] : permissions || [];
    const roleArray = typeof roles === 'string' ? [roles] : roles || [];

    // Check if user has any of the required permissions
    const hasPermission =
        permissionArray.length === 0 ||
        permissionArray.some((permission) =>
            userPermissions.includes(permission),
        );

    // Check if user has any of the required roles
    const hasRole =
        roleArray.length === 0 ||
        roleArray.some((role) => userRoles.includes(role));

    // Show children if user has required permissions or roles
    if (
        (permissionArray.length > 0 && hasPermission) ||
        (roleArray.length > 0 && hasRole)
    ) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

export default Can;
