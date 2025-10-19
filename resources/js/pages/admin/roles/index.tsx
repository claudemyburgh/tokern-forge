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
import roles from '@/routes/admin/roles';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { RiAddLine } from '@remixicon/react';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

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
                                <Badge key={permission.id} variant="secondary">
                                    {permission.name}
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
        {
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const role = row.original;
                const isCore = coreRoles.includes(role.name);

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
                                            href={roles.destroy.url({
                                                role: role.id,
                                            })}
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
                            <EnhancedTable
                                columns={columns}
                                data={pageRoles.data}
                                columnVisibility={{
                                    created_at: false,
                                    updated_at: false,
                                }}
                                perPage={15}
                                filters={[]}
                                currentFilter="all"
                                searchPlaceholder="Search roles..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
