"use client";

import { X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { NewTransactionForm } from "./NewTransactionForm";
import "./transaction-form.css";

interface TransactionFormCardProps {
	onClose?: () => void;
	className?: string;
}

export function TransactionFormCard({
	onClose,
	className = "",
}: TransactionFormCardProps) {
	return (
		<div
			className={`relative h-full w-full overflow-hidden rounded-xl border-[1px] border-[oklch(0.92_0.004_286.32)] bg-[oklch(0.967_0.001_286.375)] p-6 text-[oklch(0.141_0.005_285.823)] shadow-lg dark:border-[oklch(1_0_0_/_10%)] dark:bg-[oklch(0.21_0.006_285.885)] dark:text-[oklch(0.985_0_0)] ${className}`}
		>
			{onClose && (
				<div className="absolute top-4 right-4 z-10">
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="form-close-button h-8 w-8 rounded-full"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			)}

			<div className="h-full overflow-y-auto pr-2">
				<h2 className="mb-6 font-semibold text-2xl">New Transaction</h2>
				<NewTransactionForm />
			</div>
		</div>
	);
}
