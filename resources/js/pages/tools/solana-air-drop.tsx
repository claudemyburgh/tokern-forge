import ToolsIndexPageController from '@/actions/App/Http/Controllers/Tools/ToolsIndexPageController';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: ToolsIndexPageController().url,
    },
    {
        title: 'Solana Air Drop',
        href: ToolsIndexPageController().url,
    },
];

export default function SolanaAirDrop() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tools" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
                enim ipsum itaque laudantium molestias reiciendis, repudiandae
                totam. Asperiores culpa cum enim minima nobis non, optio
                perspiciatis, veniam vitae voluptas voluptate.
            </div>
        </AppLayout>
    );
}
