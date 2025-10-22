import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { AppSidebar } from '@/components/new-sidebar';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar className={`z-60`} />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="mt-15">{children}</div>
            </AppContent>
        </AppShell>
    );
}
