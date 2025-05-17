"use client"

import { NewTransactionForm } from '@/features/transactions'; // Assuming barrel export

export default function NewAgentTransactionPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Submit New Transaction</h1>
      <NewTransactionForm />
    </div>
  );
}
