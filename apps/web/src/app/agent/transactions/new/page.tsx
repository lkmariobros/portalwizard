"use client";

import { NewTransactionForm } from "@/features/transactions"; // Assuming barrel export

export default function NewAgentTransactionPage() {
	return (
		<div className="container mx-auto py-10">
			<h1 className="mb-6 font-bold text-3xl">Submit New Transaction</h1>
			<NewTransactionForm />
		</div>
	);
}
