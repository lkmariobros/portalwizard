"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";

import {
	RiBriefcaseLine,
	RiHomeLine,
	RiSettingsLine,
	RiTeamLine,
} from "@remixicon/react"; // Example icons

// Navigation items for Agent
const agentNavItems = [
	{
		title: "Agent Portal",
		items: [
			{ title: "Dashboard", href: "/agent", icon: RiHomeLine },
			{
				title: "My Transactions",
				href: "/agent/transactions",
				icon: RiBriefcaseLine,
			},
			{ title: "My Clients", href: "/agent/clients", icon: RiTeamLine },
		],
	},
	{
		title: "Settings",
		items: [{ title: "Profile", href: "/agent/profile", icon: RiSettingsLine }],
	},
];

export default function AgentLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider className="flex h-screen overflow-hidden bg-background">
			<AppSidebar navItems={agentNavItems} className="fixed" />
			<div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden pl-[var(--sidebar-width)] data-[sidebar-collapsed=true]:pl-[var(--sidebar-width-icon)]">
				<Header />
				<main className="flex-1 p-4 pt-[calc(4rem+3.5px+1rem)] sm:p-6 lg:p-8">
					{children}
				</main>
			</div>
		</SidebarProvider>
	);
}
