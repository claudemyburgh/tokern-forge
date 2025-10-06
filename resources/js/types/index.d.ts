import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import React from 'react';

export interface Auth {
    user?: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    roles?: string[];
    initials: string;
    permissions?: string[];
    is_super_admin?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> {
    auth: Auth;
    [key: string]: unknown;
}

// Permission hook return type
export interface UsePermissionsReturn {
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
    isSuperAdmin: () => boolean;
}

// Component prop types
export interface CanProps {
    permission: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export interface HasRoleProps {
    role: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

// Generic pagination metadata interface (for Laravel 12 pagination)
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Paginated response type compatible with Laravel's LengthAwarePaginator
export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    links: PaginationLink[];
    path: string;
}

// Optional: For use with your Inertia page props
export interface PageWithPagination<T> extends PageProps {
    pagination: PaginatedResponse<T>;
}
