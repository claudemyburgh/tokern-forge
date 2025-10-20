// Removed Wayfinder import - using hardcoded URLs instead
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { RiArrowLeftLine } from '@remixicon/react';

interface CreatePermissionForm {
    name: string;
    guards: string[];
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
        title: 'Create Permission',
        href: '/admin/permissions/create',
    },
];

export default function CreatePermission() {
    const { data, setData, post, processing, errors } = useForm<CreatePermissionForm>({
        name: '',
        guards: ['web'], // Default to web guard
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/permissions');
    };

    const toggleGuard = (guard: string) => {
        if (data.guards.includes(guard)) {
            setData('guards', data.guards.filter(g => g !== guard));
        } else {
            setData('guards', [...data.guards, guard]);
        }
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
                        <Link href="/admin/permissions">
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

                                <div className="space-y-2">
                                    <Label>Guards</Label>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="web-guard"
                                                checked={data.guards.includes('web')}
                                                onCheckedChange={() => toggleGuard('web')}
                                            />
                                            <label
                                                htmlFor="web-guard"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Web
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="api-guard"
                                                checked={data.guards.includes('api')}
                                                onCheckedChange={() => toggleGuard('api')}
                                            />
                                            <label
                                                htmlFor="api-guard"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                API
                                            </label>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Select which authentication guards this permission should be available for.
                                    </p>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" asChild>
                                        <Link href="/admin/permissions">
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