import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LandingLayoutProps {
    children: ReactNode;
    className?: string;
}

export default function LandingLayout({ children, className }: LandingLayoutProps) {
    return (
        <div className={cn('flex min-h-screen flex-col', className)}>
            <Navigation />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
