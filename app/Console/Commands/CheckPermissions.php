<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CheckPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-permissions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check permissions and roles in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Permissions:');
        $permissions = Permission::all();
        foreach ($permissions as $permission) {
            $this->line("  - {$permission->name} ({$permission->guard_name})");
        }

        $this->info('Roles:');
        $roles = Role::all();
        foreach ($roles as $role) {
            $this->line("  - {$role->name} ({$role->guard_name})");
        }

        // Check a specific assignment
        $webAdminRole = Role::where('name', 'admin')->where('guard_name', 'web')->first();
        if ($webAdminRole) {
            $this->info('Web Admin Role Permissions:');
            $webPermissions = $webAdminRole->permissions;
            foreach ($webPermissions as $permission) {
                $this->line("  - {$permission->name}");
            }
        }

        $apiAdminRole = Role::where('name', 'admin')->where('guard_name', 'api')->first();
        if ($apiAdminRole) {
            $this->info('API Admin Role Permissions:');
            $apiPermissions = $apiAdminRole->permissions;
            foreach ($apiPermissions as $permission) {
                $this->line("  - {$permission->name}");
            }
        }
    }
}