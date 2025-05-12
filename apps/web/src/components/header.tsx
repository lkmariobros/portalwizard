"use client";
// import Link from "next/link"; // No longer used directly
import { PanelLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "./breadcrumbs";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

interface HeaderProps {
	// Prop kept for potential explicit override, though context is primary
	onToggleSidebar?: () => void;
}

export default function Header({
	onToggleSidebar: onToggleSidebarProp,
}: HeaderProps) {
	const { state, isMobile, toggleSidebar } = useSidebar();

	// Prioritize prop if provided, otherwise use context's toggleSidebar for the button click
	const handleToggleClick = onToggleSidebarProp || toggleSidebar;

	return (
		<>
			{/* Main Header Bar: fixed, starts to the right of the sidebar */}
			<div
				className={cn(
					"fixed top-0 right-0 z-50 h-[calc(4rem+3.5px)] border-border border-b bg-card p-4 text-card-foreground",
					{
						// Explicit Tailwind classes for left offset
						"left-[var(--sidebar-width-icon)]":
							!isMobile && state === "collapsed",
						"left-[var(--sidebar-width)]": !isMobile && state === "expanded",
						"left-0": isMobile, // Full width on mobile as sidebar is an overlay sheet
					},
				)}
			>
				<div className="flex flex-row items-center justify-between">
					{/* Left side: Inline Toggle Button (non-mobile) + Breadcrumbs */}
					<div className="flex items-center gap-3">
						{!isMobile && (
							<Button
								variant="outline"
								size="icon"
								onClick={handleToggleClick}
								className="rounded-md" // Standard styling, no fixed positioning
							>
								<PanelLeftIcon className="h-5 w-5" />
								<span className="sr-only">Toggle Sidebar</span>
							</Button>
						)}
						<Breadcrumbs />
					</div>

					<div className="flex items-center gap-3">
						<ModeToggle />
						<UserMenu />
					</div>
				</div>
			</div>
		</>
	);
}
