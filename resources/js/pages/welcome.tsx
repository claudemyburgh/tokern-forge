import Hero from '@/components/hero';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <LandingLayout>
            <Head title="Welcome" />
            <Hero />
        </LandingLayout>
    );
}
