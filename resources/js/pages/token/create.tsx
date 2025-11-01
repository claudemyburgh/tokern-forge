import TokenForm from '@/components/token-form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tokens',
        href: dashboard().url,
    },
];

export default function Create() {
    const [previewData, setPreviewData] = useState({
        name: 'Your Token Name',
        symbol: 'SYMBOL',
        supply: 1000000,
        description: 'Your token description will appear here...',
        image: null as string | null,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Token" />
            <div className="relative mx-auto p-4">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Token Creation Form */}
                    <div className="h-fit">
                        <TokenForm setPreviewData={setPreviewData} />
                    </div>

                    <div>
                        {/* Token Preview - Sticky */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Token Preview</CardTitle>
                                    <CardDescription>
                                        See how your token will appear
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-6 dark:from-gray-800 dark:to-gray-900">
                                        <div className="mb-4 flex items-center space-x-4">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
                                                {previewData.image ? (
                                                    <img
                                                        src={previewData.image}
                                                        alt="Token preview"
                                                        className="h-full w-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-2xl">
                                                        🎭
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold">
                                                    {previewData.name ||
                                                        'Your Token Name'}
                                                </h4>
                                                <p className="text-muted-foreground">
                                                    $
                                                    {previewData.symbol ||
                                                        'SYMBOL'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Total Supply:
                                                </span>
                                                <span className="font-medium">
                                                    {previewData.supply?.toLocaleString() ||
                                                        '1,000,000'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Decimals:
                                                </span>
                                                <span className="font-medium">
                                                    9
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-sm text-muted-foreground">
                                                {previewData.description ||
                                                    'Your token description will appear here...'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>How It Works</CardTitle>
                                    <CardDescription>
                                        Follow these steps to create your token
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                <span className="text-sm font-bold text-primary">
                                                    1
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground">
                                                Fill in your token details on
                                                the left
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                <span className="text-sm font-bold text-primary">
                                                    2
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground">
                                                See the live preview update in
                                                real-time
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                <span className="text-sm font-bold text-primary">
                                                    3
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground">
                                                Click "Create Token" when you're
                                                ready
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
