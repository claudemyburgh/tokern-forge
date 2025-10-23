'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-wallets';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { type ReactNode, useMemo } from 'react';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

export function SolanaProvider({ children }: { children: ReactNode }) {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *   - Solana Wallet Standard
             *
             * If you wish to support other wallets, you can initialize them here.
             * For now, we support Phantom, Solflare, Coinbase Wallet, and MetaMask.
             */
            new PhantomWalletAdapter(),
            new CoinbaseWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            // Note: MetaMask is included automatically through the Wallet Standard 
            // when they have the Solana extension installed
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}