// Removed Wayfinder import - using hardcoded URLs instead
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
import { useTableState } from '@/hooks/use-table-state';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { RiAddLine } from '@remixicon/react';
import { type ColumnDef } from '@tanstack/react-table';

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
    guard_name: string;
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
        title: 'Permissions',
        href: '/admin/permissions',
    },
];


// Since permissions don't have soft deletes, we only show relevant filter options
const filterOptions = [
    { key: 'all', label: 'All Records' },
];

export default function PermissionsIndex({
    permissions: pagePermissions,
    filter,
    perPage,
    search,
}: PermissionsPageProps) {
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
        initialPage: pagePermissions?.meta?.current_page || 1,
        baseUrl: '/admin/permissions',
    });

    const handleBulkDelete = (ids: string[]) => {
        setLoading(true);
        router.delete('/admin/permissions/bulk', {
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

    const columns: ColumnDef<Permission>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'guard_name',
            header: 'Guard',
            cell: ({ row }) => {
                const guard = row.original.guard_name;
                return (
                    <Badge variant={guard === 'web' ? 'default' : 'secondary'}>
                        {guard}
                    </Badge>
                );
            },
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
        // Actions column is automatically added by EnhancedTable component
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
                            <RiAddLine className="h-4 w-4" />
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
                                data={pagePermissions.data}
                                columnVisibility={{
                                    created_at: false,
                                    updated_at: false,
                                }}
                                perPage={currentPerPage}
                                onPerPageChange={handlePerPageChange}
                                paginationMeta={pagePermissions.meta || undefined}
                                onPageChange={handlePageChange}
                                filters={filterOptions}
                                onFilterChange={handleFilterChange}
                                currentFilter={currentFilter}
                                onSearch={handleSearch}
                                searchPlaceholder="Search permissions..."
                                searchQuery={currentSearch}
                                onDelete={handleBulkDelete}
                                loading={loading}
                                actions={{
                                    view: (id: string) => `/admin/permissions/${id}`,
                                    edit: (id: string) => `/admin/permissions/${id}/edit`,
                                    delete: (id: string) => {
                                        router.delete(`/admin/permissions/${id}`, {
                                            preserveState: true,
                                            preserveScroll: true,
                                        });
                                    }
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
