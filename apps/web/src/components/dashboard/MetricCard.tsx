import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming CardTitle and CardContent are preferred for Shadcn structure
import type React from "react";

interface MetricCardProps {
	title: string;
	value: string;
	description?: string;
	icon?: React.ReactNode;
}

export function MetricCard({
	title,
	value,
	description,
	icon,
}: MetricCardProps) {
	return (
		<Card className="w-full">
			{" "}
			{/* Removed p-6, will use CardHeader/Content padding */}
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-muted-foreground text-sm">
					{title}
				</CardTitle>
				{icon && <div className="text-muted-foreground">{icon}</div>}
			</CardHeader>
			<CardContent>
				<div className="font-bold text-3xl text-primary">{value}</div>
				{description && (
					<p className="pt-1 text-muted-foreground text-xs">{description}</p>
				)}
			</CardContent>
		</Card>
	);
}
