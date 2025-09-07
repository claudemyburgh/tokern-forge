import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Zap } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
    { href: '#create-token', label: 'Create Token' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#about', label: 'About' },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <a href="/" className="mr-6 flex items-center space-x-2">
                        <Zap className={`size-9 bg-white text-primary fill-primary rounded-sm p-1.5 -rotate-2`} />
                        <span className="hidden font-bold sm:inline-block">Token Forge</span>
                    </a>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* You can add a search bar here if needed */}
                    </div>
                    <nav className="hidden md:flex items-center gap-2">
                        <AppearanceToggleDropdown />
                        <Button>Get Started</Button>
                    </nav>
                </div>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className={`p-6`}>
                        <div className="mb-6 flex items-center justify-between">
                            <a href="/" className="flex items-center space-x-2">
                                <Zap
                                    className={`size-9 bg-white text-primary fill-primary rounded-sm p-1.5 -rotate-2`}
                                />
                                <span className="font-bold">Token Forge</span>
                            </a>
                            <AppearanceToggleDropdown />
                        </div>
                        <div className="divide-y divide-border">
                            <nav className="grid gap-2 py-6">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                            <div className="pt-6">
                                <Button className="w-full">Get Started</Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
