import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import axios, { AxiosError } from 'axios';
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Columns3,
    Eye,
    Filter,
    MoreVertical,
    Pencil,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

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

interface UserTableProps {
    permissions?: {
        canView?: boolean;
        canEdit?: boolean;
        canDelete?: boolean;
    };
    hiddenColumns?: string[];
    onView?: (user: User) => void;
    onEdit?: (user: User) => void;
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

// Delete users function
const deleteUsers = async (userIds: number[]): Promise<void> => {
    await Promise.all(userIds.map((id) => axios.delete(`/api/users/${id}`)));
};

// Skeleton loader component
const TableRowSkeleton: React.FC = () => (
    <TableRow>
        <TableCell>
            <Skeleton className="h-4 w-4" />
        </TableCell>
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
        <TableCell>
            <Skeleton className="h-8 w-8" />
        </TableCell>
    </TableRow>
);

const UserTable: React.FC<UserTableProps> = ({
    permissions = {
        canView: true,
        canEdit: true,
        canDelete: true,
    },
    hiddenColumns = [],
    onView,
    onEdit,
}) => {
    const queryClient = useQueryClient();

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
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
        {},
    );
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        hiddenColumns.reduce((acc, col) => ({ ...acc, [col]: false }), {}),
    );
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(true);

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
    const { data, isLoading, isError, error } = useQuery<
        UsersResponse,
        AxiosError
    >({
        queryKey: ['users', fetchParams],
        queryFn: () => fetchUsers(fetchParams),
        staleTime: 30000,
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteUsers,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setRowSelection({});
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        },
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

    // Handle delete
    const handleDelete = (userId?: number) => {
        if (userId) {
            setUserToDelete(userId);
        }
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        const idsToDelete = userToDelete
            ? [userToDelete]
            : Object.keys(rowSelection)
                  .filter((key) => rowSelection[key])
                  .map((key) => {
                      const rowIndex = parseInt(key);
                      return data?.data[rowIndex]?.id;
                  })
                  .filter((id): id is number => id !== undefined);

        if (idsToDelete.length > 0) {
            deleteMutation.mutate(idsToDelete);
        }
    };

    const selectedCount = Object.values(rowSelection).filter(Boolean).length;

    // Table columns definition
    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                        disabled={!permissions.canDelete}
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        disabled={!permissions.canDelete}
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
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
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const user = row.original;
                    const hasAnyPermission =
                        permissions.canView ||
                        permissions.canEdit ||
                        permissions.canDelete;

                    if (!hasAnyPermission) return null;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {permissions.canView && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            if (onView) {
                                                onView(user);
                                            } else {
                                                console.log(
                                                    'View user:',
                                                    user.id,
                                                );
                                            }
                                        }}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </DropdownMenuItem>
                                )}
                                {permissions.canEdit && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            if (onEdit) {
                                                onEdit(user);
                                            } else {
                                                console.log(
                                                    'Edit user:',
                                                    user.id,
                                                );
                                            }
                                        }}
                                    >
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                )}
                                {permissions.canDelete && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleDelete(user.id)
                                            }
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
                enableSorting: false,
                enableHiding: false,
            },
        ],
        [handleSort, permissions, onView, onEdit],
    );

    const table = useReactTable({
        data: data?.data ?? [],
        columns,
        pageCount: data?.last_page ?? -1,
        state: {
            pagination,
            sorting,
            rowSelection,
            columnVisibility,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        enableRowSelection: true,
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
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        {showFilters ? 'Hide' : 'Show'} Filters
                    </Button>

                    {selectedCount > 0 && permissions.canDelete && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete()}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete {selectedCount} user
                            {selectedCount !== 1 ? 's' : ''}
                        </Button>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Columns3 className="mr-2 h-4 w-4" />
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuItem
                                        key={column.id}
                                        className="capitalize"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            column.toggleVisibility(
                                                !column.getIsVisible(),
                                            );
                                        }}
                                    >
                                        <Checkbox
                                            checked={column.getIsVisible()}
                                            className="mr-2"
                                        />
                                        {column.id.replace('_', ' ')}
                                    </DropdownMenuItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Filters Section */}
            {showFilters && (
                <div className="rounded-lg border bg-card p-3 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search Input */}
                        <div className="relative min-w-[200px] flex-1">
                            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                value={globalFilter}
                                onChange={(e) =>
                                    setGlobalFilter(e.target.value)
                                }
                                className="h-9 pl-8 text-sm"
                            />
                        </div>

                        {/* Role Filter */}
                        <Select
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                        >
                            <SelectTrigger className="h-9 w-[140px] text-sm">
                                <SelectValue placeholder="Role" />
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
                            <SelectTrigger className="h-9 w-[140px] text-sm">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="verified">
                                    Verified
                                </SelectItem>
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
                            <SelectTrigger className="h-9 w-[100px] text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="h-9"
                            >
                                <X className="mr-1 h-3.5 w-3.5" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            )}

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
                            Array.from({ length: pagination.pageSize }).map(
                                (_, index) => <TableRowSkeleton key={index} />,
                            )
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
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
            <div className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm">
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

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1 px-3 text-sm">
                        <span className="font-medium">
                            {pagination.pageIndex + 1}
                        </span>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium">
                            {data?.last_page ?? 1}
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            {userToDelete
                                ? 'Are you sure you want to delete this user? This action cannot be undone.'
                                : `Are you sure you want to delete ${selectedCount} user${
                                      selectedCount !== 1 ? 's' : ''
                                  }? This action cannot be undone.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeleteDialogOpen(false);
                                setUserToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending
                                ? 'Deleting...'
                                : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserTable;
