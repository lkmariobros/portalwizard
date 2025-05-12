"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import {
	SidebarInset,
	SidebarProvider,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import DashboardClientLayout from "./dashboard-client-layout";

export default function DashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<div
				className={cn(
					"flex min-h-0 flex-1 flex-col transition-[margin-left] duration-300 ease-in-out",
					"ml-0", // Default for mobile (no margin as sidebar is likely off-canvas)
					"pt-[calc(4rem+3.5px)]", // Adjusted padding-top to account for new header height
					"md:data-[state=expanded]/sidebar-wrapper:ml-[var(--sidebar-width)]",
					"md:data-[state=collapsed]/sidebar-wrapper:ml-[var(--sidebar-width-icon)]",
				)}
			>
				<HeaderWithSidebarToggle />
				<SidebarInset className="flex flex-1 flex-col">
					<div className="flex-1 space-y-6 p-4 sm:p-6">
						<DashboardClientLayout>{children}</DashboardClientLayout>
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}

function HeaderWithSidebarToggle() {
	const { toggleSidebar } = useSidebar();
	return <Header onToggleSidebar={toggleSidebar} />;
}
