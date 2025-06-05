import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { TransactionDisplayData } from "@/features/transactions/types";
import { format } from "date-fns"; // For date formatting
import React from "react";

interface RecentTransactionsTableProps {
	transactions: TransactionDisplayData[];
	onViewDetails: (transactionId: string) => void;
}

function formatCurrency(value: number | string | undefined, currency = "MYR") {
	if (value === undefined || value === null) return "-";
	const numValue = typeof value === "string" ? Number.parseFloat(value) : value; // Biome might prefer Number.parseFloat
	if (Number.isNaN(numValue)) return "-";
	return `${currency} ${numValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function RecentTransactionsTable({
	transactions,
	onViewDetails,
}: RecentTransactionsTableProps) {
	if (!transactions || transactions.length === 0) {
		return (
			<p className="text-muted-foreground">No recent transactions found.</p>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Date</TableHead>
					<TableHead>Property Name</TableHead>
					<TableHead>Transaction Value</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{transactions.map((transaction) => (
					<TableRow key={transaction.id}>
						<TableCell>
							{transaction.transactionDate
								? format(new Date(transaction.transactionDate), "MMM dd, yyyy")
								: "-"}
						</TableCell>
						<TableCell>{transaction.propertyName || "-"}</TableCell>
						<TableCell>
							{transaction.transactionType === "lease"
								? `${formatCurrency(transaction.monthlyRent)}/month`
								: formatCurrency(transaction.totalPrice)}
						</TableCell>
						<TableCell>{transaction.status || "-"}</TableCell>
						<TableCell>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onViewDetails(transaction.id)}
							>
								View Details
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
