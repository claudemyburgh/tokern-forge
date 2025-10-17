import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,900"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] p-6 text-[#1b1b18] lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full text-sm not-has-[nav]:hidden">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="mb-6 text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                        <Sparkles className="h-4 w-4" />
                        Solana Token Creator
                    </div>
                    <h1 className="mb-2 text-4xl font-black tracking-tight text-balance text-primary md:text-6xl">
                        Launch Your Meme Token
                    </h1>
                    <p className="mx-auto max-w-2xl leading-relaxed text-pretty text-muted-foreground">
                        Create and deploy your custom Solana token in minutes.
                        No coding required.
                    </p>
                </div>
            </div>
        </>
    );
}
