import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { RiArrowLeftLine } from '@remixicon/react';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface CreateRolePageProps {
    permissions: {
        [key: string]: Permission[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '/admin',
    },
    {
        title: 'Roles',
        href: '/admin/roles',
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function CreateRole({ permissions }: CreateRolePageProps) {
    // Initialize form data with empty permissions for each guard
    const initializePermissions = () => {
        const initialPermissions: { [key: string]: string[] } = {};
        if (permissions) {
            Object.keys(permissions).forEach(guard => {
                initialPermissions[guard] = [];
            });
        }
        return initialPermissions;
    };

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: initializePermissions(),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/roles');
    };

    const togglePermission = (guard: string, permissionName: string) => {
        const currentPermissions = data.permissions[guard] || [];
        if (currentPermissions.includes(permissionName)) {
            setData('permissions', {
                ...data.permissions,
                [guard]: currentPermissions.filter(name => name !== permissionName)
            });
        } else {
            setData('permissions', {
                ...data.permissions,
                [guard]: [...currentPermissions, permissionName]
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Create Role</h1>
                        <p className="text-muted-foreground">
                            Add a new role to the system
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/roles">
                            <RiArrowLeftLine className="mr-2 size-4" />
                            Back to Roles
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>New Role</CardTitle>
                        <CardDescription>
                            Enter the details for the new role
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Role Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="e.g., editor"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Assign Permissions
                                </label>
                                <div className="mt-2 space-y-4">
                                    {Object.entries(permissions).map(([guard, guardPermissions]) => (
                                        <div key={guard} className="border rounded-lg p-4">
                                            <h3 className="text-lg font-medium mb-2 capitalize">
                                                {guard} Permissions
                                            </h3>
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                                                {guardPermissions.map((permission) => (
                                                    <div key={`${guard}-${permission.id}`} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`permission-${guard}-${permission.id}`}
                                                            checked={data.permissions[guard]?.includes(permission.name) || false}
                                                            onCheckedChange={() => togglePermission(guard, permission.name)}
                                                        />
                                                        <label
                                                            htmlFor={`permission-${guard}-${permission.id}`}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {permission.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/admin/roles">
                                        Cancel
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Role'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}