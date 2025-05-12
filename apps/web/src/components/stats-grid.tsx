import { StatsCard } from "@/components/stats-card"; // Adjusted path if you move StatsCard
import { cn } from "@/lib/utils";
import {
	RiArchiveStackLine,
	RiBarChartGroupedLine,
	RiCalendarCheckLine,
	RiTeamLine,
} from "@remixicon/react";
import type * as React from "react";

// Define the variant type, mirroring StatsCardProps
export type StatCardVariant =
	| "default"
	| "primary"
	| "success"
	| "warning"
	| "danger";

// Define the type for individual stat objects
interface StatDefinition {
	title: string;
	value: string;
	icon: React.ElementType;
	description: string;
	variant: StatCardVariant;
}

// Sample data for the stats grid
const statsData: StatDefinition[] = [
	{
		title: "Total Projects",
		value: "1,234",
		icon: RiArchiveStackLine,
		description: "+20.1% from last month",
		variant: "default",
	},
	{
		title: "Active Users",
		value: "5,678",
		icon: RiTeamLine,
		description: "+180 since last week",
		variant: "default",
	},
	{
		title: "Tasks Completed",
		value: "890",
		icon: RiCalendarCheckLine,
		description: "32 ongoing",
		variant: "default",
	},
	{
		title: "Overall Progress",
		value: "75%",
		icon: RiBarChartGroupedLine,
		description: "Target: 80%",
		variant: "default",
	},
];

interface StatsGridProps extends React.HTMLAttributes<HTMLDivElement> {
	// You can add any specific props for StatsGrid here if needed
}

export function StatsGrid({ className, ...props }: StatsGridProps) {
	return (
		<div
			className={cn(
				"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				className,
			)}
			{...props}
		>
			{statsData.map((stat) => (
				<StatsCard
					key={stat.title}
					title={stat.title}
					value={stat.value}
					icon={stat.icon}
					description={stat.description}
					variant={stat.variant}
				/>
			))}
		</div>
	);
}
