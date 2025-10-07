import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import axios, { AxiosError } from 'axios';
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Filter,
    Search,
    X,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

// Types
interface Media {
    id: number;
    uuid: string;
    collection_name: string;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
    original_url: string;
    preview_url: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    email_verified_at: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    avatar: string;
    avatar_small: string;
    initials: string;
    is_super_admin: boolean;
    media: Media[];
    roles: Role[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

interface UsersResponse {
    current_page: number;
    data: User[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface FetchUsersParams {
    page: number;
    per_page: number;
    search: string;
    sort_by: string;
    sort_order: 'asc' | 'desc';
    role_filter: string;
    verified_filter: string;
}

// Fetch users function
const fetchUsers = async (params: FetchUsersParams): Promise<UsersResponse> => {
    const { data } = await axios.get<UsersResponse>('/api/users', {
        params: {
            page: params.page,
            per_page: params.per_page,
            search: params.search || undefined,
            sort_by: params.sort_by || undefined,
            sort_order: params.sort_order || undefined,
            role: params.role_filter || undefined,
            verified: params.verified_filter || undefined,
        },
    });
    return data;
};

// Skeleton loader component
const TableRowSkeleton: React.FC = () => (
    <TableRow>
        <TableCell>
            <Skeleton className="size-8 rounded-full" />
        </TableCell>
        <TableCell>
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
            </div>
        </TableCell>
        <TableCell>
            <Skeleton className="h-4 w-48" />
        </TableCell>
        <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
        </TableCell>
        <TableCell>
            <Skeleton className="h-6 w-12 rounded-full" />
        </TableCell>
        <TableCell>
            <Skeleton className="h-4 w-24" />
        </TableCell>
    </TableRow>
);

const UserTable: React.FC = () => {
    // State management
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [verifiedFilter, setVerifiedFilter] = useState<string>('all');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(globalFilter);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }, 500);

        return () => clearTimeout(timer);
    }, [globalFilter]);

    // Build fetch params
    const fetchParams: FetchUsersParams = {
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        search: debouncedSearch,
        sort_by: sorting[0]?.id || 'created_at',
        sort_order: sorting[0]?.desc ? 'desc' : 'asc',
        role_filter: roleFilter,
        verified_filter: verifiedFilter,
    };

    // React Query for data fetching
    const { data, isLoading, isError, error, isFetching } = useQuery<
        UsersResponse,
        AxiosError
    >({
        queryKey: ['users', fetchParams],
        queryFn: () => fetchUsers(fetchParams),
        staleTime: 30000,
    });

    // Handle sorting
    const handleSort = useCallback((columnId: string) => {
        setSorting((old) => {
            const existing = old.find((s) => s.id === columnId);
            if (!existing) {
                return [{ id: columnId, desc: false }];
            }
            if (!existing.desc) {
                return [{ id: columnId, desc: true }];
            }
            return [];
        });
    }, []);

