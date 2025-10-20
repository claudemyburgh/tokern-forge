import { EnhancedTable } from '@/components/enhanced-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import { useTableState } from '@/hooks/use-table-state';
import AppLayout from '@/layouts/app-layout';

// Removed Wayfinder import - using hardcoded URLs instead
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { RiAddLine } from '@remixicon/react';
import { type ColumnDef } from '@tanstack/react-table';

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
    avatar?: string;
    avatar_small?: string;
}

interface UsersPageProps {
    users:
        | {
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
          }
        | undefined;
    filter: 'withoutTrash' | 'onlyTrash' | 'all';
    perPage: number;
    search: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '#',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
];

export default function UsersIndex({
    users: pageUsers,
    filter,
    perPage,
    search,
}: UsersPageProps) {
    const getInitials = useInitials();
    const {
        currentFilter,
        currentPerPage,
        currentSearch,
        loading,
        handleFilterChange,
        handlePerPageChange,
        handlePageChange,
        handleSearch,
        setLoading,
    } = useTableState({
        initialFilter: filter,
        initialPerPage: perPage,
        initialSearch: search,
        initialPage: pageUsers?.meta?.current_page || 1,
        baseUrl: '/admin/users',
    });

    const handleBulkDelete = (ids: string[]) => {
        setLoading(true);
        router.delete(`/admin/users/bulk`, {
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

    const handleBulkRestore = (ids: string[]) => {
        setLoading(true);
        router.post(
            `/admin/users/bulk/restore`,
            {
                ids,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                },
            },
        );
    };

    const handleBulkForceDelete = (ids: string[]) => {
        setLoading(true);
        router.delete(`/admin/users/bulk/force-delete`, {
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

    const filterOptions = [
        { key: 'withoutTrash', label: 'Without Trash' },
        { key: 'onlyTrash', label: 'Only Trash' },
        { key: 'all', label: 'All Records' },
    ];

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <div className={`flex items-center space-x-2`}>
                        <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                            <AvatarImage
                                src={user.avatar_small || user.avatar}
                                alt={user.name}
                            />
                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <strong>{user.name}</strong>
                    </div>
                );
            },
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
                            <Badge key={role.id} variant="secondary">
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
                const date = row.original.created_at;
                if (!date) return null;
                return new Date(date).toLocaleDateString();
            },
        },
        {
            accessorKey: 'updated_at',
            header: 'Updated At',
            enableHiding: true,
            cell: ({ row }) => {
                const date = row.original.updated_at;
                if (!date) return null;
                return new Date(date).toLocaleDateString();
            },
        },
        {
            accessorKey: 'deleted_at',
            header: 'Deleted At',
            enableHiding: true,
            cell: ({ row }) => {
                const deletedAt = row.original.deleted_at;
                if (!deletedAt) return null;
                return new Date(deletedAt).toLocaleDateString();
            },
        },
    ];

    const actions = {
        view: (id: string) => `/admin/users/${id}`,
        edit: (id: string) => `/admin/users/${id}/edit`,
        delete: (id: string) => {
            router.delete(`/admin/users/${id}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                },
            });
        },
    };

    // Add a simple check to see if pageUsers is undefined
    if (!pageUsers) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Manage Users" />
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                User Management
                            </h1>
                            <p className="text-muted-foreground">
                                Manage user accounts and their roles
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/admin/users/create">
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
                                    Loading users...
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>No user data available.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

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
                        <Link href="/admin/users/create">
                            <RiAddLine className="h-4 w-4" />
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
                            <EnhancedTable
                                columns={columns}
                                data={pageUsers.data || []}
                                softDelete={true}
                                columnVisibility={{
                                    created_at: false,
                                    updated_at: false,
                                    deleted_at: false,
                                }}
                                perPage={currentPerPage}
                                onPerPageChange={handlePerPageChange}
                                onDelete={handleBulkDelete}
                                onRestore={handleBulkRestore}
                                onForceDelete={handleBulkForceDelete}
                                paginationMeta={pageUsers.meta || undefined}
                                onPageChange={handlePageChange}
                                filters={filterOptions}
                                onFilterChange={handleFilterChange}
                                currentFilter={currentFilter}
                                onSearch={handleSearch}
                                searchPlaceholder="Search users..."
                                searchQuery={currentSearch}
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
