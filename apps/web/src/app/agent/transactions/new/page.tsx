"use client";

import {
	NewTransactionForm,
	TransactionFormProvider,
} from "@/features/transactions";

export default function NewAgentTransactionPage() {
	return (
		<div className="container mx-auto py-10">
			<h1 className="mb-6 font-bold text-3xl">Submit New Transaction</h1>
			<TransactionFormProvider>
				<NewTransactionForm />
			</TransactionFormProvider>
		</div>
	);
}
