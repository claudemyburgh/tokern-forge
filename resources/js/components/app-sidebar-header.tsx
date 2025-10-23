import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useWallet } from '@solana/wallet-adapter-react';
import {
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { connected, publicKey } = useWallet();

    const formatPublicKey = (key: string | undefined) => {
        if (!key) return '';
        return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
    };

    return (
        <header className="fixed top-0 z-50 mx-0 flex h-15 w-full shrink-0 items-center border-b border-sidebar-border/50 bg-background/95 backdrop-blur transition-[left,width] ease-linear group-has-data-[state=collapsed]/sidebar-wrapper:left-0 group-has-data-[state=collapsed]/sidebar-wrapper:w-full group-has-data-[state=expanded]/sidebar-wrapper:left-[var(--sidebar-width,16rem)] group-has-data-[state=expanded]/sidebar-wrapper:w-[calc(100vw-var(--sidebar-width,16rem))] supports-[backdrop-filter]:bg-background/60 md:px-4">
            {/* Left Navigation Group */}
            <div className="flex items-center gap-3 pr-2 pl-4 md:pr-4 md:pl-0">
                <SidebarTrigger className="shrink-0" />
                <Separator orientation="vertical" className={`!h-6`} />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Spacer for balanced layout */}
            <div className="min-w-0 flex-1" />

            {/* Right Interactive Controls Group */}
            <div className="flex items-center gap-2 pr-4 md:pr-6">
                <AppearanceToggleDropdown />
                <WalletMultiButton
                    className="wallet-adapter-button"
                    startIcon={<></>}
                    style={{
                        backgroundColor: 'transparent',
                        color: 'inherit',
                        fontSize: '0.875rem',
                        height: '2.25rem',
                        padding: '0 0.75rem',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.375rem',
                    }}
                >
                    {connected ? formatPublicKey(publicKey?.toBase58()) : 'Connect Wallet'}
                </WalletMultiButton>
            </div>
        </header>
    );
}