'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { router } from '@inertiajs/react';
import { Info, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface FormData {
    wallet: string;
    amount: string;
    email: string;
}

export default function SolanaAirdropForm() {
    const [formData, setFormData] = useState<FormData>({
        wallet: '',
        amount: '0.5',
        email: '',
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Real-time wallet validation
    useEffect(() => {
        const wallet = formData.wallet.trim();
        const isValid =
            wallet.length >= 32 &&
            wallet.length <= 44 &&
            /^[1-9A-HJ-NP-Za-km-z]+$/.test(wallet);
        setErrors((prev) => ({
            ...prev,
            wallet:
                wallet && !isValid
                    ? 'Please enter a valid Solana wallet address'
                    : undefined,
        }));
    }, [formData.wallet]);

    // Real-time email validation
    useEffect(() => {
        const email = formData.email.trim();
        const isValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setErrors((prev) => ({
            ...prev,
            email:
                email && !isValid
                    ? 'Please enter a valid email address'
                    : undefined,
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

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Prepare form data for submission
            const submitData = {
                wallet: formData.wallet.trim(),
                amount: parseFloat(formData.amount), // Parse as float for precision
                email: formData.email.trim() || undefined,
            };

            console.log('Requesting airdrop via Laravel backend:', submitData);

            // Use Laravel backend endpoint instead of direct Solana API call
            router.post('/tools/solana-air-drop/request', submitData, {
                onSuccess: (page) => {
                    console.log('onSuccess called with page:', page);
                    const props = page.props as any;
                    console.log('Page props:', props);
                    
                    if (props.success) {
                        const shortWallet = `${formData.wallet.substring(0, 8)}...${formData.wallet.substring(formData.wallet.length - 4)}`;
                        toast.success(
                            `Success! ${formData.amount} SOL sent to ${shortWallet}. ${props.signature ? `Transaction: ${props.signature}` : ''}`,
                        );
                        
                        // Reset form
                        setFormData({ wallet: '', amount: '0.5', email: '' });
                        setErrors({});
                    } else {
                        console.error('Airdrop request failed with message:', props.message);
                        
                        // Provide more specific error messages
                        let errorMessage = props.message || 'Airdrop request failed. Please try again later.';
                        
                        if (errorMessage.includes('faucet may be temporarily unavailable') || 
                            errorMessage.includes('faucet has run dry')) {
                            errorMessage = 'The Solana Devnet faucet is currently unavailable or has reached its rate limit. Please try again later or use an alternative faucet.';
                        }
                        
                        toast.error(errorMessage);
                    }
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    toast.error('Please check the form for errors.');
                },
                onFinish: () => {
                    console.log('onFinish called');
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error('Airdrop error:', error);

            let errorMessage = 'Airdrop request failed. Please try again later.';

            if (error instanceof Error) {
                // Check for specific error patterns
                if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Network error: Unable to connect to server. Please check your internet connection and try again.';
                } else {
                    errorMessage = `Airdrop failed: ${error.message}`;
                }
            }

            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

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
                    This airdrop is for Devnet only Tokens have no real value
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
                    />
                    <div
                        id="wallet-help"
                        className="text-xs text-muted-foreground"
                    >
                        Your devnet wallet address (starts with a base58 string)
                    </div>
                    {errors.wallet && (
                        <div
                            id="wallet-error"
                            className="text-xs text-destructive"
                        >
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
                    >
                        <div className="flex cursor-pointer items-center justify-center rounded-lg border p-3 transition-colors hover:bg-muted">
                            <RadioGroupItem
                                value="0.5"
                                id="amount-0.5"
                                className="mr-2"
                            />
                            <Label
                                htmlFor="amount-0.5"
                                className="cursor-pointer text-sm font-medium"
                            >
                                0.5 SOL
                            </Label>
                        </div>
                        <div className="flex cursor-pointer items-center justify-center rounded-lg border p-3 transition-colors hover:bg-muted">
                            <RadioGroupItem
                                value="1"
                                id="amount-1"
                                className="mr-2"
                            />
                            <Label
                                htmlFor="amount-1"
                                className="cursor-pointer text-sm font-medium"
                            >
                                1 SOL
                            </Label>
                        </div>
                        <div className="flex cursor-pointer items-center justify-center rounded-lg border p-3 transition-colors hover:bg-muted">
                            <RadioGroupItem
                                value="2.5"
                                id="amount-2.5"
                                className="mr-2"
                            />
                            <Label
                                htmlFor="amount-2.5"
                                className="cursor-pointer text-sm font-medium"
                            >
                                2.5 SOL
                            </Label>
                        </div>
                        <div className="flex cursor-pointer items-center justify-center rounded-lg border p-3 transition-colors hover:bg-muted">
                            <RadioGroupItem
                                value="5"
                                id="amount-5"
                                className="mr-2"
                            />
                            <Label
                                htmlFor="amount-5"
                                className="cursor-pointer text-sm font-medium"
                            >
                                5 SOL
                            </Label>
                        </div>
                    </RadioGroup>
                    <div className="text-xs text-muted-foreground">
                        Choose the amount of test SOL to request
                    </div>
                    {errors.amount && (
                        <div className="text-xs text-destructive">
                            {errors.amount}
                        </div>
                    )}
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
                            className="text-xs text-destructive"
                        >
                            {errors.email}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="h-12 w-full bg-gradient-to-r from-orange-500 to-primary text-white hover:opacity-90"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Request Airdrop'
                    )}
                </Button>
            </form>
        </div>
    );
}
