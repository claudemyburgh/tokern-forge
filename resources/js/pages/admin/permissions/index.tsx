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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { RiAddLine } from '@remixicon/react';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
    roles: Role[];
    created_at: string;
    updated_at: string;
}

interface PermissionsPageProps {
    permissions: {
        data: Permission[];
        links: any[];
        meta: any;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '#',
    },
    {
        title: 'Permissions',
        href: '/admin/permissions',
    },
];

// Core permissions that cannot be deleted
const corePermissions = [
    'view tokens',
    'create tokens',
    'edit tokens',
    'delete tokens',
    'manage users',
    'manage roles',
    'manage permissions',
    'manage settings',
];

export default function PermissionsIndex({
    permissions,
}: PermissionsPageProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleBulkDelete = (ids: string[]) => {
        setSelectedIds(ids);
        router.delete('/admin/permissions/bulk', {
            data: { ids },
        });
    };

    const columns: ColumnDef<Permission>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'roles',
            header: 'Assigned Roles',
            cell: ({ row }) => {
                const roles = row.original.roles;
                return (
                    <div className="flex flex-wrap gap-1">
                        {roles.length > 0 ? (
                            roles.map((role) => (
                                <Badge key={role.id} variant="secondary">
                                    {role.name}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                No roles assigned
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const permission = row.original;
                const isCore = corePermissions.includes(permission.name);

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/admin/permissions/${permission.id}`}
                                    >
                                        View
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/admin/permissions/${permission.id}/edit`}
                                    >
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                {!isCore && (
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        asChild
                                    >
                                        <Link
                                            href={`/admin/permissions/${permission.id}`}
                                            method="delete"
                                            as="button"
                                            preserveScroll
                                        >
                                            Delete
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            size: 50,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Permissions" />
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Permission Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage system permissions and assign them to roles
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/permissions/create">
                            <RiAddLine className="mr-2 h-4 w-4" />
                            Add Permission
                        </Link>
                    </Button>
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Permissions</CardTitle>
                            <CardDescription>
                                List of all permissions in the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EnhancedTable
                                columns={columns}
                                data={permissions.data}
                                columnVisibility={{
                                    created_at: false,
                                    updated_at: false,
                                }}
                                perPage={15}
                                filters={[]}
                                currentFilter="all"
                                searchPlaceholder="Search permissions..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
