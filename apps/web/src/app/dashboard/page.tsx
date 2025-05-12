// import DashboardClientLayout from "./dashboard-client-layout"; // No longer directly rendered here
import React from "react";

export default function DashboardPage() {
	// The actual content (StatsGrid, ContactsTable) is already rendered by
	// dashboard-client-layout.tsx, which is applied via layout.tsx.
	// This page component would be for content specifically unique to the /dashboard path,
	// if any, beyond what dashboard-client-layout provides.
	// For now, let's return a minimal fragment or a placeholder if needed.
	return (
		<>
			{/* If there's specific content for ONLY the /dashboard root path, add it here. */}
			{/* For example: <h2 className="text-xl font-semibold">Dashboard Overview</h2> */}
			{/* If dashboard-client-layout handles all content, this can be minimal or empty. */}
		</>
	);
}
