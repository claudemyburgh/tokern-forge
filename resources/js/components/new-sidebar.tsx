import * as React from 'react';

// import { SearchForm } from "@/components/search-form";
// import { TeamSwitcher } from "@/components/team-switcher";
import TokenCreateController from '@/actions/App/Http/Controllers/Token/TokenCreateController';
import TokenIndexController from '@/actions/App/Http/Controllers/Token/TokenIndexController';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import {
    RiArrowRightSLine,
    RiCodeSSlashLine,
    RiCoinLine,
    RiLeafLine,
    RiLoginCircleLine,
    RiScanLine,
    RiSettings3Line,
    RiShieldUserLine,
    RiUserSettingsLine,
    RiKeyLine,
} from '@remixicon/react';
import { SharedData } from '@/types';

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
                    url: TokenIndexController().url,
                    icon: RiCoinLine,
                    children: [
                        {
                            title: 'List Tokens',
                            url: TokenIndexController().url,
                            icon: RiCoinLine,
                        },
                        {
                            title: 'Create Tokens',
                            url: TokenCreateController().url,
                            icon: RiCoinLine,
                        },
                    ],
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

// Admin section - only visible to users with appropriate permissions
const adminNav = {
    title: 'Administration',
    url: '#',
    items: [
        {
            title: 'User Management',
            url: '/admin/users',
            icon: RiShieldUserLine,
            children: [
                {
                    title: 'Manage Users',
                    url: '/admin/users',
                    icon: RiUserSettingsLine,
                },
                {
                    title: 'Manage Roles',
                    url: '/admin/roles',
                    icon: RiShieldUserLine,
                },
                {
                    title: 'Manage Permissions',
                    url: '/admin/permissions',
                    icon: RiKeyLine,
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const page = usePage<SharedData>();
    const user = page.props.auth.user;
    
    // Check if user has permissions to view admin section
    const canViewAdminSection = user && 
        (user.permissions.includes('manage users') || 
         user.permissions.includes('manage roles') || 
         user.permissions.includes('manage permissions'));

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
                                {item.items.map((item) => {
                                    const hasChildren =
                                        item.children &&
                                        item.children.length > 0;
                                    const isActive = page.url.startsWith(
                                        typeof item.url === 'string'
                                            ? item.url
                                            : item.url,
                                    );

                                    // If item has children, render as collapsible
                                    if (hasChildren) {
                                        return (
                                            <Collapsible
                                                key={item.title}
                                                asChild
                                                defaultOpen={isActive}
                                                className="group/collapsible"
                                            >
                                                <SidebarMenuItem>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuButton
                                                            className="group/menu-button h-9 gap-3 rounded-md bg-gradient-to-r font-medium hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                                                            isActive={isActive}
                                                        >
                                                            {item.icon && (
                                                                <item.icon
                                                                    className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                                                                    size={22}
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                            <RiArrowRightSLine
                                                                className="ml-auto text-muted-foreground/60 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                                                size={18}
                                                            />
                                                        </SidebarMenuButton>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {item.children?.map(
                                                                (subItem) => {
                                                                    const isSubItemActive =
                                                                        page.url.startsWith(
                                                                            typeof subItem.url ===
                                                                                'string'
                                                                                ? subItem.url
                                                                                : subItem.url,
                                                                        );
                                                                    return (
                                                                        <SidebarMenuSubItem
                                                                            key={
                                                                                subItem.title
                                                                            }
                                                                        >
                                                                            <SidebarMenuSubButton
                                                                                asChild
                                                                                className={`opacity-50 hover:bg-transparent hover:opacity-100`}
                                                                            >
                                                                                <Link
                                                                                    href={
                                                                                        subItem.url
                                                                                    }
                                                                                    className={
                                                                                        isSubItemActive
                                                                                            ? 'text-primary'
                                                                                            : ''
                                                                                    }
                                                                                >
                                                                                    <span>
                                                                                        {
                                                                                            subItem.title
                                                                                        }
                                                                                    </span>
                                                                                </Link>
                                                                            </SidebarMenuSubButton>
                                                                        </SidebarMenuSubItem>
                                                                    );
                                                                },
                                                            )}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </SidebarMenuItem>
                                            </Collapsible>
                                        );
                                    }

                                    // If no children, render as regular menu item
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                className="group/menu-button h-9 gap-3 rounded-md bg-gradient-to-r font-medium hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                                                isActive={isActive}
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
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
                
                {/* Admin section - only visible to users with appropriate permissions */}
                {canViewAdminSection && (
                    <SidebarGroup key={adminNav.title}>
                        <SidebarGroupLabel className="text-muted-foreground/60 uppercase">
                            {adminNav.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="px-2">
                            <SidebarMenu>
                                {adminNav.items.map((item) => {
                                    const hasChildren =
                                        item.children &&
                                        item.children.length > 0;
                                    const isActive = page.url.startsWith(
                                        typeof item.url === 'string'
                                            ? item.url
                                            : item.url,
                                    );

                                    // If item has children, render as collapsible
                                    if (hasChildren) {
                                        return (
                                            <Collapsible
                                                key={item.title}
                                                asChild
                                                defaultOpen={isActive}
                                                className="group/collapsible"
                                            >
                                                <SidebarMenuItem>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuButton
                                                            className="group/menu-button h-9 gap-3 rounded-md bg-gradient-to-r font-medium hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                                                            isActive={isActive}
                                                        >
                                                            {item.icon && (
                                                                <item.icon
                                                                    className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                                                                    size={22}
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                            <RiArrowRightSLine
                                                                className="ml-auto text-muted-foreground/60 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                                                size={18}
                                                            />
                                                        </SidebarMenuButton>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {item.children?.map(
                                                                (subItem) => {
                                                                    const isSubItemActive =
                                                                        page.url.startsWith(
                                                                            typeof subItem.url ===
                                                                                'string'
                                                                                ? subItem.url
                                                                                : subItem.url,
                                                                        );
                                                                    return (
                                                                        <SidebarMenuSubItem
                                                                            key={
                                                                                subItem.title
                                                                            }
                                                                        >
                                                                            <SidebarMenuSubButton
                                                                                asChild
                                                                                className={`opacity-50 hover:bg-transparent hover:opacity-100`}
                                                                            >
                                                                                <Link
                                                                                    href={
                                                                                        subItem.url
                                                                                    }
                                                                                    className={
                                                                                        isSubItemActive
                                                                                            ? 'text-primary'
                                                                                            : ''
                                                                                    }
                                                                                >
                                                                                    <span>
                                                                                        {
                                                                                            subItem.title
                                                                                        }
                                                                                    </span>
                                                                                </Link>
                                                                            </SidebarMenuSubButton>
                                                                        </SidebarMenuSubItem>
                                                                    );
                                                                },
                                                            )}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </SidebarMenuItem>
                                            </Collapsible>
                                        );
                                    }

                                    // If no children, render as regular menu item
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                className="group/menu-button h-9 gap-3 rounded-md bg-gradient-to-r font-medium hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                                                isActive={isActive}
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
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
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