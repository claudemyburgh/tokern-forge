# Permissions System Documentation

This project uses Spatie Laravel Permission package to handle roles and permissions. Here's how to use the implemented features:

## Roles and Permissions

### Roles
- **super-admin**: Has all permissions
- **admin**: Can view, create, edit tokens and manage users
- **pro**: Can view and create tokens
- **free**: Can only view tokens (assigned by default to new users)

### Permissions
- `view tokens`: View token listings
- `create tokens`: Create new tokens
- `edit tokens`: Edit existing tokens
- `delete tokens`: Delete tokens
- `manage users`: Manage user accounts
- `manage settings`: Access advanced settings

## UserObserver

New users are automatically assigned the `free` role when they are created, thanks to the `UserObserver`. This ensures that all new users have at least the basic permissions.

## Backend Usage

### Middleware
The `permission` middleware can be used to protect routes:

```php
// Single permission
Route::middleware(['auth', 'permission:view tokens'])->get('/tokens', function () {
    // Only users with "view tokens" permission can access
});

// Multiple permissions (user needs at least one)
Route::middleware(['auth', 'permission:create tokens|edit tokens'])->get('/editor', function () {
    // Users with either "create tokens" OR "edit tokens" permission can access
});

// Multiple permissions (user needs all)
Route::middleware(['auth', 'permission:create tokens', 'permission:edit tokens'])->get('/admin', function () {
    // Users need BOTH "create tokens" AND "edit tokens" permissions
});
```

### In Controllers
You can also check permissions directly in controllers:

```php
use Illuminate\Support\Facades\Auth;

public function index()
{
    // Using Laravel's built-in authorization
    $this->authorize('view tokens');
    
    // Or manually checking
    if (!Auth::user()->can('view tokens')) {
        abort(403);
    }
    
    // Your logic here
}
```

## Frontend Usage

### Can Component
The `Can` component works similarly to Blade's [@can](file:///c:/www/laravel-web3/token-forge/vendor/pestphp/pest/src/Exceptions/InvalidExpectation.php#L9-L9) directive:

```tsx
import Can from '@/components/can';

// Show content only if user has permission
<Can permissions="create tokens">
    <Button>Create Token</Button>
</Can>

// Show fallback content if user doesn't have permission
<Can permissions="manage users" fallback={<p>You don't have permission to manage users</p>}>
    <Button>Manage Users</Button>
</Can>

// Check for roles
<Can roles="admin">
    <p>Only admins can see this</p>
</Can>

// Check for multiple permissions (user needs at least one)
<Can permissions={['manage users', 'manage settings']}>
    <p>User can manage either users or settings</p>
</Can>
```

### usePermissions Hook
The `usePermissions` hook provides programmatic access to permission checking:

```tsx
import { usePermissions } from '@/hooks/use-permissions';

export default function MyComponent() {
    const { hasPermission, hasRole, hasAnyPermission, hasAnyRole } = usePermissions();
    
    // Check single permission
    if (hasPermission('create tokens')) {
        // Show create button
    }
    
    // Check multiple permissions (user needs all)
    if (hasPermission(['create tokens', 'edit tokens'])) {
        // Show advanced editor
    }
    
    // Check multiple permissions (user needs at least one)
    if (hasAnyPermission(['manage users', 'manage settings'])) {
        // Show admin panel
    }
    
    // Check roles
    if (hasRole('admin')) {
        // Show admin features
    }
    
    return (
        // Your component JSX
    );
}
```

## Seeding
Roles and permissions are seeded using the `RolePermissionSeeder`. To re-seed:

```bash
php artisan db:seed --class=RolePermissionSeeder
```

## Adding New Permissions
1. Add the new permission to the `$permissions` array in `RolePermissionSeeder`
2. Run the seeder: `php artisan db:seed --class=RolePermissionSeeder`
3. Assign the permission to appropriate roles in the seeder
4. Use in your code as needed

## Assigning Roles to Users
```php
use App\Models\User;
use Spatie\Permission\Models\Role;

$user = User::find(1);
$user->assignRole('admin');

// Or by role name
$user->assignRole('super-admin');

// Check if user has role
if ($user->hasRole('admin')) {
    // User is an admin
}
```