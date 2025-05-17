import type * as React from "react";

// Define types for navigation items
interface NavItem {
	title: string;
	href: string;
	icon: React.ElementType; // Icons are expected to be React components
	isActive?: boolean;
}

interface NavGroup {
	title: string;
	items: NavItem[];
}

// Props for AppSidebar, including navItems
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	navItems?: NavGroup[]; // Navigation items will be passed as a prop
}

import { SearchForm } from "@/components/search-form";
import { TeamSwitcher } from "@/components/team-switcher";
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
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
	RiBardLine,
	RiCodeSSlashLine,
	RiLayoutLeftLine,
	RiLeafLine,
	RiLoginCircleLine,
	RiLogoutBoxLine,
	RiScanLine,
	RiSettings3Line,
	RiUserFollowLine,
} from "@remixicon/react";

const data = {
	teams: [
		{
			name: "InnovaCraft",
			logo: "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345507/logo-01_kp2j8x.png",
		},
		{
			name: "Acme Corp.",
			logo: "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345507/logo-01_kp2j8x.png",
		},
		{
			name: "Evil Corp.",
			logo: "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345507/logo-01_kp2j8x.png",
		},
	],
	navMain: [
		{
			title: "Sections",
			url: "#",
			items: [
				{
					title: "Dashboard",
					url: "#",
					icon: RiScanLine,
				},
				{
					title: "Insights",
					url: "#",
					icon: RiBardLine,
				},
				{
					title: "Contacts",
					url: "#",
					icon: RiUserFollowLine,
					isActive: true,
				},
				{
					title: "Tools",
					url: "#",
					icon: RiCodeSSlashLine,
				},
				{
					title: "Integration",
					url: "#",
					icon: RiLoginCircleLine,
				},
				{
					title: "Layouts",
					url: "#",
					icon: RiLayoutLeftLine,
				},
				{
					title: "Reports",
					url: "#",
					icon: RiLeafLine,
				},
			],
		},
		{
			title: "Other",
			url: "#",
			items: [
				{
					title: "Settings",
					url: "#",
					icon: RiSettings3Line,
				},
				{
					title: "Help Center",
					url: "#",
					icon: RiLeafLine,
				},
			],
		},
	],
};

export function AppSidebar({ className, navItems, ...props }: AppSidebarProps) {
	// console.log("[AppSidebar] Rendering AppSidebar"); // Removed debug line
	return (
		<Sidebar collapsible="icon" className={className} {...props}>
			<SidebarHeader className="group-data-[state=collapsed]/sidebar-wrapper:!p-0">
				<div // Wrapper for TeamSwitcher
					className={cn(
						"flex items-center px-2 py-1.5", // Default state
						"group-data-[state=collapsed]/sidebar-wrapper:!p-0 group-data-[state=collapsed]/sidebar-wrapper:flex group-data-[state=collapsed]/sidebar-wrapper:h-[52px] group-data-[state=collapsed]/sidebar-wrapper:items-center group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:overflow-hidden", // Collapsed: center, fixed height, no padding for wrapper
					)}
				>
					<TeamSwitcher teams={data.teams} />
				</div>
				<hr className="-mt-px group-data-[state=collapsed]/sidebar-wrapper:!hidden mx-2 border-border border-t group-data-[state=collapsed]/sidebar-wrapper:invisible" />
				<SearchForm className="group-data-[state=collapsed]/sidebar-wrapper:hidden" />
			</SidebarHeader>
			<SidebarContent>
				{(navItems || []).map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarGroupLabel
							className={cn(
								"text-muted-foreground/60 uppercase",
								"group-data-[state=collapsed]/sidebar-wrapper:hidden",
							)}
						>
							{group.title}
						</SidebarGroupLabel>
						<SidebarGroupContent
							className={cn(
								"px-2",
								"group-data-[state=collapsed]/sidebar-wrapper:!px-0",
							)}
						>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											className={cn(
												"group/menu-button h-9 gap-3 rounded-md bg-gradient-to-r font-medium hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto",
												"group-data-[state=collapsed]/sidebar-wrapper:!gap-0 group-data-[state=collapsed]/sidebar-wrapper:!px-0 group-data-[state=collapsed]/sidebar-wrapper:!py-[7px] group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:overflow-hidden",
											)}
											isActive={item.isActive}
										>
											<a href={item.href}>
												{item.icon && (
													<item.icon
														className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
														size={22}
														aria-hidden="true"
													/>
												)}
												<span className="group-data-[state=collapsed]/sidebar-wrapper:hidden">
													{item.title}
												</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<hr className="-mt-px group-data-[state=collapsed]/sidebar-wrapper:!hidden mx-3 border-border border-t group-data-[state=collapsed]/sidebar-wrapper:invisible" />
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className={cn(
								"h-9 gap-3 rounded-md bg-gradient-to-r font-medium hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto",
								"group-data-[state=collapsed]/sidebar-wrapper:!gap-0 group-data-[state=collapsed]/sidebar-wrapper:!px-0 group-data-[state=collapsed]/sidebar-wrapper:!py-[7px] group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:overflow-hidden",
							)}
						>
							<RiLogoutBoxLine
								className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
								size={22}
								aria-hidden="true"
							/>
							<span className="group-data-[state=collapsed]/sidebar-wrapper:hidden">
								Sign Out
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
