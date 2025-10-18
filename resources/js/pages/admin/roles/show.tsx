import roles from '@/routes/admin/roles';
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

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
}

interface ShowRolePageProps {
    role: Role;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '#',
    },
    {
        title: 'Roles',
        href: roles.index.url(),
    },
    {
        title: 'View',
        href: '#',
    },
];

export default function ShowRole({ role }: ShowRolePageProps) {
    // Format dates
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Core roles that cannot be deleted
    const coreRoles = ['super-admin'];
    const isCoreRole = coreRoles.includes(role.name);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Role: ${role.name}`} />
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Role Details</h1>
                        <p className="text-muted-foreground">
                            View details for the role "{role.name}"
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={roles.index.url()}>
                                <RiArrowLeftLine className="mr-2 h-4 w-4" />
                                Back to Roles
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={roles.edit.url({ role: role.id })}>
                                <RiEditLine className="mr-2 h-4 w-4" />
                                Edit Role
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Information</CardTitle>
                            <CardDescription>
                                Details about the role "{role.name}"
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <h3 className="text-lg font-medium">Basic Information</h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Role Name
                                            </label>
                                            <p className="mt-1">{role.name}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Created At
                                            </label>
                                            <p className="mt-1">{formatDate(role.created_at)}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Last Updated
                                            </label>
                                            <p className="mt-1">{formatDate(role.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-medium">Permission Assignments</h3>
                                    <div className="mt-4">
                                        {role.permissions.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {role.permissions.map((permission) => (
                                                    <span 
                                                        key={permission.id}
                                                        className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                                                    >
                                                        {permission.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">
                                                This role has no permissions assigned.
                                            </p>
                                        )}
                                    </div>
                                    
                                    {isCoreRole && (
                                        <div className="mt-6 rounded-md bg-yellow-50 p-4">
                                            <p className="text-sm text-yellow-800">
                                                This is a core role and cannot be deleted.
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