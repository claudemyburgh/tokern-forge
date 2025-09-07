import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ChevronDown, Folder, LayoutGrid, Menu, Search } from 'lucide-react';
import * as React from 'react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import route from 'ziggy-js';
import AppearanceToggleTab from './appearance-tabs';

const navLinks = [
    {
        label: 'Home',
        href: route('home'),
    },
    {
        label: 'Tokens',
        sub: [
            {
                label: 'Create Token',
                href: '#',
            },
            {
                label: 'View Tokens',
                href: '#',
            },
            {
                label: 'Swap Tokens',
                href: '#',
            },
            {
                label: 'New Tokens',
                href: '#',
            },
        ],
    },
    {
        label: 'About Us',
        href: '#',
    },
];

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

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col justify-between space-y-4 p-4">
                                    <div className="flex flex-col space-y-2 text-sm">
                                        {navLinks.map((link) =>
                                            link.sub ? (
                                                <Collapsible key={link.label}>
                                                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 font-medium">
                                                        {link.label}
                                                        <ChevronDown className="h-4 w-4" />
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="flex flex-col space-y-1 py-1 pl-4">
                                                        {link.sub.map((subLink) => (
                                                            <Link
                                                                key={subLink.label}
                                                                href={subLink.href}
                                                                className="rounded-md px-2 py-1.5"
                                                            >
                                                                {subLink.label}
                                                            </Link>
                                                        ))}
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            ) : (
                                                <Link
                                                    key={link.label}
                                                    href={link.href!}
                                                    className="rounded-md px-2 py-1.5 font-medium"
                                                >
                                                    {link.label}
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        {!auth.user && (
                                            <>
                                                <Link href={route('login')} className="rounded-md px-2 py-1.5 font-medium">
                                                    Login
                                                </Link>
                                                <Link
                                                    href={route('register')}
                                                    className="rounded-md px-2 py-1.5 font-medium"
                                                >
                                                    Register
                                                </Link>
                                            </>
                                        )}
                                        <AppearanceToggleTab />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href={dashboard()} prefetch className="flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navLinks.map((link) =>
                                    link.sub ? (
                                        <NavigationMenuItem key={link.label}>
                                            <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                                            <NavigationMenuContent>
                                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                                    {link.sub.map((subLink) => (
                                                        <ListItem key={subLink.label} href={subLink.href} title={subLink.label}>
                                                            {/* TODO: Add description for sub links */}
                                                        </ListItem>
                                                    ))}
                                                </ul>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    ) : (
                                        <NavigationMenuItem key={link.label}>
                                            <Link href={link.href!} legacyBehavior passHref>
                                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                    {link.label}
                                                </NavigationMenuLink>
                                            </Link>
                                        </NavigationMenuItem>
                                    ),
                                )}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
                                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                            </Button>
                        </div>
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link href={route('login')} className={cn(navigationMenuTriggerStyle())}>
                                    Login
                                </Link>
                                <Link href={route('register')} className={cn(navigationMenuTriggerStyle())}>
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
