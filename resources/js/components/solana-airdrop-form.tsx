'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { router, usePage } from '@inertiajs/react';
import { CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FormData {
    wallet: string;
    amount: string;
    network: string;
}

export default function SolanaAirdropForm() {
    const page = usePage();

    const [formData, setFormData] = useState<FormData>({
        wallet: '',
        amount: '1',
        network: 'devnet',
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [dialogData, setDialogData] = useState<any>(null);

    useEffect(() => {
        const props = page.props as any;

        if (isLoading) {
            setIsLoading(false);
        }

        // Handle server-side validation errors
        if (props.errors) {
            const serverErrors: Partial<FormData> = {};
            Object.keys(props.errors).forEach((key) => {
                if (key in formData) {
                    serverErrors[key as keyof FormData] = Array.isArray(
                        props.errors[key],
                    )
                        ? props.errors[key][0]
                        : props.errors[key];
                }
            });
            setErrors(serverErrors);
        }

        if (props.success === true) {
            setDialogData(props);
            setShowSuccessDialog(true);
            setLastRequestTime(Date.now());
            setFormData({
                network: 'devnet',
                wallet: '',
                amount: '1',
            });
            setErrors({});
        } else if (props.success === false && props.message) {
            setDialogData(props);
            setShowErrorDialog(true);
        }
    }, [page.props]);

    useEffect(() => {
        if (!lastRequestTime) return;
        
        const interval = setInterval(() => {
            const elapsed = Date.now() - lastRequestTime;
            const remaining = Math.max(0, 28800000 - elapsed); // 8 hours in ms
            setTimeRemaining(remaining);
            
            if (remaining === 0) {
                clearInterval(interval);
            }
        }, 1000);
        
        return () => clearInterval(interval);
    }, [lastRequestTime]);

    const formatTime = (ms: number) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
    };

    useEffect(() => {
        const w = formData.wallet.trim();
        if (!w) {
            setErrors((prev) => ({ ...prev, wallet: undefined }));
            return;
        }

        const isValid =
            w.length >= 32 &&
            w.length <= 44 &&
            /^[1-9A-HJ-NP-Za-km-z]+$/.test(w);

        setErrors((prev) => ({
            ...prev,
            wallet: !isValid
                ? 'Invalid Solana wallet address (32-44 characters, Base58 format)'
                : undefined,
        }));
    }, [formData.wallet]);



    const handleInputChange = (field: keyof FormData, v: string) => {
        setFormData((prev) => ({ ...prev, [field]: v }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};

        const wallet = formData.wallet.trim();
        if (!wallet) {
            newErrors.wallet = 'Wallet address is required';
        } else if (
            wallet.length < 32 ||
            wallet.length > 44 ||
            !/^[1-9A-HJ-NP-Za-km-z]+$/.test(wallet)
        ) {
            newErrors.wallet = 'Invalid Solana wallet address format';
        }

        if (!formData.amount) {
            newErrors.amount = 'Amount is required';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setDialogData({ message: 'Please fix the errors before submitting' });
            setShowErrorDialog(true);
            return;
        }

        if (isLoading) {
            return; // Prevent double submission
        }

        setIsLoading(true);

        router.post(
            '/tools/solana-air-drop/request',
            {
                wallet: formData.wallet.trim(),
                amount: parseFloat(formData.amount),
                network: formData.network,

            },
            {
                onFinish: () => {
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    return (
        <div className="mx-auto max-w-lg space-y-6 rounded-xl bg-card p-8 shadow-lg">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">
                    Solana Airdrop
                </h1>
                <p className="text-sm text-muted-foreground">
                    Request test SOL on Devnet
                </p>
            </div>

            <Alert className="border-l-4 border-l-primary bg-muted/50">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                    <strong>Devnet Only:</strong> Test tokens have no real value
                    and are used for development purposes only.
                </AlertDescription>
            </Alert>

            <Alert className="border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                    <strong>Rate Limits:</strong> To prevent abuse, each wallet can only request 2 airdrops every 8 hours.
                    {timeRemaining > 0 && (
                        <span className="block mt-1 font-medium text-orange-600 dark:text-orange-400">
                            Next request available in: {formatTime(timeRemaining)}
                        </span>
                    )}
                </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <Input
                        placeholder="Enter Solana wallet address (e.g., 7cYq...3w2x)"
                        value={formData.wallet}
                        onChange={(e) =>
                            handleInputChange('wallet', e.target.value)
                        }
                        disabled={isLoading}
                        className={errors.wallet ? 'border-destructive' : ''}
                    />
                    {errors.wallet && (
                        <div className="flex gap-1 text-xs text-destructive">
                            <XCircle className="h-3 w-3" />
                            {errors.wallet}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                        Amount (SOL)
                    </Label>
                    <RadioGroup
                        value={formData.amount}
                        onValueChange={(v) => handleInputChange('amount', v)}
                        className="grid grid-cols-2 gap-3"
                    >
                        <Label
                            htmlFor="amount-0.1"
                            className={`flex items-center rounded-lg border p-3 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted/50'}`}
                        >
                            <RadioGroupItem value="0.1" id="amount-0.1" disabled={isLoading} />
                            <span className="ml-2 text-sm font-medium">
                                0.1 SOL
                            </span>
                        </Label>
                        <Label
                            htmlFor="amount-0.25"
                            className={`flex items-center rounded-lg border p-3 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted/50'}`}
                        >
                            <RadioGroupItem value="0.25" id="amount-0.25" disabled={isLoading} />
                            <span className="ml-2 text-sm font-medium">
                                0.25 SOL
                            </span>
                        </Label>
                        <Label
                            htmlFor="amount-0.5"
                            className={`flex items-center rounded-lg border p-3 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted/50'}`}
                        >
                            <RadioGroupItem value="0.5" id="amount-0.5" disabled={isLoading} />
                            <span className="ml-2 text-sm font-medium">
                                0.5 SOL
                            </span>
                        </Label>
                        <Label
                            htmlFor="amount-1"
                            className={`flex items-center rounded-lg border p-3 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted/50'}`}
                        >
                            <RadioGroupItem value="1" id="amount-1" disabled={isLoading} />
                            <span className="ml-2 text-sm font-medium">
                                1 SOL
                            </span>
                        </Label>
                    </RadioGroup>
                </div>

                <Button
                    type="submit"
                    className="h-12 w-full bg-gradient-to-r from-orange-500 to-primary text-white hover:opacity-90 disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Airdrop...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Request {formData.amount} SOL Airdrop
                        </>
                    )}
                </Button>
            </form>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="z-[9999]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-5 w-5" />
                            Airdrop Successful!
                        </DialogTitle>
                        <DialogDescription className="space-y-3">
                            {dialogData && dialogData.wallet && (
                                <>
                                    <p>
                                        {dialogData.amount} SOL sent to {dialogData.wallet.substring(0, 8)}...{dialogData.wallet.substring(dialogData.wallet.length - 4)}
                                    </p>
                                    {dialogData.signature && (
                                        <a
                                            href={`https://explorer.solana.com/tx/${dialogData.signature}?cluster=devnet`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block text-sm text-blue-600 hover:underline"
                                        >
                                            View on Solana Explorer →
                                        </a>
                                    )}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                <DialogContent className="z-[9999]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-5 w-5" />
                            Airdrop Failed
                        </DialogTitle>
                        <DialogDescription>
                            {dialogData?.message}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
