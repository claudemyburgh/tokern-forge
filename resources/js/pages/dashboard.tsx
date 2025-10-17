import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Can from '@/components/can';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Token Management</CardTitle>
                            <CardDescription>Manage your digital tokens</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Can permissions="view tokens">
                                <Button asChild>
                                    <a href="/tokens">View Tokens</a>
                                </Button>
                            </Can>
                            <Can permissions="create tokens" fallback={<p className="text-sm text-muted-foreground">Upgrade to Pro or Admin plan to create tokens</p>}>
                                <Button asChild variant="secondary" className="ml-2">
                                    <a href="/tokens/create">Create Token</a>
                                </Button>
                            </Can>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>User Plan</CardTitle>
                            <CardDescription>Your current subscription level</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Can roles="super-admin">
                                <p className="text-lg font-semibold text-green-600">Super Admin</p>
                                <p className="text-sm text-muted-foreground">Full access to all features</p>
                            </Can>
                            <Can roles="admin" fallback={null}>
                                <p className="text-lg font-semibold text-blue-600">Admin</p>
                                <p className="text-sm text-muted-foreground">Manage tokens and users</p>
                            </Can>
                            <Can roles="pro" fallback={null}>
                                <p className="text-lg font-semibold text-purple-600">Pro User</p>
                                <p className="text-sm text-muted-foreground">Create and edit tokens</p>
                            </Can>
                            <Can roles="free" fallback={null}>
                                <p className="text-lg font-semibold text-gray-600">Free User</p>
                                <p className="text-sm text-muted-foreground">View tokens only</p>
                            </Can>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                            <CardDescription>What you can do</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Can permissions="manage users">
                                <Button variant="outline">Manage Users</Button>
                            </Can>
                            <Can permissions="manage settings">
                                <Button variant="outline" className="ml-2">Settings</Button>
                            </Can>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}