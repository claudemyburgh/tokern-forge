import solBg from '@/../img/solana-bg.jpg';
import SolanaAirDropController from '@/actions/App/Http/Controllers/Tools/SolanaAirDropController';
import ToolsIndexPageController from '@/actions/App/Http/Controllers/Tools/ToolsIndexPageController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { MagicCard } from '@/components/ui/magic-card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: ToolsIndexPageController().url,
    },
];
export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tools" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <MagicCard
                        className={`isolate block overflow-clip rounded-xl p-0.5`}
                    >
                        <Card
                            className={`p-b0 border-transparent dark:bg-card/98`}
                        >
                            <CardHeader className={`relative z-5`}>
                                <CardTitle>Solana Airdrop</CardTitle>
                                <CardDescription>
                                    <Badge>Free</Badge> for Solana DevNet
                                </CardDescription>
                            </CardHeader>
                            <CardContent className={`relative z-5`}>
                                <CardDescription>
                                    A Solana Devnet airdrop is a free
                                    distribution of test tokens on Solana’s
                                    development network. These tokens are not
                                    real and hold no monetary value. Developers
                                    use them to test transactions, build smart
                                    contracts, and simulate real network
                                    activity without spending real SOL. Devnet
                                    airdrops help users experiment safely before
                                    deploying to mainnet.
                                </CardDescription>
                                <Button
                                    asChild
                                    // variant="secondary"
                                    className="mt-3"
                                >
                                    <Link
                                        href={SolanaAirDropController.index()}
                                        prefetch
                                    >
                                        Airdrop
                                    </Link>
                                </Button>
                            </CardContent>
                            <img
                                className={`absolute inset-0 min-h-fit min-w-full mask-radial-[50%_100%] mask-radial-from-55% mask-radial-at-top-right opacity-60`}
                                src={solBg}
                                alt="solana bavkground"
                            />
                        </Card>
                    </MagicCard>{' '}
                    <MagicCard
                        className={`isolate block overflow-clip rounded-xl p-0.5`}
                    >
                        <Card
                            className={`p-b0 border-transparent dark:bg-card/98`}
                        >
                            <CardHeader className={`relative z-5`}>
                                <CardTitle>Solana Airdrop</CardTitle>
                                <CardDescription>
                                    <Badge>Free</Badge> for Solana DevNet
                                </CardDescription>
                            </CardHeader>
                            <CardContent className={`relative z-5`}>
                                <CardDescription>
                                    A Solana Devnet airdrop is a free
                                    distribution of test tokens on Solana’s
                                    development network. These tokens are not
                                    real and hold no monetary value. Developers
                                    use them to test transactions, build smart
                                    contracts, and simulate real network
                                    activity without spending real SOL. Devnet
                                    airdrops help users experiment safely before
                                    deploying to mainnet.
                                </CardDescription>
                                <Button
                                    asChild
                                    // variant="secondary"
                                    className="mt-3"
                                >
                                    <a href="/tokens/create">Airdrop</a>
                                </Button>
                            </CardContent>
                            <img
                                className={`absolute inset-0 min-h-fit min-w-full mask-radial-[50%_100%] mask-radial-from-55% mask-radial-at-top-right opacity-60`}
                                src={solBg}
                                alt="solana bavkground"
                            />
                        </Card>
                    </MagicCard>{' '}
                    <MagicCard
                        className={`isolate block overflow-clip rounded-xl p-0.5`}
                    >
                        <Card
                            className={`p-b0 border-transparent dark:bg-card/98`}
                        >
                            <CardHeader className={`relative z-5`}>
                                <CardTitle>Solana Airdrop</CardTitle>
                                <CardDescription>
                                    <Badge>Free</Badge> for Solana DevNet
                                </CardDescription>
                            </CardHeader>
                            <CardContent className={`relative z-5`}>
                                <CardDescription>
                                    A Solana Devnet airdrop is a free
                                    distribution of test tokens on Solana’s
                                    development network. These tokens are not
                                    real and hold no monetary value. Developers
                                    use them to test transactions, build smart
                                    contracts, and simulate real network
                                    activity without spending real SOL. Devnet
                                    airdrops help users experiment safely before
                                    deploying to mainnet.
                                </CardDescription>
                                <Button
                                    asChild
                                    // variant="secondary"
                                    className="mt-3"
                                >
                                    <a href="/tokens/create">Airdrop</a>
                                </Button>
                            </CardContent>
                            <img
                                className={`absolute inset-0 min-h-fit min-w-full mask-radial-[50%_100%] mask-radial-from-55% mask-radial-at-top-right opacity-60`}
                                src={solBg}
                                alt="solana bavkground"
                            />
                        </Card>
                    </MagicCard>
                </div>
            </div>
        </AppLayout>
    );
}
