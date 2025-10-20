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
import { Head, Link, useForm } from '@inertiajs/react';
import { RiArrowLeftLine } from '@remixicon/react';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    avatar_small?: string;
    is_super_admin?: boolean;
    roles: Role[];
    permissions?: string[];
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

interface EditUserPageProps {
    user: User;
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '#',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

export default function EditUser({ user, roles }: EditUserPageProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        roles: user.roles ? user.roles.map((role: { id: number; name: string }) => role.name) : [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    const toggleRole = (roleName: string) => {
        if (data.roles.includes(roleName)) {
            setData('roles', data.roles.filter((name) => name !== roleName));
        } else {
            setData('roles', [...data.roles, roleName]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Edit User</h1>
                        <p className="text-muted-foreground">
                            Modify the user details
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/users">
                            <RiArrowLeftLine className="mr-2 size-4" />
                            Back to Users
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit User</CardTitle>
                        <CardDescription>
                            Update the details for the user "{user.name}"
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="John Doe"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="john@example.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Leave blank to keep current password"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-destructive">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Leave blank to keep current password"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Assign Roles
                                </label>
                                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                                    {roles && roles.length > 0 ? (
                                        roles.map((role) => (
                                            <div key={role.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`role-${role.id}`}
                                                    checked={data.roles?.includes(role.name) || false}
                                                    onChange={() => toggleRole(role.name)}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <label
                                                    htmlFor={`role-${role.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {role.name}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No roles available</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/admin/users">
                                        Cancel
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update User'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}