'use client'

import { Button } from '@/components/ui/button';

import { Link } from '@inertiajs/react';
import { NorthernLightsBackground } from '../../../components/ui/shadcn-io/northern-lights-background';



export default function Hero() {
    return (
        <div className="w-full relative isolate">
            <NorthernLightsBackground
                className={`min-h-150 absolute -top-20 -z-10 opacity-25 dark:opacity-75`}

                colorStops={["#ec4899", "#a855f7", "#06b6d4"]}
                amplitude={2.0}
                speed={0.25}
            />

        <section className="max-w-xl mx-auto flex flex-col items-center justify-center gap-6 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:py-32">

            <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2">
                <h1 className="text-3xl text-balance font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">

                    Create the Next Viral Meme Coin
                </h1>
                <p className="max-w-[700px] text-balance text-lg text-muted-foreground">
                    Join thousands of creators who've launched successful meme coins. No coding required, just pure meme magic and community power.
                </p>
            </div>
            <div className="flex gap-4">
                <Button size={`lg`} asChild>
                    <Link href="/register">Get Started</Link>
                </Button>
                <Button size={`lg`} variant="outline" asChild>
                    <Link href="#features">Learn More</Link>
                </Button>
            </div>
        </section>
        </div>

    );
}
