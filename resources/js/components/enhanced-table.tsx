import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';

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
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronsUpDown,
    ChevronUp,
    Columns2,
    Eye,
    EyeOff,
    Filter,
    MoreVertical,
    Search,
} from 'lucide-react';

interface EnhancedTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data?: TData[];
    softDelete?: boolean;
    columnVisibility?: VisibilityState;
    perPage?: number;
    onPerPageChange?: (perPage: number) => void;
    onDelete?: (ids: string[]) => void;
    onRestore?: (ids: string[]) => void;
    onForceDelete?: (ids: string[]) => void;
    paginationMeta?: {
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        per_page: number;
    };
    onPageChange?: (page: number) => void;
    filters?: FilterOption[];
    onFilterChange?: (filter: string) => void;
    currentFilter?: string;
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    searchQuery?: string;
    loading?: boolean;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDeleteSingle?: (id: string) => void;
    actions?: {
        view: (id: string) => string;
        edit: (id: string) => string;
        delete: (id: string) => void;
    };
    skeletonRender?: (rowIndex: number, colIndex: number) => React.ReactNode;
}

interface FilterOption {
    key: string;
    label: string;
}

export function EnhancedTable<TData, TValue>({
    columns,
    data = [],
    softDelete = false,
    columnVisibility: initialColumnVisibility = {},
    perPage = 15,
    onPerPageChange,
    onDelete,
    onRestore,
    onForceDelete,
    paginationMeta,
    onPageChange,
    filters = [],
    onFilterChange,
    currentFilter,
    onSearch,
    searchPlaceholder = 'Search...',
    searchQuery = '',
    loading = false,
    onView,
    onEdit,
    onDeleteSingle,
    actions,
    skeletonRender,
}: EnhancedTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>(initialColumnVisibility);
    const [rowSelection, setRowSelection] = React.useState({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isRestoreDialogOpen, setIsRestoreDialogOpen] = React.useState(false);
    const [isForceDeleteDialogOpen, setIsForceDeleteDialogOpen] =
        React.useState(false);
    const [actionType, setActionType] = React.useState<
        'delete' | 'restore' | 'forceDelete'
    >('delete');
    const [selectedRowId, setSelectedRowId] = React.useState<string | null>(
        null,
    );

    // Add selection column as the first column
    const selectableColumns = React.useMemo(() => {
        const cols = [...columns];

        // Add actions column
        cols.push({
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const id = (row.original as any).id?.toString();
                const isDeleted = !!(row.original as any).deleted_at;

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {actions ? (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href={actions.view(id)}>
                                                View
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={actions.edit(id)}>
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        {isDeleted ? (
                                            <>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedRowId(id);
                                                        setActionType(
                                                            'restore',
                                                        );
                                                        setIsRestoreDialogOpen(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    Restore
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        setSelectedRowId(id);
                                                        setActionType(
                                                            'forceDelete',
                                                        );
                                                        setIsForceDeleteDialogOpen(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    Force Delete
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => {
                                                    actions.delete(id);
                                                }}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => onView?.(id)}
                                        >
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onEdit?.(id)}
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        {isDeleted ? (
                                            <>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedRowId(id);
                                                        setActionType(
                                                            'restore',
                                                        );
                                                        setIsRestoreDialogOpen(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    Restore
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        setSelectedRowId(id);
                                                        setActionType(
                                                            'forceDelete',
                                                        );
                                                        setIsForceDeleteDialogOpen(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    Force Delete
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => {
                                                    setSelectedRowId(id);
                                                    setActionType('delete');
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                            >
                                                Delete
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
            size: 50, // Small width for actions column
        });

        return [
            {
                id: 'select',
                header: ({ table }: { table: any }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                'indeterminate')
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }: { row: Row<TData> }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            ...cols,
        ];
    }, [columns, onView, onEdit, actions]);

    const table = useReactTable({
        data: data || [],
        columns: selectableColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: perPage,
            },
        },
        // Disable client-side pagination when using server-side pagination
        manualPagination: !!paginationMeta,
    });

    // Update table pagination when perPage changes
    React.useEffect(() => {
        table.setPageSize(perPage);
    }, [perPage, table]);

    const selectedRowIds = React.useMemo(() => {
        return Object.keys(rowSelection)
            .map((key) => {
                const rowIndex = parseInt(key);
                const row = table.getRowModel().rows[rowIndex];
                // Check if row exists before accessing original data
                if (!row) return key;
                // Assuming the data has an 'id' property
                return (
                    (row.original as any).id?.toString() || rowIndex.toString()
                );
            })
            .filter((id) => id !== undefined);
    }, [rowSelection, table]);

    const handleBulkAction = (type: 'delete' | 'restore' | 'forceDelete') => {
        setActionType(type);
        if (type === 'delete') {
            setIsDeleteDialogOpen(true);
        } else if (type === 'restore') {
            setIsRestoreDialogOpen(true);
        } else {
            setIsForceDeleteDialogOpen(true);
        }
    };

    const confirmBulkAction = () => {
        if (!selectedRowIds || selectedRowIds.length === 0) return;

        switch (actionType) {
            case 'delete':
                onDelete?.(selectedRowIds);
                setIsDeleteDialogOpen(false);
                break;
            case 'restore':
                onRestore?.(selectedRowIds);
                setIsRestoreDialogOpen(false);
                break;
            case 'forceDelete':
                onForceDelete?.(selectedRowIds);
                setIsForceDeleteDialogOpen(false);
                break;
        }

        // Clear selection after action
        table.toggleAllRowsSelected(false);
    };

    const confirmSingleAction = () => {
        if (!selectedRowId) return;

        switch (actionType) {
            case 'delete':
                onDeleteSingle?.(selectedRowId);
                break;
            case 'restore':
                onRestore?.([selectedRowId]);
                break;
            case 'forceDelete':
                onForceDelete?.([selectedRowId]);
                break;
        }
        setIsDeleteDialogOpen(false);
        setIsRestoreDialogOpen(false);
        setIsForceDeleteDialogOpen(false);
        setSelectedRowId(null);
    };

    const handleSearchChange = (query: string) => {
        onSearch?.(query);
    };

    const getFilterLabel = (filterKey: string) => {
        const filter = filters.find((f) => f.key === filterKey);
        return filter ? filter.label : filterKey;
    };

    const toggleAllColumnsVisibility = () => {
        const allColumns = table
            .getAllColumns()
            .filter((column) => column.getCanHide());
        const allVisible = allColumns.every((column) => column.getIsVisible());

        allColumns.forEach((column) => {
            column.toggleVisibility(!allVisible);
        });
    };

    const areAllColumnsVisible = () => {
        const allColumns = table
            .getAllColumns()
            .filter((column) => column.getCanHide());
        return allColumns.every((column) => column.getIsVisible());
    };

    // Calculate current page and last page for display
    const currentPage =
        paginationMeta?.current_page ||
        table.getState().pagination.pageIndex + 1;
    const lastPage = paginationMeta?.last_page || table.getPageCount();

    // Handle case where pagination meta values might be arrays
    const extractValue = (value: any): number => {
        if (Array.isArray(value)) {
            return value.length > 0 ? Number(value[0]) : 1;
        }
        return Number(value) || 1;
    };

    // Ensure currentPage and lastPage are valid numbers
    const displayCurrentPage = extractValue(currentPage);
    const displayLastPage = extractValue(lastPage);

    // Also extract other pagination values
    const displayFrom = paginationMeta?.from
        ? extractValue(paginationMeta.from)
        : 1;
    const displayTo = paginationMeta?.to ? extractValue(paginationMeta.to) : 1;
    const displayTotal = paginationMeta?.total
        ? extractValue(paginationMeta.total)
        : 0;
    const displayPerPage = paginationMeta?.per_page
        ? extractValue(paginationMeta.per_page)
        : perPage;

    return (
        <div className="filament-table">
            {/* Table Header with Filters and Search */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex flex-1 items-center space-x-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(event) =>
                                handleSearchChange(event.target.value)
                            }
                            className="pl-8"
                        />
                    </div>

                    {filters.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9"
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    {currentFilter
                                        ? getFilterLabel(currentFilter)
                                        : 'Filters'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {filters.map((filter) => (
                                    <DropdownMenuItem
                                        key={filter.key}
                                        onClick={() =>
                                            onFilterChange?.(filter.key)
                                        }
                                    >
                                        {filter.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    {Object.keys(rowSelection).length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    Bulk Actions (
                                    {Object.keys(rowSelection).length})
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => handleBulkAction('delete')}
                                >
                                    Delete
                                </DropdownMenuItem>
                                {softDelete && (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleBulkAction('restore')
                                            }
                                        >
                                            Restore
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleBulkAction('forceDelete')
                                            }
                                        >
                                            Force Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                                <Columns2 className="h-4 w-4" />
                                <span className="sr-only">Columns</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={toggleAllColumnsVisibility}
                            >
                                {areAllColumnsVisible() ? (
                                    <>
                                        <EyeOff className="mr-2 h-4 w-4" />
                                        <span>Hide All</span>
                                    </>
                                ) : (
                                    <>
                                        <Eye className="mr-2 h-4 w-4" />
                                        <span>Show All</span>
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler?.()}
                                            className={`select-none ${header.column.getCanSort() ? 'cursor-pointer' : 'cursor-default'}`}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div className="flex items-center">
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <>
                                                            <>
                                                                {header.column.getIsSorted() ===
                                                                'asc' ? (
                                                                    <ChevronUp className="ml-1 size-3 opacity-30" />
                                                                ) : header.column.getIsSorted() ===
                                                                  'desc' ? (
                                                                    <ChevronDown className="ml-1 size-3 opacity-30" />
                                                                ) : (
                                                                    <ChevronsUpDown className="ml-1 size-3 opacity-30" />
                                                                )}
                                                            </>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Render skeleton rows when loading
                            Array.from({ length: perPage }).map(
                                (_, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {selectableColumns.map(
                                            (_, colIndex) => (
                                                <TableCell key={colIndex}>
                                                    {skeletonRender ? (
                                                        skeletonRender(
                                                            rowIndex,
                                                            colIndex,
                                                        )
                                                    ) : (
                                                        <Skeleton className="h-4 w-1/2" />
                                                    )}
                                                </TableCell>
                                            ),
                                        )}
                                    </TableRow>
                                ),
                            )
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
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
                                    colSpan={
                                        selectableColumns?.length ||
                                        columns?.length + 1 ||
                                        1
                                    }
                                    className="h-24 text-center"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing {displayFrom} to {displayTo} of {displayTotal}{' '}
                    entries
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-[70px]"
                                >
                                    {perPage}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <DropdownMenuItem
                                        key={pageSize}
                                        onClick={() =>
                                            onPerPageChange?.(pageSize)
                                        }
                                    >
                                        {pageSize}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {displayCurrentPage} of {displayLastPage}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => onPageChange?.(1)}
                            disabled={
                                !paginationMeta || displayCurrentPage === 1
                            }
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                                onPageChange?.(displayCurrentPage - 1)
                            }
                            disabled={
                                !paginationMeta
                                    ? !table.getCanPreviousPage()
                                    : displayCurrentPage === 1
                            }
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                                onPageChange?.(displayCurrentPage + 1)
                            }
                            disabled={
                                !paginationMeta
                                    ? !table.getCanNextPage()
                                    : displayCurrentPage === displayLastPage
                            }
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => onPageChange?.(displayLastPage)}
                            disabled={
                                !paginationMeta ||
                                displayCurrentPage === displayLastPage
                            }
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            {selectedRowId
                                ? 'Are you sure you want to delete this record? This action cannot be undone.'
                                : `Are you sure you want to delete ${selectedRowIds.length} selected record(s)? This action cannot be undone.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setSelectedRowId(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={
                                selectedRowId
                                    ? confirmSingleAction
                                    : confirmBulkAction
                            }
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Restore Confirmation Dialog */}
            <Dialog
                open={isRestoreDialogOpen}
                onOpenChange={setIsRestoreDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Restoration</DialogTitle>
                        <DialogDescription>
                            {selectedRowId
                                ? 'Are you sure you want to restore this record?'
                                : `Are you sure you want to restore ${selectedRowIds.length} selected record(s)?`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsRestoreDialogOpen(false);
                                setSelectedRowId(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={
                                selectedRowId
                                    ? confirmSingleAction
                                    : confirmBulkAction
                            }
                        >
                            Restore
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Force Delete Confirmation Dialog */}
            <Dialog
                open={isForceDeleteDialogOpen}
                onOpenChange={setIsForceDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Force Deletion</DialogTitle>
                        <DialogDescription>
                            {selectedRowId
                                ? 'Are you sure you want to permanently delete this record? This action cannot be undone and will permanently remove the record from the database.'
                                : `Are you sure you want to permanently delete ${selectedRowIds.length} selected record(s)? This action cannot be undone and will permanently remove the records from the database.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsForceDeleteDialogOpen(false);
                                setSelectedRowId(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={
                                selectedRowId
                                    ? confirmSingleAction
                                    : confirmBulkAction
                            }
                        >
                            Force Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
