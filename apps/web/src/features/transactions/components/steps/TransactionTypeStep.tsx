"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type * as React from "react"; // Changed React import style

import type { StepProps } from "../../types";
import { useTransactionFormContext } from "../TransactionFormProvider";

/**
 * TransactionTypeStep handles the first step of the transaction form
 * where users select market type, transaction type, and date
 */
export function TransactionTypeStep({ form, onNext }: StepProps) {
	const { form: contextForm } = useTransactionFormContext();
	// const [localMarketType, setLocalMarketType] = useState<string>(form.state.values.marketType || ''); // localMarketType seems unused, consider removing if not needed elsewhere
	const [isStep0Valid, setIsStep0Valid] = useState(false);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	useEffect(() => {
		const { marketType, transactionType, transactionDate } = form.state.values;
		let isValid = false;
		if (marketType && transactionDate) {
			if (marketType === "primary") {
				if (transactionType === "sale") {
					isValid = true;
				}
			} else if (marketType === "secondary") {
				if (transactionType === "sale" || transactionType === "lease") {
					isValid = true;
				}
			}
		}
		setIsStep0Valid(isValid);
	}, [form.state.values]);

	// Handle market type change
	const handleMarketTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		console.log("Market type changing to:", value);

		// Update form state for marketType
		form.setFieldValue("marketType", value as "primary" | "secondary");

		// For primary market, transaction type is always 'sale'
		// For secondary market, clear transaction type to force user selection
		if (value === "primary") {
			form.setFieldValue("transactionType", "sale");
		} else {
			// When switching to secondary, or from one secondary type to another (if applicable later),
			// or if the initial value is secondary, ensure transactionType is reset or handled appropriately.
			// For now, simply clearing it forces a selection if not primary.
			form.setFieldValue("transactionType", "");
		}
	};

	// Handle transaction type change
	const handleTransactionTypeChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const value = e.target.value;
		console.log("Transaction type changing to:", value);
		form.setFieldValue("transactionType", value);
	};

	// Handle date selection from Calendar
	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (selectedDate) {
			// Format to YYYY-MM-DD for storing in form state
			const year = selectedDate.getFullYear();
			// Months are 0-indexed, add 1 and pad with '0' if needed
			const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
			const day = selectedDate.getDate().toString().padStart(2, "0");
			const formattedDateForState = `${year}-${month}-${day}`;

			console.log(
				"[TransactionTypeStep] Date selected:",
				formattedDateForState,
			);
			form.setFieldValue("transactionDate", formattedDateForState);
			form.validateField("transactionDate");
		} else {
			// Handle deselection: clear the field
			form.setFieldValue("transactionDate", "");
			form.validateField("transactionDate");
		}
		setIsCalendarOpen(false); // Close the popover
	};

	return (
		<div>
			<h3 className="mb-4 font-semibold text-lg">Transaction Type & Date</h3>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{/* Market Type Selection */}
				<div className="space-y-2">
					<Label htmlFor="marketType" className="font-medium text-sm">
						Market Type <span className="text-red-500">*</span>
					</Label>
					<select
						id="marketType"
						className="h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={form.state.values.marketType || ""}
						onChange={handleMarketTypeChange}
					>
						<option value="" disabled>
							Select market type
						</option>
						<option value="primary">Primary Market</option>
						<option value="secondary">Secondary Market</option>
					</select>
				</div>

				{/* Transaction Type Selection */}
				<div className="space-y-2">
					<Label htmlFor="transactionType" className="font-medium text-sm">
						Transaction Type <span className="text-red-500">*</span>
					</Label>

					{form.state.values.marketType === "primary" ? (
						// For primary market, show a disabled field with the fixed 'sale' value
						<div className="flex h-10 w-full items-center rounded-md border bg-gray-100 px-3 py-2 text-sm">
							Sale (Auto-selected for Primary Market)
						</div>
					) : (
						// For secondary market, use a native HTML select for better reliability
						<select
							id="transactionType"
							className="h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={form.state.values.transactionType || ""}
							onChange={handleTransactionTypeChange}
						>
							<option value="" disabled>
								Select transaction type
							</option>
							<option value="sale">Sale</option>
							<option value="lease">Lease</option>
						</select>
					)}
				</div>

				{/* Transaction Date Selection */}
				<div className="space-y-2">
					<Label htmlFor="transactionDate" className="font-medium text-sm">
						Transaction Date <span className="text-red-500">*</span>
					</Label>
					<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
						<PopoverTrigger asChild>
							<Button
								variant={"outline"}
								className={cn(
									"h-10 w-full justify-start text-left font-normal",
									!form.state.values.transactionDate && "text-muted-foreground",
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{form.state.values.transactionDate ? (
									new Date(`${form.state.values.transactionDate}T00:00:00`) // Add time to ensure correct local date parsing
										.toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})
								) : (
									<span>Pick a date</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={
									form.state.values.transactionDate
										? new Date(`${form.state.values.transactionDate}T00:00:00`) // Add time for correct local date parsing
										: undefined
								}
								onSelect={handleDateSelect}
								initialFocus
								// Optional: Disable future dates or dates outside a reasonable range
								// disabled={(date) =>
								//   date > new Date() || date < new Date("1900-01-01")
								// }
							/>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			{/* Navigation buttons */}
			<div className="mt-6 flex justify-end">
				<button
					type="button"
					className={`rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isStep0Valid ? "bg-blue-500 hover:bg-blue-600" : "cursor-not-allowed bg-gray-400"}`}
					onClick={onNext}
					disabled={!isStep0Valid}
				>
					Next
				</button>
			</div>
		</div>
	);
}
