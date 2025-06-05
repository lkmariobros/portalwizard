/**
 * CommissionCalculationStep Component
 *
 * Handles the commission calculation step of the transaction form.
 * This step allows users to set commission type (percentage or fixed amount)
 * and calculates the commission based on the property price.
 */

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type React from "react";
import { useLayoutEffect, useMemo } from "react";
import type { StepProps } from "../../types";
import { formatCurrency } from "../../utils/formatters";
import { useTransactionFormContext } from "../TransactionFormProvider";

export function CommissionCalculationStep({
	form,
	onNext,
	onPrevious,
}: StepProps) {
	const { marketType } = useTransactionFormContext();

	// Get form values
	const formValues = form.state.values;
	const commissionType = formValues.commissionType || "";
	const commissionPercentage = Number.parseFloat(
		formValues.commissionPercentage || "0",
	);
	const totalPrice = Number.parseFloat(
		String(formValues.totalPrice || "0").replace(/[^0-9.]/g, ""),
	);
	const coBrokingEnabled = formValues.coBrokingEnabled;

	// Calculate commission amount based on percentage
	const calculatedCommission = useMemo(() => {
		if (
			commissionType === "percentage" &&
			commissionPercentage > 0 &&
			totalPrice > 0
		) {
			return totalPrice * (commissionPercentage / 100);
		}
		return 0;
	}, [commissionType, commissionPercentage, totalPrice]);

	// Format calculated commission for display
	const formattedCalculatedCommission = useMemo(() => {
		return formatCurrency(calculatedCommission);
	}, [calculatedCommission]);

	// Set default commission type and percentage on component mount
	useLayoutEffect(() => {
		// Set default commission type to percentage if not already set
		if (!formValues.commissionType) {
			form.setFieldValue("commissionType", "percentage");
		}

		// Set default commission percentage to 2% if not already set
		if (!formValues.commissionPercentage) {
			form.setFieldValue("commissionPercentage", "2");
		}
	}, [form, formValues.commissionType, formValues.commissionPercentage]);

	// Effect to automatically update the commission value field when using percentage
	useLayoutEffect(() => {
		if (commissionType === "percentage" && totalPrice > 0) {
			// Use default 2% if no percentage is set
			const percentageToUse =
				commissionPercentage > 0 ? commissionPercentage : 2;
			const calculatedValue = formatCurrency(
				totalPrice * (percentageToUse / 100),
			);
			// Synchronous update before browser paint
			form.setFieldValue("commissionValue", calculatedValue);
		}
	}, [totalPrice, commissionPercentage, commissionType, form]);

	// Handle commission type change
	const handleCommissionTypeChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const value = e.target.value;
		form.setFieldValue("commissionType", value);

		// Reset commission value when switching types
		if (value === "percentage") {
			const percentage = commissionPercentage > 0 ? commissionPercentage : 2;
			const calculatedValue = formatCurrency(totalPrice * (percentage / 100));
			form.setFieldValue("commissionValue", calculatedValue);
		} else if (value === "fixed_amount") {
			// When switching to fixed amount, clear the value to prompt user entry
			form.setFieldValue("commissionValue", "");
		}
	};

	// Handle commission percentage change
	const handleCommissionPercentageChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const value = e.target.value;
		form.setFieldValue("commissionPercentage", value);

		// Update commission value based on new percentage
		if (commissionType === "percentage" && totalPrice > 0) {
			const percentage = Number.parseFloat(value) || 0;
			const calculatedValue = formatCurrency(totalPrice * (percentage / 100));
			form.setFieldValue("commissionValue", calculatedValue);
		}
	};

	// Handle commission value change with currency formatting
	const handleCommissionValueChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const rawValue = e.target.value.replace(/[^0-9.]/g, "");
		const formattedValue = formatCurrency(Number.parseFloat(rawValue) || 0);
		form.setFieldValue("commissionValue", formattedValue);
	};

	return (
		<div className="border border-red-500 p-4">
			<h3 className="mb-4 font-semibold text-lg">
				Commission Calculation - DEBUG MODE
			</h3>
			<div className="mb-4 rounded border border-yellow-500 bg-yellow-100 p-4">
				<h4 className="font-bold">DEBUG INFO:</h4>
				<pre className="mt-2 max-h-40 overflow-auto rounded bg-gray-800 p-2 text-white text-xs">
					{JSON.stringify(
						{
							totalPrice,
							commissionType,
							commissionPercentage,
							commissionValue: formValues.commissionValue,
							values: form.state.values,
							errors: form.state.errors,
						},
						null,
						2,
					)}
				</pre>
			</div>

			{/* Co-broke Status Indicator */}
			<div
				className={`flex h-12 items-center gap-2 rounded-md border-2 px-4 ${coBrokingEnabled ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"}`}
			>
				<div
					className={`h-3 w-3 rounded-full ${coBrokingEnabled ? "bg-amber-500" : "bg-green-500"}`}
				/>
				<span
					className={`font-medium ${coBrokingEnabled ? "text-amber-800" : "text-green-800"}`}
				>
					{coBrokingEnabled
						? "Co-broke Enabled"
						: "Standard Commission (2% Default)"}
				</span>
			</div>

			{/* Commission Summary Card */}
			<div className="rounded-md border bg-gray-50 p-4">
				<div className="mb-2 flex items-center justify-between">
					<span className="font-medium text-sm">Property Price:</span>
					<span className="font-semibold">
						{formValues.totalPrice || "AED 0.00"}
					</span>
				</div>

				{commissionType === "percentage" && (
					<div className="mb-2 flex items-center justify-between">
						<span className="font-medium text-sm">Commission Rate:</span>
						<span className="font-semibold">{commissionPercentage || 2}%</span>
					</div>
				)}

				<div className="flex items-center justify-between border-t pt-2">
					<span className="font-medium text-sm">Total Commission:</span>
					<span className="font-semibold text-blue-600">
						{commissionType === "percentage"
							? formattedCalculatedCommission
							: formValues.commissionValue || "AED 0.00"}
					</span>
				</div>
			</div>

			{/* Commission Type Selection */}
			<div className="space-y-2">
				<Label htmlFor="commissionType" className="font-medium text-sm">
					Commission Type <span className="text-red-500">*</span>
				</Label>
				<select
					id="commissionType"
					className="h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					value={commissionType}
					onChange={handleCommissionTypeChange}
				>
					<option value="" disabled>
						Select commission type
					</option>
					<option value="percentage">Percentage</option>
					<option value="fixed_amount">Fixed Amount</option>
				</select>
			</div>

			{/* Commission Percentage (only shown when type is percentage) */}
			{commissionType === "percentage" && (
				<div className="space-y-2">
					<Label htmlFor="commissionPercentage" className="font-medium text-sm">
						Commission Percentage <span className="text-red-500">*</span>
					</Label>
					<div className="relative">
						<Input
							id="commissionPercentage"
							type="number"
							min="0"
							step="0.1"
							value={formValues.commissionPercentage || ""}
							onChange={handleCommissionPercentageChange}
							className="w-full pr-8"
							placeholder="Enter percentage (e.g., 2)"
						/>
						<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
							<span className="text-gray-500">%</span>
						</div>
					</div>
				</div>
			)}

			{/* Commission Value */}
			<div className="space-y-2">
				<Label htmlFor="commissionValue" className="font-medium text-sm">
					Commission Value <span className="text-red-500">*</span>
				</Label>
				<Input
					id="commissionValue"
					value={formValues.commissionValue || ""}
					onChange={handleCommissionValueChange}
					className="w-full"
					placeholder="AED 0.00"
					readOnly={commissionType === "percentage"}
				/>
				{commissionType === "percentage" && (
					<p className="mt-1 text-gray-500 text-xs">
						This value is automatically calculated based on the percentage.
					</p>
				)}
			</div>

			{/* Agent Earnings Section (for co-broking) */}
			{coBrokingEnabled && (
				<div className="space-y-3 rounded-md border bg-blue-50 p-4">
					<h4 className="font-medium text-blue-800">
						Agent Earnings (Co-broke Split)
					</h4>

					<div className="flex items-center justify-between">
						<span className="text-sm">Your Share:</span>
						<span className="font-semibold">
							{formatCurrency(
								(typeof calculatedCommission === "number" &&
								!Number.isNaN(calculatedCommission)
									? calculatedCommission
									: 0) / 2,
							)}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-sm">Co-broke Agent Share:</span>
						<span className="font-semibold">
							{formatCurrency(
								(typeof calculatedCommission === "number" &&
								!Number.isNaN(calculatedCommission)
									? calculatedCommission
									: 0) / 2,
							)}
						</span>
					</div>

					<p className="mt-1 text-blue-600 text-xs">
						Note: Co-broke commission is split 50/50 by default.
					</p>
				</div>
			)}

			{/* Navigation buttons */}
			<div className="mt-6 flex justify-between">
				<button
					type="button"
					className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
					onClick={onPrevious}
				>
					Previous
				</button>
				<button
					type="button"
					className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					onClick={onNext}
				>
					Next
				</button>
			</div>
		</div>
	);
}
