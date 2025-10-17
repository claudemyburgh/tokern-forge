import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile',
        href: dashboard().url,
    },
];

export default function Profile() {
    const { hasPermission, hasRole } = usePermissions();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>User Profile</CardTitle>
                        <CardDescription>
                            Manage your account settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">
                                    Account Information
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Update your profile details
                                </p>
                            </div>

                            {hasPermission('manage users') && (
                                <div className="rounded-lg border p-4">
                                    <h4 className="font-medium">Admin Panel</h4>
                                    <p className="text-sm text-muted-foreground">
                                        You have access to user management
                                    </p>
                                    <Button className="mt-2">
                                        Manage Users
                                    </Button>
                                </div>
                            )}

                            {hasRole('super-admin') && (
                                <div className="rounded-lg border p-4">
                                    <h4 className="font-medium">
                                        Super Admin Panel
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        You have access to all system settings
                                    </p>
                                    <Button className="mt-2">
                                        System Settings
                                    </Button>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button>Update Profile</Button>
                                {hasPermission([
                                    'delete tokens',
                                    'manage users',
                                ]) && (
                                    <Button variant="secondary">
                                        Advanced Settings
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
