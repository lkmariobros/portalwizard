"use client";

import { FeedbackDialog } from "@/components/feedback-dialog"; // Import FeedbackDialog
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
import {
	RiLogoutCircleRLine,
	RiMessage2Line, // Assuming FeedbackDialog might be triggered from here
	RiQuestionLine,
	RiSettings3Line,
	RiUserLine,
} from "@remixicon/react";
import Image from "next/image";
import * as React from "react";

// Sample user data - replace with actual data fetching or context
const userData = {
	name: "Erika Mustermann",
	email: "erika.mustermann@example.com",
	avatarUrl:
		"https://res.cloudinary.com/dlzlfasou/image/upload/v1741345637/avatar-01_b5z5zu.jpg",
};

interface UserDropdownProps {
	align?: "start" | "center" | "end";
}

export function UserDropdown({ align = "end" }: UserDropdownProps) {
	const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = React.useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="relative h-9 w-9 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
					>
						<Avatar className="h-9 w-9">
							<Image
								src={userData.avatarUrl}
								alt={`${userData.name}'s avatar`}
								width={36}
								height={36}
								className="rounded-full"
							/>
							{/* You can add a fallback here if needed */}
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align={align}>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="font-medium text-sm leading-none">
								{userData.name}
							</p>
							<p className="text-muted-foreground text-xs leading-none">
								{userData.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<RiUserLine className="mr-2 size-4" aria-hidden="true" />
							Profile
							<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<RiSettings3Line className="mr-2 size-4" aria-hidden="true" />
							Settings
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => setIsFeedbackDialogOpen(true)}>
						<RiMessage2Line className="mr-2 size-4" aria-hidden="true" />
						Feedback
					</DropdownMenuItem>
					<DropdownMenuItem>
						<RiQuestionLine className="mr-2 size-4" aria-hidden="true" />
						Support
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<RiLogoutCircleRLine className="mr-2 size-4" aria-hidden="true" />
						Log out
						<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<FeedbackDialog
				open={isFeedbackDialogOpen}
				onOpenChange={setIsFeedbackDialogOpen}
			/>
		</>
	);
}
