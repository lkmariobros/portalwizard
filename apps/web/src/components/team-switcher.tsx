"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
	RiAddLine,
	RiArrowUpDownLine,
	RiSettings3Line,
	RiTeamLine,
} from "@remixicon/react";
import Image from "next/image";
import * as React from "react";

type Team = {
	name: string;
	logo: string;
};

interface TeamSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
	teams: Team[];
}

export function TeamSwitcher({ className, teams }: TeamSwitcherProps) {
	const { state: sidebarState } = useSidebar();
	const isCollapsed = sidebarState === "collapsed";

	const [selectedTeam, setSelectedTeam] = React.useState<Team>(teams[0]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild disabled={isCollapsed}>
				<Button
					variant="ghost"
					className={cn(
						"flex h-auto w-full items-center justify-between gap-3 whitespace-nowrap px-2 py-1.5 text-left font-normal hover:bg-accent/60",
						{
							"!p-1.5 w-full min-w-0 justify-center": isCollapsed,
						},
						className,
					)}
				>
					<div
						className={cn("flex items-center gap-3", { "!gap-0": isCollapsed })}
					>
						<Avatar className="size-7 shrink-0 rounded-sm">
							<Image
								className="rounded-sm"
								src={selectedTeam.logo}
								width={28}
								height={28}
								alt={`${selectedTeam.name} logo`}
							/>
						</Avatar>
						<span
							className={cn("grow font-semibold text-foreground text-sm", {
								hidden: isCollapsed,
							})}
						>
							{selectedTeam.name}
						</span>
					</div>
					<RiArrowUpDownLine
						className={cn("shrink-0 text-muted-foreground/70", {
							hidden: isCollapsed,
						})}
						size={16}
						aria-hidden="true"
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-60" align="start">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-muted-foreground/60">
						Personal Account
					</DropdownMenuLabel>
					{teams.map((team) => (
						<DropdownMenuItem
							key={team.name}
							onClick={() => setSelectedTeam(team)}
						>
							<Avatar className="mr-2 size-5 shrink-0 rounded-sm">
								<Image
									className="rounded-sm"
									src={team.logo}
									width={20}
									height={20}
									alt={`${team.name} logo`}
								/>
							</Avatar>
							{team.name}
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<RiAddLine className="mr-2 size-4" aria-hidden="true" /> Create Team
					</DropdownMenuItem>
					<DropdownMenuItem>
						<RiTeamLine className="mr-2 size-4" aria-hidden="true" /> Manage
						Teams
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<RiSettings3Line className="mr-2 size-4" aria-hidden="true" />
					Settings
					<DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
