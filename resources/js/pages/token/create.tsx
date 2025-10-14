import TokenForm from '@/components/token-form';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tokens',
        href: dashboard().url,
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <TokenForm />
            </div>
        </AppLayout>
    );
}
