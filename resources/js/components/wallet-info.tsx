'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function WalletInfo() {
    const { connected, publicKey, disconnect } = useWallet();

    if (!connected) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Wallet Connected</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div>
                        <label className="text-sm font-medium">Public Key</label>
                        <p className="font-mono text-sm break-all">
                            {publicKey?.toBase58()}
                        </p>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={disconnect}
                        className="mt-2"
                    >
                        Disconnect Wallet
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}