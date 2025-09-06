import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { type ReactNode } from 'react';

interface LandingLayoutProps {
    children: ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
