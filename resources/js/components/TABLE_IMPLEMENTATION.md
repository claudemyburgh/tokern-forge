# Filament-like Table Implementation

This document describes the implementation of a Laravel Filament-like table component for the application.

## Components Created

1. **EnhancedFilamentTable** - Main table component with Filament-like UI
2. **useTableState** - Custom hook for managing table state
3. **Route utilities** - Helper functions for route management

## Features Implemented

### 1. Search Functionality
- Global search across all columns
- Real-time filtering as users type
- Backend integration with database queries

### 2. Column Management
- Show/hide columns dynamically
- "Show All" / "Hide All" toggle
- Persistent column visibility settings

### 3. Bulk Actions
- Delete selected records
- Restore soft-deleted records
- Force delete records permanently
- Confirmation dialogs for destructive actions

### 4. Pagination
- Configurable rows per page (10, 20, 30, 40, 50)
- First, Previous, Next, Last page navigation
- Current page indicator

### 5. Sorting
- Click on column headers to sort
- Visual indicators for sort direction
- Multi-column sorting support

### 6. Filtering
- Custom filter options (Without Trash, With Trash, Only Trash, All Records)
- Filter persistence across navigation

### 7. Loading States
- Visual feedback during data operations
- Disabled controls during loading
- Smooth user experience

## File Structure

```
resources/js/
├── components/
│   ├── enhanced-filament-table.tsx
│   └── filament-table-documentation.md
├── hooks/
│   └── use-table-state.ts
├── pages/admin/users/
│   └── index.tsx
├── routes/
│   ├── utils.ts
│   └── admin/
│       └── users.ts
└── TABLE_IMPLEMENTATION.md
```

## Backend Integration

### UserController.php
- Added search functionality to index method
- Improved pagination parameter validation
- Enhanced query building with search filters

### User Model
- No changes needed as search is handled in controller

## Frontend Integration

### Users Index Page
- Implemented useTableState hook for state management
- Integrated EnhancedFilamentTable component
- Added loading states for better UX
- Proper error handling

## Usage Example

```typescript
import { EnhancedFilamentTable } from '@/components/enhanced-filament-table';
import { useTableState } from '@/hooks/use-table-state';

// In your component
const { 
  currentFilter, 
  currentPerPage, 
  currentSearch, 
  loading,
  handleFilterChange,
  handlePerPageChange,
  handlePageChange,
  handleSearch
} = useTableState({
  initialFilter: 'withoutTrash',
  initialPerPage: 15,
  initialSearch: '',
  initialPage: 1,
  baseUrl: '/admin/users'
});

<EnhancedFilamentTable 
  columns={columns}
  data={tableData}
  softDelete={true}
  perPage={currentPerPage}
  onPerPageChange={handlePerPageChange}
  onDelete={handleBulkDelete}
  onRestore={handleBulkRestore}
  onForceDelete={handleBulkForceDelete}
  paginationMeta={paginationMeta}
  onPageChange={handlePageChange}
  filters={filterOptions}
  onFilterChange={handleFilterChange}
  currentFilter={currentFilter}
  onSearch={handleSearch}
  searchPlaceholder="Search users..."
  searchQuery={currentSearch}
  loading={loading}
/>
```

## Styling

The component uses:
- Tailwind CSS for styling
- Lucide React icons
- Shadcn/ui components
- Responsive design principles

## Future Enhancements

1. Column-specific filtering
2. Export functionality (CSV, Excel)
3. Advanced search with field-specific filters
4. Custom column rendering options
5. Keyboard navigation support
6. Accessibility improvements