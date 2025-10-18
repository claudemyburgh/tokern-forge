import users from '@/routes/admin/users';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { RiAddLine, RiMoreFill } from '@remixicon/react';
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

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

interface UsersPageProps {
    users: {
        data: User[];
        links: any[];
        meta: {
            current_page: number;
            last_page: number;
            from: number;
            to: number;
            total: number;
            per_page: number;
        };
    } | undefined;
    filter: 'withoutTrash' | 'withTrash' | 'onlyTrash' | 'all';
    perPage: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '#',
    },
    {
        title: 'Users',
        href: users.index.url(),
    },
];

export default function UsersIndex({ users: pageUsers, filter, perPage }: UsersPageProps) {
    const { auth } = usePage<SharedData>().props;
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentFilter, setCurrentFilter] = useState<'withoutTrash' | 'withTrash' | 'onlyTrash' | 'all'>(filter);
    const [currentPerPage, setCurrentPerPage] = useState<number>(perPage);
    const [currentPage, setCurrentPage] = useState<number>(pageUsers?.meta?.current_page || 1);

    const handleFilterChange = (newFilter: 'withoutTrash' | 'withTrash' | 'onlyTrash' | 'all') => {
        setCurrentFilter(newFilter);
        setCurrentPage(1); // Reset to first page when filter changes
        router.get(users.index.url(), { filter: newFilter, perPage: currentPerPage, page: 1 });
    };

    const handlePerPageChange = (newPerPage: number) => {
        setCurrentPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page when perPage changes
        router.get(users.index.url(), { filter: currentFilter, perPage: newPerPage, page: 1 });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        router.get(users.index.url(), { filter: currentFilter, perPage: currentPerPage, page: newPage });
    };

    const handleBulkDelete = (ids: string[]) => {
        setSelectedIds(ids);
        router.delete(`/admin/users/bulk`, {
            data: { ids },
        });
    };

    const handleBulkRestore = (ids: string[]) => {
        setSelectedIds(ids);
        router.post(`/admin/users/bulk/restore`, {
            ids,
        });
    };

    const handleBulkForceDelete = (ids: string[]) => {
        setSelectedIds(ids);
        router.delete(`/admin/users/bulk/force-delete`, {
            data: { ids },
        });
    };

    const getFilterLabel = () => {
        switch (currentFilter) {
            case 'withTrash':
                return 'With Trash';
            case 'onlyTrash':
                return 'Only Trash';
            case 'all':
                return 'All Records';
            case 'withoutTrash':
            default:
                return 'Without Trash';
        }
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'roles',
            header: 'Roles',
            cell: ({ row }) => {
                const roles = row.original.roles;
                return (
                    <div className="flex flex-wrap gap-1">
                        {roles.map((role) => (
                            <Badge
                                key={role.id}
                                variant="secondary"
                            >
                                {role.name}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Created At',
            enableHiding: true,
            cell: ({ row }) => {
                const date = new Date(row.original.created_at);
                return date.toLocaleDateString();
            },
        },
        {
            accessorKey: 'updated_at',
            header: 'Updated At',
            enableHiding: true,
            cell: ({ row }) => {
                const date = new Date(row.original.updated_at);
                return date.toLocaleDateString();
            },
        },
        {
            accessorKey: 'deleted_at',
            header: 'Deleted At',
            enableHiding: true,
            cell: ({ row }) => {
                const deletedAt = row.original.deleted_at;
                if (!deletedAt) return null;
                const date = new Date(deletedAt);
                return date.toLocaleDateString();
            },
        },
        {
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const user = row.original;
                
                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <RiMoreFill className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {(currentFilter === 'withTrash' || currentFilter === 'onlyTrash') && user.deleted_at ? (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                router.post(`/admin/users/${user.id}/restore`, {}, {
                                                    preserveScroll: true,
                                                });
                                            }}
                                        >
                                            Restore
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => {
                                                router.delete(`/admin/users/${user.id}/force-delete`, {
                                                    preserveScroll: true,
                                                });
                                            }}
                                        >
                                            Force Delete
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href={users.show.url({ user: user.id })}>
                                                View
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={users.edit.url({ user: user.id })}>
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        {auth.user?.id !== user.id && (
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                asChild
                                            >
                                                <Link
                                                    href={users.destroy.url({ user: user.id })}
                                                    method="delete"
                                                    as="button"
                                                >
                                                    Delete
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },

    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">User Management</h1>
                        <p className="text-muted-foreground">
                            Manage user accounts and their roles
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={users.create.url()}>
                            <RiAddLine className="mr-2 h-4 w-4" />
                            Add User
                        </Link>
                    </Button>
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Users</CardTitle>
                            <CardDescription>
                                List of all users in the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    {/* Other controls can go here if needed */}
                                </div>
                                <div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline">
                                                {getFilterLabel()} <RiMoreFill className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleFilterChange('withoutTrash')}>
                                                Without Trash
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleFilterChange('withTrash')}>
                                                With Trash
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleFilterChange('onlyTrash')}>
                                                Only Trash
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleFilterChange('all')}>
                                                All Records
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <DataTable 
                                columns={columns} 
                                data={pageUsers?.data || []} 
                                softDelete={true}
                                columnVisibility={{
                                    'created_at': false,
                                    'updated_at': false,
                                    'deleted_at': false,
                                }}
                                perPage={currentPerPage}
                                onPerPageChange={handlePerPageChange}
                                onDelete={handleBulkDelete}
                                onRestore={handleBulkRestore}
                                onForceDelete={handleBulkForceDelete}
                                paginationMeta={pageUsers?.meta || undefined}
                                onPageChange={handlePageChange}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );

}