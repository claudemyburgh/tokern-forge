import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function Hero() {
    return (
        <section className="container flex flex-col items-center justify-center gap-6 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:py-32">
            <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
                    Build Your Next App with Ease
                </h1>
                <p className="max-w-[700px] text-lg text-muted-foreground">
                    A beautifully designed, accessible, and customizable component library for React.
                </p>
            </div>
            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/register">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="#features">Learn More</Link>
                </Button>
            </div>
        </section>
    );
}
