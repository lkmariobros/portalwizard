"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentTransactionsTable } from "@/components/dashboard/RecentTransactionsTable";
import { TransactionDetailsModal } from "@/components/dashboard/TransactionDetailsModal";
import { Button } from "@/components/ui/button"; // For Quick Actions
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import type { TransactionDisplayData } from "@/features/transactions/types";
import { trpc } from "@/lib/trpc"; // Import your tRPC client
import React, { useEffect, useState } from "react";
// Placeholder for icons, e.g., from lucide-react
// import { DollarSign, TrendingUp, CalendarClock, Home, BarChartBig } from "lucide-react";

// Helper function to get time-based greeting
function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour >= 5 && hour < 12) return "Good morning";
	if (hour >= 12 && hour < 18) return "Good afternoon";
	if (hour >= 18 && hour < 22) return "Good evening";
	return "Good night"; // Covers 22:00 to 04:59
}

// Helper function to format currency
function formatCurrencyMYR(amount: number): string {
	return new Intl.NumberFormat("en-MY", {
		style: "currency",
		currency: "MYR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount);
}

// Mock data - replace with actual data fetching logic
const agentMockData = {
	fullName: "Jane Doe",
	cumulativeSalesVolume: 2850000,
	totalCommissionEarned: 142500,
	nextMonthPendingPayout: 35000,
	totalUnitsSold: 22,
};

const averageDealSize =
	agentMockData.totalUnitsSold > 0
		? agentMockData.cumulativeSalesVolume / agentMockData.totalUnitsSold
		: 0;

const metricsData = [
	{
		title: "Cumulative Sales Volume",
		value: formatCurrencyMYR(agentMockData.cumulativeSalesVolume),
		description: "All completed sales",
		// icon: <DollarSign className="h-5 w-5" />,
	},
	{
		title: "Total Commission Earned",
		value: formatCurrencyMYR(agentMockData.totalCommissionEarned),
		description: "Sum of all payments received",
		// icon: <TrendingUp className="h-5 w-5" />,
	},
	{
		title: "Next Month's Pending Payout",
		value: formatCurrencyMYR(agentMockData.nextMonthPendingPayout),
		description: "For upcoming payout cycle",
		// icon: <CalendarClock className="h-5 w-5" />,
	},
	{
		title: "Total Units Sold",
		value: `${agentMockData.totalUnitsSold} units`,
		description: "Successfully completed transactions",
		// icon: <Home className="h-5 w-5" />,
	},
	{
		title: "Average Deal Size",
		value: formatCurrencyMYR(averageDealSize),
		description: "Avg. value per unit sold",
		// icon: <BarChartBig className="h-5 w-5" />,
	},
];

// Mock data for recent transactions has been removed, will use tRPC query.

export default function AgentDashboardPage() {
	console.log("[AgentDashboardPage] Component rendering...");
	const [greeting, setGreeting] = useState("INITIAL_GREETING_VISIBLE?");
	const [agentName, setAgentName] = useState("INITIAL_AGENT_NAME_VISIBLE?");

	// State for modal
	const [selectedTransaction, setSelectedTransaction] =
		useState<TransactionDisplayData | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// tRPC query for recent transactions
	const {
		data: recentTransactions,
		isLoading: isLoadingTransactions,
		error: transactionsError,
	} = trpc.transactions.getRecentList.useQuery(undefined, {
		// `undefined` because getRecentList doesn't take input args
		// Add any options like refetchInterval, staleTime if needed
	});

	useEffect(() => {
		console.log("[AgentDashboardPage] useEffect triggered.");
		const newGreeting = getGreeting();
		const newAgentName = agentMockData.fullName;
		console.log(
			"[AgentDashboardPage] useEffect: Setting greeting to:",
			newGreeting,
			"and agent name to:",
			newAgentName,
		);
		setGreeting(newGreeting);
		setAgentName(newAgentName);
		// recentTransactions are now fetched via tRPC's useQuery hook
	}, []);

	const handleViewDetails = (transactionId: string) => {
		const transaction = recentTransactions?.find(
			(t: TransactionDisplayData) => t.id === transactionId,
		);
		if (transaction) {
			setSelectedTransaction(transaction);
			setIsModalOpen(true);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedTransaction(null);
	};

	return (
		<div className="space-y-6 pt-20 md:space-y-8">
			<header className="mb-6 flex items-start justify-between md:mb-8">
				<div>
					{" "}
					{/* Container for greeting and subheading */}
					<h1 className="font-semibold text-2xl text-foreground text-white md:text-3xl">
						{greeting}, {agentName}!
					</h1>
					<p className="text-muted-foreground">
						Here's your performance overview for today.
					</p>
				</div>
				<div className="quick-actions">
					{" "}
					{/* Container for Quick Action Buttons */}
					<Button onClick={() => alert("Navigate to Log Transaction form...")}>
						Log New Transaction
					</Button>
					{/* Add other quick action buttons here if needed */}
				</div>
			</header>

			<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{metricsData.map((metric) => (
					<MetricCard
						key={metric.title}
						title={metric.title}
						value={metric.value}
						description={metric.description}
						// icon={metric.icon}
					/>
				))}
			</section>

			{/* Recent Transactions Section */}
			<section>
				<h2 className="mt-6 mb-4 font-semibold text-foreground text-white text-xl md:text-2xl">
					Recent Transactions
				</h2>
				{isLoadingTransactions && (
					<div className="space-y-2">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				)}
				{transactionsError && (
					<p className="text-red-500">
						Error loading transactions: {transactionsError.message}
					</p>
				)}
				{!isLoadingTransactions && !transactionsError && (
					<RecentTransactionsTable
						transactions={recentTransactions || []}
						onViewDetails={handleViewDetails}
					/>
				)}
			</section>

			{/* Transaction Details Modal (conditionally rendered) */}
			{selectedTransaction && (
				<TransactionDetailsModal
					transaction={selectedTransaction}
					isOpen={isModalOpen}
					onClose={handleCloseModal}
				/>
			)}
		</div>
	);
}
