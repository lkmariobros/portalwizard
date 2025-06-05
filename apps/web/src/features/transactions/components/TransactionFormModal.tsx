"use client";

import { X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "../../../components/ui/dialog";
import { NewTransactionForm } from "./NewTransactionForm";
import "./transaction-form.css";

interface TransactionFormModalProps {
	triggerButtonText?: string;
	className?: string;
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function TransactionFormModal({
	triggerButtonText = "New Transaction",
	className = "",
	isOpen: controlledIsOpen,
	onOpenChange: controlledOnOpenChange,
}: TransactionFormModalProps): React.ReactElement {
	const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);

	const isOpen =
		controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;
	const setIsOpen = (open: boolean) => {
		setUncontrolledIsOpen(open);
		controlledOnOpenChange?.(open);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="default"
					className={`bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90 ${className}`}
				>
					{triggerButtonText}
				</Button>
			</DialogTrigger>
			<DialogContent
				className="flex h-[85vh] max-h-[750px] w-full max-w-4xl flex-col overflow-hidden p-0 sm:rounded-lg"
				onInteractOutside={(e) => {
					const target = e.target as HTMLElement;
					if (target.closest(".dialog-content")) {
						e.preventDefault();
					}
				}}
			>
				<div className="dialog-content flex h-full w-full flex-col overflow-hidden rounded-lg border border-border/50 bg-background shadow-xl">
					{/* Header */}
					<div className="w-full border-border/30 border-b bg-card/50">
						<div className="mx-auto w-full max-w-3xl px-4 py-3">
							<div className="flex items-center justify-between">
								<h2 className="font-semibold text-base text-foreground">
									Submit New Transaction
								</h2>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setIsOpen(false)}
									className="h-7 w-7 rounded-full p-0"
								>
									<X className="h-3.5 w-3.5" />
									<span className="sr-only">Close</span>
								</Button>
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className="flex h-full w-full flex-1 flex-col overflow-hidden">
						<NewTransactionForm />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
