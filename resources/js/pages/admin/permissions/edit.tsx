// Removed Wayfinder import - using hardcoded URLs instead
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { RiArrowLeftLine } from '@remixicon/react';

interface Permission {
    id: number;
    name: string;
}

interface EditPermissionPageProps {
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
        title: 'Edit Permission',
        href: '',
    },
];

export default function EditPermission({ permission }: EditPermissionPageProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: permission.name,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/permissions/${permission.id}`);
    };

    // Core permissions that cannot be edited
    const corePermissions = [
        'view tokens',
        'create tokens',
        'edit tokens',
        'delete tokens',
        'manage users',
        'manage roles',
        'manage permissions',
        'manage settings',
    ];

    const isCorePermission = corePermissions.includes(permission.name);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Permission: ${permission.name}`} />
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Permission</h1>
                        <p className="text-muted-foreground">
                            Modify the permission details
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/permissions">
                            <RiArrowLeftLine className="mr-2 h-4 w-4" />
                            Back to Permissions
                        </Link>
                    </Button>
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Permission</CardTitle>
                            <CardDescription>
                                Update the permission details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isCorePermission ? (
                                <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-4">
                                    <h3 className="font-medium text-yellow-800">
                                        Core Permission
                                    </h3>
                                    <p className="text-sm text-yellow-700">
                                        This is a core system permission and cannot be modified.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Permission Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g., view users, manage settings"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" asChild>
                                            <Link href="/admin/permissions">
                                                Cancel
                                            </Link>
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Updating...' : 'Update Permission'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}