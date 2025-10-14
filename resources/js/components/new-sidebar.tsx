import * as React from 'react';

// import { SearchForm } from "@/components/search-form";
// import { TeamSwitcher } from "@/components/team-switcher";
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import {
    RiCodeSSlashLine,
    RiCoinLine,
    RiLeafLine,
    RiLoginCircleLine,
    RiScanLine,
    RiSettings3Line,
} from '@remixicon/react';

// This is sample data.
const data = {
    navMain: [
        {
            title: 'Sections',
            url: dashboard().url,
            items: [
                {
                    title: 'Dashboard',
                    url: dashboard().url,
                    icon: RiScanLine,
                },
                {
                    title: 'Tokens',
                    url: '#',
                    icon: RiCoinLine,
                },
                {
                    title: 'Tools',
                    url: '#',
                    icon: RiCodeSSlashLine,
                },
                {
                    title: 'Integration',
                    url: '#',
                    icon: RiLoginCircleLine,
                },
                {
                    title: 'Reports',
                    url: '#',
                    icon: RiLeafLine,
                },
            ],
        },
        {
            title: 'Other',
            url: '#',
            items: [
                {
                    title: 'Settings',
                    url: '#',
                    icon: RiSettings3Line,
                },
                {
                    title: 'Help Center',
                    url: '#',
                    icon: RiLeafLine,
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const page = usePage();

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <hr className="mx-2 -mt-px border-t border-border" />
                    {/*<SearchForm className="mt-3" />*/}
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* We create a SidebarGroup for each parent. */}
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel className="text-muted-foreground/60 uppercase">
                            {item.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="px-2">
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className="group/menu-button h-9 gap-3 rounded-md bg-gradient-to-r font-medium hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                                            isActive={page.url.startsWith(
                                                typeof item.url === 'string'
                                                    ? item.url
                                                    : item.url,
                                            )}
                                        >
                                            <Link href={item.url}>
                                                {item.icon && (
                                                    <item.icon
                                                        className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                                                        size={22}
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <hr className="mx-2 -mt-px border-t border-border" />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <NavUser />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
