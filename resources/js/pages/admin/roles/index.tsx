import { EnhancedTable } from '@/components/enhanced-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { RiAddLine } from '@remixicon/react';
import { type ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
}

interface RolesPageProps {
    roles: {
        data: Role[];
        links: any[];
        meta: any;
    };
    filter: 'withoutTrash' | 'onlyTrash' | 'all';
    perPage: number;
    search: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '/admin',
    },
    {
        title: 'Roles',
        href: '/admin/roles',
    },
];

// Core roles that cannot be deleted
const coreRoles = ['super-admin'];

// Since roles don't have soft deletes, we only show relevant filter options
const filterOptions = [{ key: 'all', label: 'All Records' }];

export default function RolesIndex({
    roles: pageRoles,
    filter,
    perPage,
    search,
}: RolesPageProps) {
    const [loading, setLoading] = useState(false);

    const handleBulkDelete = (ids: string[]) => {
        setLoading(true);
        router.delete(`/admin/roles/bulk`, {
            data: { ids },
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    const columns: ColumnDef<Role>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'permissions',
            header: 'Permissions',
            cell: ({ row }) => {
                const permissions = row.original.permissions;
                return (
                    <div className="flex flex-wrap gap-1">
                        {permissions.length > 0 ? (
                            permissions.map((permission) => (
                                <Badge key={permission.id} variant="secondary">
                                    {permission.name} ({permission.guard_name})
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                No permissions assigned
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];

    const actions = {
        view: (id: string) => `/admin/roles/${id}`,
        edit: (id: string) => `/admin/roles/${id}/edit`,
        delete: (id: string) => {
            router.delete(`/admin/roles/${id}`, {
                preserveState: true,
                preserveScroll: true,
            });
        },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Roles" />
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Role Management</h1>
                        <p className="text-muted-foreground">
                            Manage user roles and their permissions
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/roles/create">
                            <RiAddLine className="h-4 w-4" />
                            Add Role
                        </Link>
                    </Button>
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Roles</CardTitle>
                            <CardDescription>
                                List of all roles in the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EnhancedTable
                                columns={columns}
                                data={pageRoles.data}
                                columnVisibility={{
                                    created_at: false,
                                    updated_at: false,
                                }}
                                perPage={15}
                                filters={filterOptions}
                                currentFilter="all"
                                searchPlaceholder="Search roles..."
                                onDelete={handleBulkDelete}
                                loading={loading}
                                actions={actions}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}