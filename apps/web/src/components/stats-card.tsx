import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type * as React from "react";

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	value: string;
	icon?: React.ElementType;
	description?: string;
	footer?: React.ReactNode;
	variant?: "default" | "primary" | "success" | "warning" | "danger";
}

export function StatsCard({
	className,
	title,
	value,
	icon: Icon,
	description,
	footer,
	variant = "default",
	...props
}: StatsCardProps) {
	const variantClasses = {
		default: "border-border bg-card text-card-foreground",
		primary: "border-primary/20 bg-primary/5 text-primary",
		success: "border-green-500/20 bg-green-500/5 text-green-600",
		warning: "border-yellow-500/20 bg-yellow-500/5 text-yellow-600",
		danger: "border-red-500/20 bg-red-500/5 text-red-600",
	};

	return (
		<Card
			className={cn(
				"overflow-hidden rounded-xl border",
				variantClasses[variant],
				className,
			)}
			{...props}
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-sm">{title}</CardTitle>
				{Icon && (
					<Icon
						className={cn(
							"size-5",
							variant === "default"
								? "text-muted-foreground"
								: "text-current opacity-70",
						)}
						aria-hidden="true"
					/>
				)}
			</CardHeader>
			<CardContent>
				<div className="font-bold text-2xl">{value}</div>
				{description && (
					<p
						className={cn(
							"text-xs",
							variant === "default"
								? "text-muted-foreground"
								: "text-current opacity-80",
						)}
					>
						{description}
					</p>
				)}
				{footer && (
					<div
						className={cn(
							"mt-2 pt-2 text-xs",
							variant === "default"
								? "border-border/50 border-t text-muted-foreground"
								: "border-current/20 border-t text-current opacity-80",
						)}
					>
						{footer}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
