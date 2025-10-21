import { Badge } from '@/components/ui/badge';
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
}

interface User {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string;
    avatar_small: string;
    is_super_admin: boolean;
    roles: Role[];
    permissions: string[];
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface ShowUserPageProps {
    user: User;
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
        title: 'View',
        href: '#',
    },
];

export default function ShowUser({ user }: ShowUserPageProps) {
    // Format dates
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not verified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">User Details</h1>
                        <p className="text-muted-foreground">
                            View details for the user "{user.name}"
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/users">
                                <RiArrowLeftLine className="mr-2 h-4 w-4" />
                                Back to Users
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/admin/users/${user.id}/edit`}>
                                <RiEditLine className="mr-2 h-4 w-4" />
                                Edit User
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                            <CardDescription>
                                Details about the user "{user.name}"
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <h3 className="text-lg font-medium">
                                        Basic Information
                                    </h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Name
                                            </label>
                                            <p className="mt-1">{user.name}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Email
                                            </label>
                                            <p className="mt-1">{user.email}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Email Verified
                                            </label>
                                            <p className="mt-1">
                                                {formatDate(user.email_verified_at)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Created At
                                            </label>
                                            <p className="mt-1">
                                                {formatDate(user.created_at)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Last Updated
                                            </label>
                                            <p className="mt-1">
                                                {formatDate(user.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium">
                                        Role Assignments
                                    </h3>
                                    <div className="mt-4">
                                        {user.roles && user.roles.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {user.roles.map((role) => (
                                                    <Badge
                                                        key={role.id}
                                                        variant="secondary"
                                                    >
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">
                                                This user has no roles assigned.
                                            </p>
                                        )}
                                    </div>

                                    <h3 className="mt-6 text-lg font-medium">
                                        Permissions
                                    </h3>
                                    <div className="mt-4">
                                        {user.permissions &&
                                        user.permissions.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {user.permissions.map(
                                                    (permission, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                        >
                                                            {permission}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">
                                                This user has no specific
                                                permissions assigned.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}