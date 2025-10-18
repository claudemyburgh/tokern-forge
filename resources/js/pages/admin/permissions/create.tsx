import PermissionController from '@/actions/App/Http/Controllers/Admin/PermissionController';
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

interface CreatePermissionForm {
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '#',
    },
    {
        title: 'Permissions',
        href: PermissionController.index.url(),
    },
    {
        title: 'Create Permission',
        href: PermissionController.create.url(),
    },
];

export default function CreatePermission() {
    const { data, setData, post, processing, errors } = useForm<CreatePermissionForm>({
        name: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(PermissionController.store.url());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Permission" />
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Create Permission</h1>
                        <p className="text-muted-foreground">
                            Add a new permission to the system
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={PermissionController.index.url()}>
                            <RiArrowLeftLine className="mr-2 h-4 w-4" />
                            Back to Permissions
                        </Link>
                    </Button>
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>New Permission</CardTitle>
                            <CardDescription>
                                Enter the details for the new permission
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                        <Link href={PermissionController.index.url()}>
                                            Cancel
                                        </Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Permission'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}