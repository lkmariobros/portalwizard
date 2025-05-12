"use client";

import ContactsTable from "@/components/contacts-table";
import { StatsGrid } from "@/components/stats-grid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type * as React from "react";

const queryClient = new QueryClient();

export default function DashboardClientLayout({
	children,
}: { children?: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<>
				<div className="space-y-2">
					<h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back! Here&apos;s an overview of your portal.
					</p>
				</div>

				<StatsGrid />

				<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
					<div className="xl:col-span-3">
						<ContactsTable />
					</div>
					{/* You can add more components here */}
				</div>
				{children}
			</>
		</QueryClientProvider>
	);
}
