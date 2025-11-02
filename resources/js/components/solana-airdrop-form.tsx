'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { router, usePage } from '@inertiajs/react';
import { CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface FormData {
    wallet: string;
    amount: string;
    email: string;
}

export default function SolanaAirdropForm() {
    const page = usePage();

    const [formData, setFormData] = useState<FormData>({
        wallet: '',
        amount: '1',
        email: '',
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Handle flash messages from backend
    useEffect(() => {
        const props = page.props as any;

        console.log('=== PAGE PROPS UPDATED ===');
        console.log('All props:', JSON.stringify(props, null, 2));
        console.log('Success:', props.success);
        console.log('Message:', props.message);
        console.log('Signature:', props.signature);
        console.log('Wallet:', props.wallet);
        console.log('Amount:', props.amount);
        console.log('========================');

        // Always reset loading state when props change
        if (isLoading) {
            console.log('Resetting loading state');
            setIsLoading(false);
        }

        // Check for success/error flash messages
        if (props.success === true) {
            console.log('SUCCESS DETECTED - Showing success toast');
            const shortWallet = props.wallet
                ? `${props.wallet.substring(0, 8)}...${props.wallet.substring(props.wallet.length - 4)}`
                : 'wallet';

            toast.success(
                `✅ Airdrop Successful! ${props.amount} SOL sent to ${shortWallet}`,
                {
                    description: props.signature ? (
                        <a
                            href={`https://explorer.solana.com/tx/${props.signature}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 block text-sm hover:underline"
                        >
                            View on Solana Explorer →
                        </a>
                    ) : undefined,
                    duration: 6000,
                    dismissible: true,
                    position: 'top-right',
                },
            );

            // Reset form on success
            setFormData({ wallet: '', amount: '1', email: '' });
            setErrors({});
        } else if (props.success === false && props.message) {
            toast.error('❌ Airdrop Failed', {
                description: props.message,
                duration: 8000,
            });
        }
    }, [isLoading, page.props]);

    // Real-time wallet validation
    useEffect(() => {
        const wallet = formData.wallet.trim();
        if (!wallet) {
            setErrors((prev) => ({ ...prev, wallet: undefined }));
            return;
        }

        const isValid =
            wallet.length >= 32 &&
            wallet.length <= 44 &&
            /^[1-9A-HJ-NP-Za-km-z]+$/.test(wallet);

        setErrors((prev) => ({
            ...prev,
            wallet: !isValid
                ? 'Please enter a valid Solana wallet address (32-44 characters, base58 encoded)'
                : undefined,
        }));
    }, [formData.wallet]);

    // Real-time email validation
    useEffect(() => {
        const email = formData.email.trim();
        if (!email) {
            setErrors((prev) => ({ ...prev, email: undefined }));
            return;
        }

        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setErrors((prev) => ({
            ...prev,
            email: !isValid ? 'Please enter a valid email address' : undefined,
        }));
    }, [formData.email]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.wallet.trim()) {
            newErrors.wallet = 'Wallet address is required';
        } else if (
            formData.wallet.length < 32 ||
            formData.wallet.length > 44 ||
            !/^[1-9A-HJ-NP-Za-km-z]+$/.test(formData.wallet)
        ) {
            newErrors.wallet = 'Please enter a valid Solana wallet address';
        }

        if (!formData.amount) {
            newErrors.amount = 'Please select an amount';
        }

        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        setIsLoading(true);

        const submitData = {
            wallet: formData.wallet.trim(),
            amount: parseFloat(formData.amount),
            email: formData.email.trim() || undefined,
        };

        console.log('Submitting airdrop request:', submitData);

        router.post('/tools/solana-air-drop/request', submitData, {
            preserveScroll: true,
            onError: (errors) => {
                console.error('Validation errors:', errors);
                setIsLoading(false);
                toast.error('Please check the form for errors');
            },
            onFinish: () => {
                console.log('Request finished');
                // Make sure loading is reset even if useEffect doesn't fire
                setTimeout(() => {
                    if (isLoading) {
                        setIsLoading(false);
                    }
                }, 500);
            },
        });
    };

    const hasErrors = Object.values(errors).some(
        (error) => error !== undefined,
    );

    return (
        <div className="mx-auto max-w-lg space-y-6 rounded-xl bg-card p-8 shadow-lg">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-primary">
                    <span className="text-2xl">◎</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                    Solana Devnet Airdrop
                </h1>
                <p className="text-sm text-muted-foreground">
                    Request test SOL for development
                </p>
            </div>

            {/* Info Box */}
            <Alert className="border-l-4 border-l-primary bg-muted/50">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                    This airdrop is for Devnet only. Tokens have no real value
                    and are only for testing purposes.{' '}
                    <a
                        href="https://docs.solana.com/clusters/devnet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        Learn more
                    </a>
                </AlertDescription>
            </Alert>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Wallet Address */}
                <div className="space-y-2">
                    <Label htmlFor="wallet" className="text-sm font-semibold">
                        Wallet Address{' '}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="wallet"
                        type="text"
                        placeholder="Enter your Solana wallet address"
                        value={formData.wallet}
                        onChange={(e) =>
                            handleInputChange('wallet', e.target.value)
                        }
                        className={errors.wallet ? 'border-destructive' : ''}
                        aria-describedby="wallet-help wallet-error"
                        disabled={isLoading}
                    />
                    <div
                        id="wallet-help"
                        className="text-xs text-muted-foreground"
                    >
                        Your devnet wallet address (32-44 character base58
                        string)
                    </div>
                    {errors.wallet && (
                        <div
                            id="wallet-error"
                            className="flex items-center gap-1 text-xs text-destructive"
                        >
                            <XCircle className="h-3 w-3" />
                            {errors.wallet}
                        </div>
                    )}
                </div>

                {/* Amount */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                        Amount (SOL) <span className="text-destructive">*</span>
                    </Label>
                    <RadioGroup
                        value={formData.amount}
                        onValueChange={(value) =>
                            handleInputChange('amount', value)
                        }
                        className="grid grid-cols-4 gap-3"
                        disabled={isLoading}
                    >
                        {['0.5', '1', '2', '5'].map((value) => (
                            <div
                                key={value}
                                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 transition-colors ${
                                    formData.amount === value
                                        ? 'border-primary bg-primary/10'
                                        : 'hover:bg-muted'
                                } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                <RadioGroupItem
                                    value={value}
                                    id={`amount-${value}`}
                                    className="mr-2"
                                    disabled={isLoading}
                                />
                                <Label
                                    htmlFor={`amount-${value}`}
                                    className={`cursor-pointer text-sm font-medium ${
                                        isLoading ? 'cursor-not-allowed' : ''
                                    }`}
                                >
                                    {value} SOL
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                    <div className="text-xs text-muted-foreground">
                        Choose the amount of test SOL to request
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">
                        Email{' '}
                        <span className="text-muted-foreground">
                            (Optional)
                        </span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                            handleInputChange('email', e.target.value)
                        }
                        className={errors.email ? 'border-destructive' : ''}
                        aria-describedby="email-help email-error"
                        disabled={isLoading}
                    />
                    <div
                        id="email-help"
                        className="text-xs text-muted-foreground"
                    >
                        Receive notification when airdrop is complete
                    </div>
                    {errors.email && (
                        <div
                            id="email-error"
                            className="flex items-center gap-1 text-xs text-destructive"
                        >
                            <XCircle className="h-3 w-3" />
                            {errors.email}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="h-12 w-full bg-gradient-to-r from-orange-500 to-primary text-white hover:opacity-90"
                    disabled={isLoading || hasErrors}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Airdrop...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Request Airdrop
                        </>
                    )}
                </Button>
            </form>

            {/* Alternative Methods */}
            <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-xs text-muted-foreground">
                    Having trouble? Try the{' '}
                    <a
                        href="https://faucet.solana.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        official Solana faucet
                    </a>{' '}
                    or use the Solana CLI
                </p>
            </div>
        </div>
    );
}
