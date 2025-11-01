import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Show() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Market Place Show" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Doloremque itaque minus perferendis ratione rerum, ullam.
                Commodi, ex fugit, harum hic iste maxime necessitatibus,
                officiis perferendis quam quos similique soluta voluptatem?
            </div>
        </AppLayout>
    );
}
