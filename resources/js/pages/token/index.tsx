import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { MagicCard } from '@/components/ui/magic-card';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Head, InfiniteScroll } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tokens',
        href: dashboard().url,
    },
];

export default function Index({ tokens }) {
    // safe token array
    const tokenList = Array.isArray(tokens?.data) ? tokens.data : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <InfiniteScroll
                data="tokens"
                className="col-span-full grid grid-cols-1 gap-4 p-4 lg:grid-cols-4"
                loading={() => (
                    <div
                        className={`grid w-full min-w-full place-content-center py-6`}
                    >
                        <Spinner className={`size-12`} />
                    </div>
                )}
            >
                {tokenList.map((item) => (
                    <MagicCard
                        key={item.id}
                        className={`isolate flex flex-col overflow-clip rounded-xl p-0.5`}
                    >
                        <Card className="@container/card flex !h-full w-full flex-1 dark:bg-card/90">
                            <CardHeader>
                                <div className="flex flex-col @lg/card:flex-row">
                                    <div
                                        className={`mx-auto size-22 shrink-0 rounded-full bg-accent-foreground @lg/card:mr-0 @lg/card:ml-3 @lg/card:size-14`}
                                    ></div>
                                    <div>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{item.name}</span>
                                            <Badge
                                                variant={`outline`}
                                                className="rounded-full"
                                            >
                                                {item.symbol}
                                            </Badge>
                                        </CardTitle>
                                        <small>{item.created_at}</small>
                                        <CardDescription
                                            className={`line-clamp-3 text-sm`}
                                        >
                                            {item.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </MagicCard>
                ))}
            </InfiniteScroll>
        </AppLayout>
    );
}
