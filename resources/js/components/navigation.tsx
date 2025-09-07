import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import * as React from 'react';

import UserNav from '@/components/user-nav';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Zap } from 'lucide-react';
import { useState } from 'react';

const tokens: { title: string; href: string; description: string }[] = [
    {
        title: 'Create Token',
        href: '#',
        description: 'Create a new token with your own custom parameters.',
    },
    {
        title: 'Swap Tokens',
        href: '#',
        description: 'Swap your tokens with other tokens on the platform.',
    },
    {
        title: 'View Tokens',
        href: '#',
        description: 'View all the tokens available on the platform.',
    },
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
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="#" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Tokens</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                        {tokens.map((token) => (
                                            <ListItem key={token.title} href={token.href} title={token.title}>
                                                {token.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="#" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        About Us
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="#" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Blog</NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* You can add a search bar here if needed */}
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <AppearanceToggleDropdown />
                        <UserNav />
                    </div>
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
                        </div>
                        <div className="divide-y divide-border">
                            <nav className="grid gap-2 py-6">
                                <a
                                    href="#"
                                    className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Home
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent"
                                    onClick={() => setIsOpen(false)}
                                >
                                    About Us
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Blog
                                </a>
                            </nav>
                            <div className="pt-6">
                                <UserNav />
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <Separator className="my-4" />
                            <AppearanceToggleDropdown />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            className,
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    },
);
ListItem.displayName = 'ListItem';
