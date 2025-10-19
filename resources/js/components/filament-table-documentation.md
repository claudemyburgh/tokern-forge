# Enhanced Filament Table Component

This component mimics the Laravel Filament table UI with enhanced features and functionality.

## Features

1. **Search Functionality** - Global search across all columns
2. **Column Filtering** - Show/hide columns as needed
3. **Bulk Actions** - Delete, restore, and force delete operations
4. **Pagination** - Configurable rows per page and navigation
5. **Sorting** - Click on column headers to sort data
6. **Filtering** - Custom filter options for different data views
7. **Loading States** - Visual feedback during data operations
8. **Responsive Design** - Works on all device sizes

## Usage

```typescript
import { EnhancedTable } from '@/components/enhanced-filament-table';

// Define your columns
const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  // ... more columns
];

// In your component
<EnhancedTable 
  columns={columns} 
  data={yourData} 
  softDelete={true}
  columnVisibility={{
    'created_at': false,
    'updated_at': false,
  }}
  perPage={currentPerPage}
  onPerPageChange={handlePerPageChange}
  onDelete={handleBulkDelete}
  onRestore={handleBulkRestore}
  onForceDelete={handleBulkForceDelete}
  paginationMeta={paginationMetadata}
  onPageChange={handlePageChange}
  filters={filterOptions}
  onFilterChange={handleFilterChange}
  currentFilter={currentFilter}
  onSearch={handleSearch}
  searchPlaceholder="Search records..."
  searchQuery={currentSearch}
  loading={loadingState}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| columns | ColumnDef[] | Table columns definition |
| data | TData[] | Data to display in the table |
| softDelete | boolean | Enable soft delete functionality |
| columnVisibility | VisibilityState | Initial column visibility state |
| perPage | number | Number of rows per page |
| onPerPageChange | function | Callback when per page changes |
| onDelete | function | Callback for bulk delete action |
| onRestore | function | Callback for bulk restore action |
| onForceDelete | function | Callback for bulk force delete action |
| paginationMeta | object | Pagination metadata |
| onPageChange | function | Callback when page changes |
| filters | FilterOption[] | Available filter options |
| onFilterChange | function | Callback when filter changes |
| currentFilter | string | Current active filter |
| onSearch | function | Callback when search query changes |
| searchPlaceholder | string | Placeholder text for search input |
| searchQuery | string | Current search query |
| loading | boolean | Loading state indicator |

## Customization

The component can be customized by modifying the following files:

1. `enhanced-table.tsx` - Main component implementation
2. `use-table-state.ts` - Hook for managing table state
3. CSS classes in the component for styling adjustments

## Best Practices

1. Always provide meaningful column headers
2. Use appropriate cell renderers for complex data
3. Implement proper error handling in action callbacks
4. Use loading states to provide feedback during operations
5. Test with various data sizes to ensure performance
