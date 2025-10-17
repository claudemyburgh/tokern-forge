'use client';

import InputError from '@/components/input-error';
import MemeUpload from '@/components/meme-upload';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

type TokenFormData = {
    name: string;
    symbol: string;
    decimal: number;
    supply: number;
    description: string;
    website: string;
    twitter: string;
    discord: string;
    telegram: string;
    facebook: string;
    youtube: string;
    revoke_mint: boolean;
    revoke_update: boolean;
    image: File | null;
    action?: 'draft' | 'create';
    wallet_address?: string;
};

export default function TokenForm() {
    const [walletAddress, setWalletAddress] = useState('');
    const [showSocialMedia, setShowSocialMedia] = useState(false);

    const form = useForm<TokenFormData>({
        name: '',
        symbol: '',
        decimal: 9,
        supply: 1_000_000,
        description: '',
        website: '',
        twitter: '',
        discord: '',
        telegram: '',
        facebook: '',
        youtube: '',
        revoke_mint: false,
        revoke_update: false,
        image: null,
    });

    const handleImageChange = (file: File | null) => {
        form.setData('image', file);
    };

    const handleInitialSubmit = () => {};

    const handleSubmit = (action: 'draft' | 'create') => {
        form.setData('action', action);
        if (action === 'create' && walletAddress) {
            form.setData('wallet_address', walletAddress);
        }

        form.post('/tokens', {
            forceFormData: true,
            onSuccess: () => {},
        });
    };

    const formatSupply = (value: number) =>
        new Intl.NumberFormat('en-US').format(value);

    return (
        <>
            <Card className="border border-border bg-muted/20 shadow-lg">
                <CardHeader className="space-y-3 pb-6">
                    <CardTitle className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-center text-4xl font-bold">
                        Launch Token
                    </CardTitle>
                    <CardDescription className="mx-auto max-w-md text-center text-base leading-relaxed">
                        Create your own token with custom parameters and social
                        links.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Token Fields */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className={`grid gap-y-2`}>
                            <Label htmlFor="name">
                                Name{' '}
                                <span className={`text-destructive`}>
                                    *
                                </span>{' '}
                            </Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className={`grid gap-y-2`}>
                            <Label htmlFor="symbol">
                                Symbol{' '}
                                <span className={`text-destructive`}>
                                    *
                                </span>{' '}
                            </Label>
                            <Input
                                id="symbol"
                                value={form.data.symbol}
                                onChange={(e) =>
                                    form.setData(
                                        'symbol',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                maxLength={10}
                            />
                            <InputError message={form.errors.symbol} />
                        </div>

                        <div className={`grid gap-y-2`}>
                            <Label htmlFor="decimal">
                                Decimals{' '}
                                <span className={`text-destructive`}>
                                    *
                                </span>{' '}
                            </Label>
                            <Input
                                id="decimal"
                                type="number"
                                min="0"
                                max="18"
                                value={form.data.decimal}
                                onChange={(e) =>
                                    form.setData(
                                        'decimal',
                                        parseInt(e.target.value),
                                    )
                                }
                            />
                            <InputError message={form.errors.decimal} />
                        </div>

                        <div className={`grid gap-y-2`}>
                            <Label htmlFor="supply">
                                Supply{' '}
                                <span className={`text-destructive`}>
                                    *
                                </span>{' '}
                            </Label>
                            <Input
                                id="supply"
                                type="number"
                                min="1"
                                value={form.data.supply}
                                onChange={(e) =>
                                    form.setData(
                                        'supply',
                                        parseInt(e.target.value),
                                    )
                                }
                            />
                            <InputError message={form.errors.supply} />
                        </div>
                    </div>

                    <div className={`grid gap-y-2`}>
                        <Label htmlFor="description">
                            Description{' '}
                            <span className={`text-destructive`}>*</span>{' '}
                        </Label>
                        <Textarea
                            id="description"
                            value={form.data.description}
                            className={`min-h-40`}
                            onChange={(e) =>
                                form.setData('description', e.target.value)
                            }
                            maxLength={1000}
                        />
                        <InputError message={form.errors.description} />
                        <p className="text-right text-xs text-muted-foreground">
                            {form.data.description.length}/1000 characters
                        </p>
                    </div>

                    {/* Image Upload */}
                    <MemeUpload onFileChange={handleImageChange} />
                    <InputError message={form.errors.image} />

                    {/* Social Media Toggle */}
                    <div className="my-3 flex items-center justify-between rounded-lg border-2 bg-muted/30 p-4">
                        <div className={`grid gap-y-2`}>
                            <Label htmlFor="show-social">
                                Add Social Links
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Include project links like website or X
                            </p>
                        </div>
                        <Switch
                            id="show-social"
                            checked={showSocialMedia}
                            onCheckedChange={setShowSocialMedia}
                        />
                    </div>

                    {showSocialMedia && (
                        <div className="grid grid-cols-1 gap-4 rounded-md border bg-muted/30 p-4 md:grid-cols-2">
                            {[
                                'website',
                                'twitter',
                                'discord',
                                'telegram',
                                'facebook',
                                'youtube',
                            ].map((field) => (
                                <div key={field} className={`grid gap-2`}>
                                    <Label
                                        className={`capitalize`}
                                        htmlFor={field}
                                    >
                                        {field}
                                    </Label>
                                    <Input
                                        id={field}
                                        type="url"
                                        value={(form.data as any)[field]}
                                        onChange={(e) =>
                                            form.setData(
                                                field as keyof TokenFormData,
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={(form.errors as any)[field]}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Authority Switches */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border-2 bg-muted/30 p-4">
                            <div className={`grid gap-y-2`}>
                                <Label htmlFor="revoke-mint">
                                    Revoke Mint Authority
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Make supply fixed permanently
                                </p>
                            </div>
                            <Switch
                                id="revoke-mint"
                                checked={form.data.revoke_mint}
                                onCheckedChange={(checked) =>
                                    form.setData('revoke_mint', checked)
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border-2 bg-muted/30 p-4">
                            <div className={`grid gap-y-2`}>
                                <Label htmlFor="revoke-update">
                                    Revoke Update Authority
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Prevent future metadata changes
                                </p>
                            </div>
                            <Switch
                                id="revoke-update"
                                checked={form.data.revoke_update}
                                onCheckedChange={(checked) =>
                                    form.setData('revoke_update', checked)
                                }
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="button"
                        size="lg"
                        className="h-12 w-full"
                        onClick={handleInitialSubmit}
                        disabled={form.processing}
                    >
                        {form.processing ? 'Creating...' : 'Create Token'}
                    </Button>
                </CardContent>

                <CardFooter className="justify-center border-t pt-6">
                    <p className="text-sm text-muted-foreground">
                        Creation Fee:{' '}
                        <span className="font-semibold text-foreground">
                            0.3 SOL
                        </span>
                    </p>
                </CardFooter>
            </Card>
        </>
    );
}
