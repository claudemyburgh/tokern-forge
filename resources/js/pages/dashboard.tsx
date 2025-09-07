import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Dashboard1 } from '@/components/ui/charts/dashboard-1';
import { MyChart } from '@/components/my-chart';

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
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="relative  rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Dashboard1/>
                    </div>
                    <div className="relative  rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Dashboard1/>
                    </div>
                    <div className="relative  rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Dashboard1/>

                        {/*<PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />*/}
                    </div>
                    <div className="relative  rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Dashboard1/>

                        {/*<PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />*/}
                    </div>
                </div>
                <MyChart/>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, fugiat in mollitia quam rerum voluptas. Ad consectetur id iusto molestias nisi praesentium quaerat quisquam sequi velit. Dolorem perferendis provident voluptate.
                    {/*<PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />*/}
                </div>
            </div>
        </AppLayout>
    );
}
