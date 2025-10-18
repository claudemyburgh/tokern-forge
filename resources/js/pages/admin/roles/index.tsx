import roles from '@/routes/admin/roles';
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
import { DataTable } from '@/components/data-table';
import {
    type ColumnDef,
} from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Permission {
    id: number;
    name: string;
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
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '#',
    },
    {
        title: 'Roles',
        href: roles.index.url(),
    },
];

// Core roles that cannot be deleted
const coreRoles = ['super-admin'];

export default function RolesIndex({ roles: pageRoles }: RolesPageProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleBulkDelete = (ids: string[]) => {
        setSelectedIds(ids);
        router.delete(`/admin/roles/bulk`, {
            data: { ids },
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
                                <Badge
                                    key={permission.id}
                                    variant="secondary"
                                >
                                    {permission.name}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm">
                                No permissions assigned
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const role = row.original;
                const isCore = coreRoles.includes(role.name);
                
                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Actions
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={roles.show.url({ role: role.id })}
                                    >
                                        View
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={roles.edit.url({ role: role.id })}
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
                                            href={roles.destroy.url({ role: role.id })}
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
        },
    ];

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
                        <Link href={roles.create.url()}>
                            <RiAddLine className="mr-2 h-4 w-4" />
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
                            <DataTable 
                                columns={columns} 
                                data={pageRoles.data} 
                                onDelete={handleBulkDelete}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}