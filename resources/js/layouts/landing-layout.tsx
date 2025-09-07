import Footer from '@/components/footer';
import { AppHeader } from '@/components/app-header';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LandingLayoutProps {
    children: ReactNode;
    className?: string;
}

export default function LandingLayout({ children, className }: LandingLayoutProps) {
    return (
        <div className={cn('flex min-h-screen flex-col', className)}>
            <AppHeader />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
