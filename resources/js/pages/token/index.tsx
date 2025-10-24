import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
                    <Card
                        key={item.id}
                        className="@container/card min-h-[6.5rem] w-full"
                    >
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
                ))}
            </InfiniteScroll>
        </AppLayout>
    );
}
