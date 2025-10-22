'use client';

import InputError from '@/components/input-error';
import MemeUpload from '@/components/meme-upload';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
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
import { MagicCard } from '@/components/ui/magic-card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Coins, Lock, RefreshCw, Snowflake, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

type TokenFormData = {
    name: string;
    symbol: string;
    decimal: number;
    supply: number;
    creator_share: number;
    description: string;
    website: string;
    twitter: string;
    discord: string;
    telegram: string;
    facebook: string;
    youtube: string;
    network: string;
    revoke_mint: boolean;
    revoke_update: boolean;
    revoke_freeze: boolean;
    image: File | null;
    action?: 'draft' | 'create';
    wallet_address?: string;
};

export default function TokenForm() {
    const form = useForm<TokenFormData>({
        name: '',
        symbol: '',
        decimal: 9,
        supply: 1_000_000,
        creator_share: 10,
        description: '',
        website: '',
        twitter: '',
        discord: '',
        telegram: '',
        facebook: '',
        youtube: '',
        network: 'devnet',
        revoke_mint: false,
        revoke_update: false,
        revoke_freeze: true,
        image: null,
    });

    const handleImageChange = (file: File | null) => {
        form.setData('image', file);
    };

    const handleSubmit = (action: 'draft' | 'create') => {
        form.setData('action', action);

        form.post('/tokens', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const formatSupply = (value: number) =>
        new Intl.NumberFormat('en-US').format(value);

    // 🧠 Auto-save draft every 5 seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (form.data.name || form.data.symbol) {
                form.setData('action', 'draft');
                form.post('/tokens/draft', { preserveScroll: true });
            }
        }, 5000);

        return () => clearTimeout(timeout);
    }, [form.data]);

    return (
        <MagicCard className={`block rounded-xl p-0.5`}>
            <Card className={`p-b0 border-transparent pb-0 dark:bg-card/98`}>
                <CardHeader className="space-y-3 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                            <Coins className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">
                                Token Details
                            </CardTitle>
                            <CardDescription>
                                Configure your token parameters
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="font-semibold">
                                    Token Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Doge Rocket"
                                    className="h-10"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            {/* Symbol */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="symbol"
                                    className="font-semibold"
                                >
                                    Symbol{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="symbol"
                                    placeholder="e.g., DGRKT"
                                    className="h-10"
                                    value={form.data.symbol}
                                    onChange={(e) => {
                                        const value = e.target.value
                                            .toUpperCase()
                                            .replace(/[^A-Z0-9]/g, '');
                                        form.setData('symbol', value);
                                    }}
                                    maxLength={10}
                                />
                                <InputError message={form.errors.symbol} />
                            </div>

                            {/* Decimals */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="decimal"
                                    className="font-semibold"
                                >
                                    Decimals{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="decimal"
                                    type="number"
                                    min="0"
                                    max="18"
                                    className="h-10"
                                    value={form.data.decimal}
                                    onChange={(e) =>
                                        form.setData(
                                            'decimal',
                                            Number.parseInt(e.target.value),
                                        )
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Standard is 9 for Solana tokens
                                </p>
                                <InputError message={form.errors.decimal} />
                            </div>

                            {/* Supply */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="supply"
                                    className="font-semibold"
                                >
                                    Total Supply{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="supply"
                                    type="number"
                                    min="1"
                                    className="h-10"
                                    value={form.data.supply}
                                    onChange={(e) =>
                                        form.setData(
                                            'supply',
                                            Number.parseInt(e.target.value),
                                        )
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    {formatSupply(form.data.supply)} tokens
                                </p>
                                <InputError message={form.errors.supply} />
                            </div>

                            {/* Creator Share */}
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="description"
                                className="font-semibold"
                            >
                                Description{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Tell the world about your token..."
                                value={form.data.description}
                                className="min-h-28 resize-none"
                                onChange={(e) =>
                                    form.setData('description', e.target.value)
                                }
                                maxLength={1000}
                            />
                            <div className="flex items-center justify-between">
                                <InputError message={form.errors.description} />
                                <p className="text-xs text-muted-foreground">
                                    {form.data.description.length}/1000
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-1.5">
                        <MemeUpload onFileChange={handleImageChange} />
                        <InputError message={form.errors.image} />
                        <p className="text-xs text-muted-foreground">
                            Upload a square image (recommended: 512x512px or
                            larger)
                        </p>
                    </div>

                    {/* Social Links Accordion */}
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full rounded-md border-2"
                    >
                        <AccordionItem
                            value="social-links"
                            className="rounded-md bg-muted/50 px-4"
                        >
                            <AccordionTrigger className="hover:no-underline">
                                <div className="space-y-0.5 text-left">
                                    <p className="font-semibold">
                                        Social Links{' '}
                                        <small className={`text-mute`}>
                                            (Optional)
                                        </small>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Add your project's social media presence
                                    </p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {[
                                        'website',
                                        'twitter',
                                        'discord',
                                        'telegram',
                                        'facebook',
                                        'youtube',
                                    ].map((field) => (
                                        <div
                                            key={field}
                                            className="space-y-1.5"
                                        >
                                            <Label
                                                className="text-sm font-semibold capitalize"
                                                htmlFor={field}
                                            >
                                                {field}
                                            </Label>
                                            <Input
                                                id={field}
                                                type="url"
                                                placeholder={`https://${field}.com/yourproject`}
                                                className="h-9"
                                                value={
                                                    (form.data as any)[field]
                                                }
                                                onChange={(e) =>
                                                    form.setData(
                                                        field as keyof TokenFormData,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    (form.errors as any)[field]
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Token Authority */}
                    <div className="space-y-2.5">
                        <h3 className="font-semibold">Token Authority</h3>

                        <div className="flex items-start justify-between gap-3 rounded-md border-2 bg-muted/50 p-4">
                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                    <Snowflake className="h-4 w-4 text-primary" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="font-semibold">
                                        Revoke Freeze Authority
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Prevent freezing of token accounts
                                    </p>
                                </div>
                            </div>
                            <Switch checked={true} disabled={true} />
                        </div>

                        <div className="flex items-start justify-between gap-3 rounded-md border-2 bg-muted/50 p-4">
                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                    <Lock className="h-4 w-4 text-primary" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="font-semibold">
                                        Revoke Mint Authority
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Lock the supply permanently
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={form.data.revoke_mint}
                                onCheckedChange={(checked) =>
                                    form.setData('revoke_mint', checked)
                                }
                            />
                        </div>

                        <div className="flex items-start justify-between gap-3 rounded-md border-2 bg-muted/50 p-4">
                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                    <RefreshCw className="h-4 w-4 text-primary" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="font-semibold">
                                        Revoke Update Authority
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Make metadata immutable
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={form.data.revoke_update}
                                onCheckedChange={(checked) =>
                                    form.setData('revoke_update', checked)
                                }
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-12 font-semibold shadow-sm"
                            onClick={() => handleSubmit('draft')}
                            disabled={form.processing}
                        >
                            Save Draft
                        </Button>

                        <Button
                            type="button"
                            size="lg"
                            className="h-12 font-semibold shadow-lg transition-all hover:scale-[1.02]"
                            onClick={() => handleSubmit('create')}
                            disabled={form.processing}
                        >
                            {form.processing ? (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Create Token
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>

                <CardFooter className="flex-col gap-2 rounded-t-sm rounded-b-lg border-t bg-muted/30 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                            Creation Fee:
                        </span>
                        <span className="text-lg font-bold text-foreground">
                            0.3 SOL
                        </span>
                    </div>
                    <p className="text-center text-xs text-muted-foreground">
                        Includes token creation, metadata upload, and liquidity
                        setup
                    </p>
                </CardFooter>
            </Card>
        </MagicCard>
    );
}
