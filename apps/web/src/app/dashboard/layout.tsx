"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import {
	SidebarInset,
	SidebarProvider,
	useSidebar,
} from "@/components/ui/sidebar";
import { useSidebarLayout } from "@/hooks/use-sidebar-layout";
import { cn } from "@/lib/utils";
import {
	RiCodeSSlashLine,
	RiLayoutLeftLine,
	RiSettings3Line,
} from "@remixicon/react";
import type { ReactNode } from "react";
import DashboardClientLayout from "./dashboard-client-layout";

export default function DashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<SidebarProvider>
			<DashboardContent>{children}</DashboardContent>
		</SidebarProvider>
	);
}

// Navigation items for the sidebar
const navItems = [
	{
		title: "Sections",
		items: [
			{
				title: "Dashboard",
				href: "/dashboard",
				icon: RiLayoutLeftLine,
				isActive: true,
			},
			{
				title: "Transactions",
				href: "/transactions",
				icon: RiCodeSSlashLine,
			},
			// Add more navigation items as needed
		],
	},
	{
		title: "Other",
		items: [
			{
				title: "Settings",
				href: "/settings",
				icon: RiSettings3Line,
			},
			// Add more navigation items as needed
		],
	},
];

function DashboardContent({ children }: { children: ReactNode }) {
	const { state } = useSidebarLayout();

	return (
		<div className="relative flex min-h-screen">
			<AppSidebar navItems={navItems} />
			<div className="flex min-h-screen flex-1 flex-col bg-background">
				<HeaderWithSidebarToggle />
				<main
					className={cn(
						"flex-1 overflow-auto pt-16 transition-[margin-left] duration-200 ease-in-out",
						"min-h-[calc(100vh-4rem)]",
					)}
					style={
						{
							marginLeft: "var(--sidebar-width)",
							width: "calc(100% - var(--sidebar-width))",
							"--sidebar-width": "16rem",
							"--sidebar-width-icon": "4.5rem",
						} as React.CSSProperties
					}
				>
					<div className="h-full p-4 sm:p-6">
						<div className="mx-auto h-full w-full max-w-7xl">{children}</div>
					</div>
				</main>
			</div>
		</div>
	);
}

function HeaderWithSidebarToggle() {
	const { toggleSidebar } = useSidebar();
	return <Header onToggleSidebar={toggleSidebar} />;
}
