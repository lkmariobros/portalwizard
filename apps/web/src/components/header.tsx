"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useSidebarLayout } from "@/hooks/use-sidebar-layout";
import { cn } from "@/lib/utils";
import { Menu, PanelLeftIcon } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

interface HeaderProps {
	onToggleSidebar?: () => void;
}

export default function Header({
	onToggleSidebar: onToggleSidebarProp,
}: HeaderProps) {
	const { state, isMobile, toggleSidebar } = useSidebar();
	useSidebarLayout(); // Initialize sidebar layout hook
	const handleToggleClick = onToggleSidebarProp || toggleSidebar;

	return (
		<header
			className={cn(
				"fixed top-0 z-40 h-[calc(4rem+4.3px)] bg-card/95 text-card-foreground backdrop-blur-sm",
				"border-border border-b transition-[left] duration-200 ease-in-out",
				"flex items-center",
				{
					// Desktop - Collapsed
					"right-0 left-[var(--sidebar-width-icon)]":
						!isMobile && state === "collapsed",
					// Desktop - Expanded
					"right-0 left-[var(--sidebar-width)]":
						!isMobile && state === "expanded",
					// Mobile
					"right-0 left-0 w-full border-border border-l": isMobile,
				},
				isMobile ? "px-4" : "px-6",
			)}
			style={
				{
					"--sidebar-width": "16rem",
					"--sidebar-width-icon": "4.5rem",
				} as React.CSSProperties
			}
		>
			<div className="flex h-full w-full items-center justify-between">
				{/* Left side: Toggle button and breadcrumbs */}
				<div className="flex items-center space-x-2 sm:space-x-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={handleToggleClick}
						className="h-9 w-9 rounded-md md:h-10 md:w-10"
						aria-label="Toggle sidebar"
					>
						{isMobile ? (
							<Menu className="h-5 w-5" />
						) : (
							<PanelLeftIcon className="h-5 w-5" />
						)}
					</Button>
					<div className="hidden sm:block">
						<Breadcrumbs />
					</div>
				</div>

				{/* Right side: Actions */}
				<div className="flex items-center space-x-2">
					<ModeToggle />
					<UserMenu />
				</div>
			</div>
		</header>
	);
}
