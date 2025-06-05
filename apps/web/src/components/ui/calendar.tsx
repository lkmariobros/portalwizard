"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type * as React from "react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define the props for our custom chevron component
interface CustomChevronProps extends React.SVGProps<SVGSVGElement> {
	className?: string;
	disabled?: boolean;
	orientation?: "up" | "down" | "left" | "right";
	size?: number;
	// Add any other props passed by react-day-picker's Chevron slot if necessary
	// React.SVGProps<SVGSVGElement> should cover most valid SVG attributes.
	// If truly arbitrary string-keyed props are needed beyond standard SVG attributes,
	// consider Record<string, unknown> but that's less type-safe.
	[key: string]: unknown;
}

// Define the CustomChevron component
function CustomChevron({
	orientation,
	className,
	...props
}: CustomChevronProps) {
	const effectiveClassName = cn("size-4", className); // Keep existing shadcn styling
	if (orientation === "left") {
		return <ChevronLeft className={effectiveClassName} {...props} />;
	}
	if (orientation === "right") {
		return <ChevronRight className={effectiveClassName} {...props} />;
	}
	// Return an empty fragment instead of null to satisfy ReactElement type
	return <></>;
}

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: React.ComponentProps<typeof DayPicker>) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				months: "flex flex-col sm:flex-row gap-2",
				month: "flex flex-col gap-4",
				caption: "flex justify-center pt-1 pb-2 relative items-center",
				caption_label: "text-sm font-medium",
				nav: "flex items-center",
				nav_button: cn(
					buttonVariants({ variant: "outline" }),
					"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 focus-visible:ring-transparent",
				),
				nav_button_previous: "absolute left-1 top-1/2 -translate-y-1/2",
				nav_button_next: "absolute right-1 top-1/2 -translate-y-1/2",
				table: "w-full border-collapse",
				head_row: "flex w-full mt-2",
				head_cell:
					"flex-1 text-muted-foreground rounded-md font-normal text-[0.8rem] text-center min-w-0",
				row: "flex w-full mt-2",
				cell: cn(
					"relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
					props.mode === "range"
						? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
						: "[&:has([aria-selected])]:rounded-md",
				),
				day: cn(
					buttonVariants({ variant: "ghost" }),
					"size-8 p-0 font-normal aria-selected:opacity-100",
				),
				day_range_start:
					"day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
				day_range_end:
					"day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
				day_selected:
					"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
				day_today: "bg-accent text-accent-foreground",
				day_outside:
					"day-outside text-muted-foreground aria-selected:text-muted-foreground",
				day_disabled: "text-muted-foreground opacity-50",
				day_range_middle:
					"aria-selected:bg-accent aria-selected:text-accent-foreground",
				day_hidden: "invisible",
				...classNames,
			}}
			components={{
				Chevron: CustomChevron,
			}}
			{...props}
		/>
	);
}

export { Calendar };
