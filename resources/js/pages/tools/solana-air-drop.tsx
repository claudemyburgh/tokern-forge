import ToolsIndexPageController from '@/actions/App/Http/Controllers/Tools/ToolsIndexPageController';
import AppLayout from '@/layouts/app-layout';
import SolanaAirdropForm from '@/components/solana-airdrop-form';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tools',
        href: ToolsIndexPageController().url,
    },
    {
        title: 'Solana Air Drop',
        href: ToolsIndexPageController().url,
    },
];

export default function SolanaAirDrop() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Solana Devnet Airdrop" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-center py-8">
                    <SolanaAirdropForm />
                </div>
            </div>
        </AppLayout>
    );
}
