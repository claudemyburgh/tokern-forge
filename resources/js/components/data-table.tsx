import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Columns2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  softDelete?: boolean
  columnVisibility?: VisibilityState
  perPage?: number
  onPerPageChange?: (perPage: number) => void
  onDelete?: (ids: string[]) => void
  onRestore?: (ids: string[]) => void
  onForceDelete?: (ids: string[]) => void
  paginationMeta?: {
    current_page: number
    last_page: number
    from: number
    to: number
    total: number
    per_page: number
  }
  onPageChange?: (page: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  softDelete = false,
  columnVisibility: initialColumnVisibility = {},
  perPage = 15,
  onPerPageChange,
  onDelete,
  onRestore,
  onForceDelete,
  paginationMeta,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility)
  const [rowSelection, setRowSelection] = React.useState({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = React.useState(false)
  const [isForceDeleteDialogOpen, setIsForceDeleteDialogOpen] = React.useState(false)
  const [actionType, setActionType] = React.useState<'delete' | 'restore' | 'forceDelete'>('delete')

  // Add selection column as the first column
  const selectableColumns = React.useMemo(() => [
    {
      id: "select",
      header: ({ table }: { table: any }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    ...columns,
  ], [columns])

  const table = useReactTable({
    data,
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
  })

  // Update table pagination when perPage changes
  React.useEffect(() => {
    table.setPageSize(perPage)
  }, [perPage, table])

  const selectedRowIds = React.useMemo(() => {
    return Object.keys(rowSelection).map(key => {
      const rowIndex = parseInt(key)
      const row = table.getRowModel().rows[rowIndex]
      // Assuming the data has an 'id' property
      return (row.original as any).id?.toString() || rowIndex.toString()
    })
  }, [rowSelection, table])

  const handleBulkAction = (type: 'delete' | 'restore' | 'forceDelete') => {
    setActionType(type)
    if (type === 'delete') {
      setIsDeleteDialogOpen(true)
    } else if (type === 'restore') {
      setIsRestoreDialogOpen(true)
    } else {
      setIsForceDeleteDialogOpen(true)
    }
  }

  const confirmBulkAction = () => {
    if (selectedRowIds.length === 0) return

    switch (actionType) {
      case 'delete':
        onDelete?.(selectedRowIds)
        setIsDeleteDialogOpen(false)
        break
      case 'restore':
        onRestore?.(selectedRowIds)
        setIsRestoreDialogOpen(false)
        break
      case 'forceDelete':
        onForceDelete?.(selectedRowIds)
        setIsForceDeleteDialogOpen(false)
        break
    }
    
    // Clear selection after action
    table.toggleAllRowsSelected(false)
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex gap-2">
          {Object.keys(rowSelection).length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="destructive" size="sm">
                  Bulk Actions ({Object.keys(rowSelection).length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                  Delete
                </DropdownMenuItem>
                {softDelete && (
                  <>
                    <DropdownMenuItem onClick={() => handleBulkAction('restore')}>
                      Restore
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('forceDelete')}>
                      Force Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                <Columns2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
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
                      {header.isPlaceholder
                        ? null
                        : (
                            <div className="flex items-center">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() && (
                                <>
                                  {header.column.getIsSorted() === 'asc' ? (
                                    <ChevronUp className="ml-1 size-3 opacity-30" />
                                  ) : header.column.getIsSorted() === 'desc' ? (
                                    <ChevronDown className="ml-1 size-3 opacity-30" />
                                  ) : (
                                    <ChevronsUpDown className="ml-1 size-3 opacity-30" />
                                  )}
                                </>
                              )}
                            </div>
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={selectableColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
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
                    onClick={() => onPerPageChange?.(pageSize)}
                  >
                    {pageSize}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {paginationMeta?.current_page || table.getState().pagination.pageIndex + 1} of{" "}
            {paginationMeta?.last_page || table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onPageChange?.(1)}
              disabled={!paginationMeta || paginationMeta.current_page === 1}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange?.(paginationMeta ? paginationMeta.current_page - 1 : table.getState().pagination.pageIndex)}
              disabled={!paginationMeta ? !table.getCanPreviousPage() : (paginationMeta?.current_page === 1)}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange?.(paginationMeta ? paginationMeta.current_page + 1 : table.getState().pagination.pageIndex + 2)}
              disabled={!paginationMeta ? !table.getCanNextPage() : (paginationMeta?.current_page === paginationMeta?.last_page)}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onPageChange?.(paginationMeta?.last_page || table.getPageCount())}
              disabled={!paginationMeta || paginationMeta.current_page === paginationMeta.last_page}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRowIds.length} selected record(s)? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmBulkAction}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Restoration</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore {selectedRowIds.length} selected record(s)?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBulkAction}>
              Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Force Delete Confirmation Dialog */}
      <Dialog open={isForceDeleteDialogOpen} onOpenChange={setIsForceDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Force Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {selectedRowIds.length} selected record(s)? 
              This action cannot be undone and will permanently remove the records from the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsForceDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmBulkAction}>
              Force Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}