    // Clear filters
    const clearFilters = useCallback(() => {
        setGlobalFilter('');
        setRoleFilter('all');
        setVerifiedFilter('all');
        setSorting([]);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, []);

    const hasActiveFilters =
        globalFilter !== '' || roleFilter !== 'all' || verifiedFilter !== 'all';

    // Table columns definition
    const columns = React.useMemo<ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'avatar',
                header: 'Avatar',
                cell: ({ row }) => (
                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                        <AvatarImage
                            src={row.original.avatar_small}
                            alt={row.original.name}
                        />
                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                            {row.original.initials}
                        </AvatarFallback>
                    </Avatar>
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'name',
                header: () => (
                    <Button
                        variant="ghost"
                        onClick={() => handleSort('name')}
                        className="h-auto p-0 hover:bg-transparent"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.name}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'email',
                header: () => (
                    <Button
                        variant="ghost"
                        onClick={() => handleSort('email')}
                        className="h-auto p-0 hover:bg-transparent"
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <span className="text-sm">{row.original.email}</span>
                ),
            },
            {
                accessorKey: 'roles',
                header: 'Role',
                cell: ({ row }) => (
                    <div className="flex flex-wrap gap-1">
                        {row.original.is_super_admin && (
                            <Badge
                                variant="destructive"
                                className="text-xs font-medium"
                            >
                                Super Admin
                            </Badge>
                        )}
                        {row.original.roles.map((role) => (
                            <Badge
                                key={role.id}
                                variant="secondary"
                                className="text-xs font-medium"
                            >
                                {role.name}
                            </Badge>
                        ))}
                        {!row.original.is_super_admin &&
                            row.original.roles.length === 0 && (
                                <Badge
                                    variant="outline"
                                    className="text-xs font-medium"
                                >
                                    User
                                </Badge>
                            )}
                    </div>
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'email_verified_at',
                header: 'Verified',
                cell: ({ row }) => (
                    <Badge
                        variant={
                            row.original.email_verified_at
                                ? 'default'
                                : 'outline'
                        }
                        className="text-xs font-medium"
                    >
                        {row.original.email_verified_at
                            ? 'Verified'
                            : 'Pending'}
                    </Badge>
                ),
                enableSorting: true,
            },
            {
                accessorKey: 'created_at',
                header: () => (
                    <Button
                        variant="ghost"
                        onClick={() => handleSort('created_at')}
                        className="h-auto p-0 hover:bg-transparent"
                    >
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <span className="text-sm">
                        {new Date(row.original.created_at).toLocaleDateString(
                            'en-US',
                            {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            },
                        )}
                    </span>
                ),
            },
        ],
        [handleSort],
    );

    const table = useReactTable({
        data: data?.data ?? [],
        columns,
        pageCount: data?.last_page ?? -1,
        state: {
            pagination,
            sorting,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    if (isError) {
        return (
            <div className="flex h-[400px] items-center justify-center rounded-lg border border-red-200 bg-red-50">
                <div className="text-center">
                    <p className="text-lg font-semibold text-red-900">
                        Error loading users
                    </p>
                    <p className="mt-1 text-sm text-red-700">
                        {error?.message || 'An unexpected error occurred'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {/* Filters Section */}
            <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or bio..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Role Filter */}
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="super-admin">
                                Super Admin
                            </SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Verification Filter */}
                    <Select
                        value={verifiedFilter}
                        onValueChange={setVerifiedFilter}
                    >
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Verification" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="unverified">
                                Unverified
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Per Page Selector */}
                    <Select
                        value={pagination.pageSize.toString()}
                        onValueChange={(value) =>
                            setPagination((prev) => ({
                                ...prev,
                                pageSize: Number(value),
                                pageIndex: 0,
                            }))
                        }
                    >
                        <SelectTrigger className="w-full md:w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 per page</SelectItem>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="20">20 per page</SelectItem>
                            <SelectItem value="50">50 per page</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="w-full md:w-auto"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between border-t pt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        {isFetching && !isLoading && (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        )}
                        <span className="font-medium">
                            Total: {data?.total ?? 0} users
                        </span>
                    </div>
                    {sorting.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>
                                Sorted by{' '}
                                <span className="font-medium">
                                    {sorting[0].id}
                                </span>{' '}
                                {sorting[0].desc ? '↓' : '↑'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-lg border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="font-semibold"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton rows
                            Array.from({ length: pagination.pageSize }).map(
                                (_, index) => <TableRowSkeleton key={index} />,
                            )
                        ) : table.getRowModel().rows?.length ? (
                            // Actual data rows
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            // No results
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-32 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Search className="mb-2 h-8 w-8" />
                                        <p className="text-sm font-medium">
                                            No users found
                                        </p>
                                        <p className="text-xs">
                                            Try adjusting your filters
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Section */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm md:flex-row">
                <div className="text-sm text-muted-foreground">
                    Showing{' '}
                    <span className="font-medium text-foreground">
                        {data?.from ?? 0}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium text-foreground">
                        {data?.to ?? 0}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium text-foreground">
                        {data?.total ?? 0}
                    </span>{' '}
                    results
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1 text-sm">
                        <span className="font-medium">
                            Page {pagination.pageIndex + 1}
                        </span>
                        <span className="text-muted-foreground">of</span>
                        <span className="font-medium">
                            {data?.last_page ?? 1}
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
