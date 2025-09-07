'use client'

import { Button } from '@/components/ui/button';

import { Link } from '@inertiajs/react';

import {Zap} from "lucide-react";



export default function Hero() {
    return (
        <div className="w-full relative isolate">


        <section className="max-w-xl mx-auto flex flex-col items-center justify-center gap-6 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:py-32">

            <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm mb-0 bg-white/50 dark:bg-black/50 backdrop-blur-md">
                <Zap className="mr-2 h-4 w-4 text-primary fill-primary" />
                <span className="text-muted-foreground">Powered by Solana</span>
            </div>
            <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 text-shadow-md text-shadow-primary/50 dark:text-shadow-black/50 ">
                <h1 className="text-3xl text-balance font-bungee font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
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
