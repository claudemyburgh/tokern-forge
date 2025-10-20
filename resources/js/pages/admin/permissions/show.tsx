// Removed Wayfinder import - using hardcoded URLs instead
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { RiArrowLeftLine, RiEditLine } from '@remixicon/react';

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
    roles: Role[];
    created_at: string;
    updated_at: string;
}

interface ShowPermissionPageProps {
    permission: Permission;
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
    {
        title: 'View',
        href: '#',
    },
];

export default function ShowPermission({ permission }: ShowPermissionPageProps) {
    // Format dates
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Core permissions that cannot be deleted
    const corePermissions = [
        'view tokens', 'create tokens', 'edit tokens', 'delete tokens', 
        'manage users', 'manage roles', 'manage permissions', 'manage settings'
    ];

    const isCorePermission = corePermissions.includes(permission.name);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Permission: ${permission.name}`} />
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Permission Details</h1>
                        <p className="text-muted-foreground">
                            View details for the permission "{permission.name}"
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/permissions">
                                <RiArrowLeftLine className="mr-2 h-4 w-4" />
                                Back to Permissions
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/admin/permissions/${permission.id}/edit`}>
                                <RiEditLine className="mr-2 h-4 w-4" />
                                Edit Permission
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Permission Information</CardTitle>
                            <CardDescription>
                                Details about the permission "{permission.name}"
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <h3 className="text-lg font-medium">Basic Information</h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Permission Name
                                            </label>
                                            <p className="mt-1">{permission.name}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Created At
                                            </label>
                                            <p className="mt-1">{formatDate(permission.created_at)}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Last Updated
                                            </label>
                                            <p className="mt-1">{formatDate(permission.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-medium">Role Assignments</h3>
                                    <div className="mt-4">
                                        {permission.roles.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {permission.roles.map((role) => (
                                                    <span 
                                                        key={role.id}
                                                        className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                                                    >
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">
                                                This permission is not assigned to any roles.
                                            </p>
                                        )}
                                    </div>
                                    
                                    {isCorePermission && (
                                        <div className="mt-6 rounded-md bg-yellow-50 p-4">
                                            <p className="text-sm text-yellow-800">
                                                This is a core permission and cannot be deleted.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}