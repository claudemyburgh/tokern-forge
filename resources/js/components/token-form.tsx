'use client';

import {
    DialogStack,
    DialogStackBody,
    DialogStackContent,
    DialogStackDescription,
    DialogStackFooter,
    DialogStackHeader,
    DialogStackNext,
    DialogStackOverlay,
    DialogStackTitle,
} from '@/components/dialog-stack';
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
import { router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Facebook,
    Globe,
    MessageCircle,
    Send,
    Wallet,
    Youtube,
} from 'lucide-react';
import { useState } from 'react';

export default function TokenForm() {
    const { errors } = usePage().props as { errors: Record<string, string> };
    const [showSocialMedia, setShowSocialMedia] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        decimal: 9,
        supply: 1000000,
        description: '',
        website: '',
        twitter: '',
        discord: '',
        telegram: '',
        facebook: '',
        youtube: '',
        revoke_mint: false,
        revoke_update: false,
    });
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedAction, setSelectedAction] = useState<
        'draft' | 'create' | null
    >(null);

    const handleImageChange = (file: File | null) => {
        setImageFile(file);
    };

    const handleFormChange = (
        field: string,
        value: string | number | boolean,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleInitialSubmit = () => {
        if (
            !formData.name ||
            !formData.symbol ||
            !formData.description ||
            !imageFile
        ) {
            alert('Please fill in all required fields and upload an image');
            return;
        }
        setDialogOpen(true);
    };

    const submitForm = (action: 'draft' | 'create') => {
        setIsSubmitting(true);
        const formDataObj = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            formDataObj.append(key, String(value));
        });

        if (imageFile) {
            formDataObj.append('image', imageFile);
        }

        formDataObj.append('action', action);

        if (action === 'create' && walletAddress) {
            formDataObj.append('wallet_address', walletAddress);
        }

        router.post('/tokens', formDataObj, {
            forceFormData: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setDialogOpen(false);
                setSelectedAction(null);
                setWalletConnected(false);
                setWalletAddress('');
            },
            onError: (errors) => {
                console.error('Form submission error:', errors);
                setIsSubmitting(false);
                setDialogOpen(false);
            },
        });
    };

    const handleActionSelect = (action: 'draft' | 'create') => {
        setSelectedAction(action);
        if (action === 'draft') {
            submitForm('draft');
            setDialogOpen(false);
        }
    };

    const handleConnectWallet = async () => {
        try {
            // TODO: Implement actual Solana wallet connection
            // Example with Phantom wallet:
            // if (window.solana && window.solana.isPhantom) {
            //     const response = await window.solana.connect();
            //     setWalletAddress(response.publicKey.toString());
            //     setWalletConnected(true);
            // }

            // For demo purposes:
            setTimeout(() => {
                setWalletAddress(
                    '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
                );
                setWalletConnected(true);
            }, 1000);
        } catch (error) {
            console.error('Wallet connection failed', error);
        }
    };

    const handleConfirmCreate = () => {
        submitForm('create');
    };

    const formatSupply = (value: number) => {
        return new Intl.NumberFormat('en-US').format(value);
    };

    const socialIcons = [
        {
            key: 'website',
            icon: Globe,
            url: formData.website,
            label: 'Website',
        },
        {
            key: 'twitter',
            icon: MessageCircle,
            url: formData.twitter,
            label: 'Twitter/X',
        },
        {
            key: 'discord',
            icon: MessageCircle,
            url: formData.discord,
            label: 'Discord',
        },
        {
            key: 'telegram',
            icon: Send,
            url: formData.telegram,
            label: 'Telegram',
        },
        {
            key: 'facebook',
            icon: Facebook,
            url: formData.facebook,
            label: 'Facebook',
        },
        {
            key: 'youtube',
            icon: Youtube,
            url: formData.youtube,
            label: 'YouTube',
        },
    ].filter((item) => item.url);

    return (
        <>
            <Card className="border border-border bg-gradient-to-br from-background via-background to-muted/20 shadow-lg">
                <CardHeader className="space-y-3 pb-6">
                    <CardTitle className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-center text-4xl font-bold">
                        Launch Token
                    </CardTitle>
                    <CardDescription className="mx-auto max-w-md text-center text-base leading-relaxed">
                        Create your own token with custom parameters and social
                        media links. Configure authority settings to ensure
                        security.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-6">
                        {/* Token Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                Token Details
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="My Awesome Token"
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleFormChange(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="symbol">
                                        Symbol{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="symbol"
                                        type="text"
                                        placeholder="MAT"
                                        value={formData.symbol}
                                        onChange={(e) =>
                                            handleFormChange(
                                                'symbol',
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        maxLength={10}
                                        required
                                    />
                                    <InputError message={errors.symbol} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="decimal">
                                        Decimals{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="decimal"
                                        type="number"
                                        min="0"
                                        max="18"
                                        value={formData.decimal}
                                        onChange={(e) =>
                                            handleFormChange(
                                                'decimal',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={errors.decimal} />
                                    <p className="text-xs text-muted-foreground">
                                        Standard is 9 for Solana tokens
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="supply">
                                        Total Supply{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="supply"
                                        type="number"
                                        min="1"
                                        value={formData.supply}
                                        onChange={(e) =>
                                            handleFormChange(
                                                'supply',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={errors.supply} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    className="min-h-28 resize-none"
                                    placeholder="Describe your token and its purpose..."
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleFormChange(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    maxLength={1000}
                                    required
                                />
                                <InputError message={errors.description} />
                                <p className="text-right text-xs text-muted-foreground">
                                    {formData.description.length}/1000
                                    characters
                                </p>
                            </div>
                        </div>

                        {/* Token Image Section */}
                        <div className="space-y-4">
                            <MemeUpload onFileChange={handleImageChange} />
                        </div>

                        {/* Social Media Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border-2 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                                <div className="space-y-1">
                                    <label
                                        htmlFor="show-social"
                                        className="cursor-pointer text-sm font-semibold"
                                    >
                                        Add Social Media Links
                                    </label>
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        Include links to your project's social
                                        media profiles
                                    </p>
                                </div>
                                <Switch
                                    id="show-social"
                                    checked={showSocialMedia}
                                    onCheckedChange={setShowSocialMedia}
                                />
                            </div>

                            {showSocialMedia && (
                                <div className="animate-in space-y-4 pt-2 duration-300 fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {[
                                            {
                                                id: 'website',
                                                label: 'Website',
                                                placeholder:
                                                    'https://example.com',
                                            },
                                            {
                                                id: 'twitter',
                                                label: 'Twitter/X',
                                                placeholder:
                                                    'https://x.com/username',
                                            },
                                            {
                                                id: 'discord',
                                                label: 'Discord',
                                                placeholder:
                                                    'https://discord.gg/invite',
                                            },
                                            {
                                                id: 'telegram',
                                                label: 'Telegram',
                                                placeholder:
                                                    'https://t.me/username',
                                            },
                                            {
                                                id: 'facebook',
                                                label: 'Facebook',
                                                placeholder:
                                                    'https://facebook.com/page',
                                            },
                                            {
                                                id: 'youtube',
                                                label: 'YouTube',
                                                placeholder:
                                                    'https://youtube.com/@channel',
                                            },
                                        ].map((field) => (
                                            <div
                                                key={field.id}
                                                className="space-y-2"
                                            >
                                                <Label htmlFor={field.id}>
                                                    {field.label}
                                                </Label>
                                                <Input
                                                    id={field.id}
                                                    type="url"
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    value={
                                                        formData[
                                                            field.id as keyof typeof formData
                                                        ] as string
                                                    }
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            field.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            field.id as keyof typeof errors
                                                        ]
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Authority Settings Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                Authority Settings
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-4 rounded-lg border-2 bg-muted/30 p-4">
                                    <div className="flex-1 space-y-1">
                                        <label className="flex items-center gap-2 text-sm font-semibold">
                                            Revoke Freeze Authority
                                            <span className="text-xs font-normal text-destructive">
                                                (required)
                                            </span>
                                        </label>
                                        <p className="text-xs leading-relaxed text-muted-foreground">
                                            Disable the ability to freeze token
                                            accounts. Once revoked, no one can
                                            restrict token transfers.
                                        </p>
                                    </div>
                                    <Switch disabled checked />
                                </div>

                                <div className="flex items-start justify-between gap-4 rounded-lg border-2 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                                    <div className="flex-1 space-y-1">
                                        <label
                                            htmlFor="revoke-mint"
                                            className="cursor-pointer text-sm font-semibold"
                                        >
                                            Revoke Mint Authority
                                        </label>
                                        <p className="text-xs leading-relaxed text-muted-foreground">
                                            Remove the ability to create new
                                            tokens. Supply becomes fixed.
                                        </p>
                                    </div>
                                    <Switch
                                        id="revoke-mint"
                                        checked={formData.revoke_mint}
                                        onCheckedChange={(
                                            checked: string | number | boolean,
                                        ) =>
                                            handleFormChange(
                                                'revoke_mint',
                                                checked,
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-start justify-between gap-4 rounded-lg border-2 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                                    <div className="flex-1 space-y-1">
                                        <label
                                            htmlFor="revoke-update"
                                            className="cursor-pointer text-sm font-semibold"
                                        >
                                            Revoke Update Authority
                                        </label>
                                        <p className="text-xs leading-relaxed text-muted-foreground">
                                            Disable the ability to change token
                                            metadata. Prevents future updates.
                                        </p>
                                    </div>
                                    <Switch
                                        id="revoke-update"
                                        checked={formData.revoke_update}
                                        onCheckedChange={(
                                            checked: string | number | boolean,
                                        ) =>
                                            handleFormChange(
                                                'revoke_update',
                                                checked,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="button"
                            size="lg"
                            className="h-12 w-full text-base font-semibold"
                            onClick={handleInitialSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Token'}
                        </Button>
                    </div>
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

            {/* DialogStack for multistep process */}
            <DialogStack open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogStackOverlay />
                <DialogStackBody>
                    {/* Step 1: Choose Action */}
                    <DialogStackContent>
                        <DialogStackHeader>
                            <DialogStackTitle>Choose Action</DialogStackTitle>
                            <DialogStackDescription>
                                Save your token as a draft or proceed to create
                                it on the blockchain.
                            </DialogStackDescription>
                        </DialogStackHeader>
                        <div className="space-y-3 py-4">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => handleActionSelect('draft')}
                                className="w-full justify-start"
                                disabled={isSubmitting}
                            >
                                <div className="text-left">
                                    <div className="font-semibold">
                                        Save as Draft
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Save your token details for later
                                    </div>
                                </div>
                            </Button>
                            <DialogStackNext asChild>
                                <Button
                                    size="lg"
                                    onClick={() => setSelectedAction('create')}
                                    className="w-full justify-start"
                                >
                                    <div className="text-left">
                                        <div className="font-semibold">
                                            Save and Create
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Deploy your token to the blockchain
                                        </div>
                                    </div>
                                </Button>
                            </DialogStackNext>
                        </div>
                    </DialogStackContent>

                    {/* Step 2: Connect Wallet */}
                    <DialogStackContent>
                        <DialogStackHeader>
                            <DialogStackTitle>Connect Wallet</DialogStackTitle>
                            <DialogStackDescription>
                                Connect your Solana wallet to deploy your token
                                on-chain.
                            </DialogStackDescription>
                        </DialogStackHeader>
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="rounded-full bg-primary/10 p-4">
                                <Wallet className="h-12 w-12 text-primary" />
                            </div>
                            {!walletConnected ? (
                                <>
                                    <p className="text-center text-sm text-muted-foreground">
                                        You'll need to connect your Solana
                                        wallet to proceed with token creation.
                                    </p>
                                    <DialogStackNext asChild>
                                        <Button
                                            onClick={handleConnectWallet}
                                            size="lg"
                                        >
                                            Connect Wallet
                                        </Button>
                                    </DialogStackNext>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <span>Wallet Connected</span>
                                </div>
                            )}
                        </div>
                    </DialogStackContent>

                    {/* Step 3: Review & Confirm */}
                    <DialogStackContent>
                        <DialogStackHeader>
                            <DialogStackTitle>
                                Review Your Token
                            </DialogStackTitle>
                            <DialogStackDescription>
                                Please review your token details before
                                deploying to the blockchain.
                            </DialogStackDescription>
                        </DialogStackHeader>
                        <div className="py-4">
                            <Card className="border-2">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-6 md:flex-row">
                                        {imageFile && (
                                            <img
                                                src={URL.createObjectURL(imageFile)}
                                                alt={formData.name}
                                                className="h-32 w-32 rounded-lg border-2 object-cover"
                                            />
                                        )}
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="text-2xl font-bold">
                                                    {formData.name}
                                                </h3>
                                                <p className="text-lg text-muted-foreground">
                                                    {formData.symbol}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Total Supply
                                                    </p>
                                                    <p className="font-semibold">
                                                        {formatSupply(
                                                            formData.supply,
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Decimals
                                                    </p>
                                                    <p className="font-semibold">
                                                        {formData.decimal}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="mb-1 text-sm text-muted-foreground">
                                                    Description
                                                </p>
                                                <p className="text-sm">
                                                    {formData.description}
                                                </p>
                                            </div>
                                            {socialIcons.length > 0 && (
                                                <div className="flex gap-2">
                                                    {socialIcons.map(
                                                        (social) => (
                                                            <div
                                                                key={social.key}
                                                                className="rounded-lg bg-muted p-2"
                                                            >
                                                                <social.icon className="h-4 w-4" />
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <DialogStackFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmCreate}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Deploying...'
                                    : 'Confirm & Deploy'}
                            </Button>
                        </DialogStackFooter>
                    </DialogStackContent>
                </DialogStackBody>
            </DialogStack>
        </>
    );
}
