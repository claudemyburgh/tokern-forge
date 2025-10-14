'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Coins,
    ExternalLink,
    Globe,
    Hash,
    MessageCircle,
    Send,
    Settings,
    Share2,
} from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface Token {
    id: number;
    name: string;
    symbol: string;
    decimal: number;
    supply: number;
    description: string;
    website?: string | null;
    twitter_url?: string | null;
    telegram_url?: string | null;
    discord_url?: string | null;
    reddit_url?: string | null;
    wallet_address?: string;
    is_frozen: boolean;
    is_mint_revoked: boolean;
    status: string;
    network: string;
    created_at: string;
    media?: Array<{
        id: number;
        name: string;
        file_name: string;
        mime_type: string;
        path: string;
        disk: string;
        file_hash: string;
        collection: string;
        size: number;
        conversions: Record<string, string>;
    }>;
}

interface PageProps {
    token: Token;
    [key: string]: any;
}

export default function TokenShow() {
    const { token } = usePage().props as PageProps;

    const formatSupply = (value: number) => {
        return new Intl.NumberFormat('en-US').format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-blue-100 text-blue-800';
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTokenImage = (conversion?: string) => {
        if (!token.media?.[0]) return null;

        const media = token.media[0];
        if (conversion && media.conversions[conversion]) {
            return `/storage/${media.id}/conversions/${media.file_name.replace(/\.[^/.]+$/, '')}-${conversion}.jpg`;
        }

        return `/storage/${media.id}/${media.file_name}`;
    };

    const socialLinks = [
        {
            key: 'website',
            label: 'Website',
            url: token.website,
            icon: Globe,
        },
        {
            key: 'twitter_url',
            label: 'Twitter/X',
            url: token.twitter_url,
            icon: MessageCircle,
        },
        {
            key: 'telegram_url',
            label: 'Telegram',
            url: token.telegram_url,
            icon: Send,
        },
        {
            key: 'discord_url',
            label: 'Discord',
            url: token.discord_url,
            icon: MessageCircle,
        },
    ].filter((link) => link.url);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        {/* Token Image and Basic Info */}
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            {getTokenImage('preview') && (
                                <div className="relative">
                                    <img
                                        src={getTokenImage('preview')}
                                        alt={token.name}
                                        className="w-32 h-32 rounded-xl border-2 border-border object-cover shadow-lg"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                                        {token.name}
                                    </h1>
                                    <Badge className={getStatusColor(token.status)}>
                                        {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Hash className="h-4 w-4" />
                                        <span className="font-mono">{token.symbol}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Coins className="h-4 w-4" />
                                        <span>{token.decimal} decimals</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(token.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                            <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            {token.status === 'draft' && (
                                <Button size="sm">
                                    Deploy to Blockchain
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Token Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Token Details</CardTitle>
                                <CardDescription>
                                    Complete information about your token
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Total Supply
                                            </label>
                                            <p className="text-2xl font-bold">
                                                {formatSupply(token.supply)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Network
                                            </label>
                                            <p className="text-lg font-semibold capitalize">
                                                {token.network}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Mint Authority
                                            </label>
                                            <p className={`text-lg font-semibold ${token.is_mint_revoked ? 'text-red-600' : 'text-green-600'}`}>
                                                {token.is_mint_revoked ? 'Revoked' : 'Active'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Freeze Authority
                                            </label>
                                            <p className={`text-lg font-semibold ${token.is_frozen ? 'text-red-600' : 'text-green-600'}`}>
                                                {token.is_frozen ? 'Active' : 'Revoked'}
                                            </p>
                                        </div>

                                        {token.wallet_address && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Creator Wallet
                                                </label>
                                                <p className="text-sm font-mono break-all">
                                                    {token.wallet_address}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                        Description
                                    </label>
                                    <p className="text-sm leading-relaxed">
                                        {token.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        {socialLinks.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Social Links</CardTitle>
                                    <CardDescription>
                                        Connect with your community
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {socialLinks.map((link) => (
                                            <a
                                                key={link.key}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                            >
                                                <link.icon className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">{link.label}</p>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {link.url}
                                                    </p>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                                            </a>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <Badge className={getStatusColor(token.status)}>
                                        {token.status}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Created</span>
                                    <span className="text-sm font-medium">
                                        {formatDate(token.created_at)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Network</span>
                                    <span className="text-sm font-medium capitalize">
                                        {token.network}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Token Images */}
                        {token.media?.[0] && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Token Images</CardTitle>
                                    <CardDescription>
                                        Different sizes for various uses
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { name: 'Blockchain (64x64)', conversion: 'blockchain' },
                                            { name: 'Icon (160x160)', conversion: 'icon-160' },
                                            { name: 'Preview (512x512)', conversion: 'preview' },
                                        ].map(({ name, conversion }) => (
                                            <div key={conversion} className="space-y-2">
                                                <p className="text-xs text-muted-foreground">{name}</p>
                                                <img
                                                    src={getTokenImage(conversion)}
                                                    alt={`${token.name} ${name}`}
                                                    className="w-full aspect-square rounded border border-border object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
