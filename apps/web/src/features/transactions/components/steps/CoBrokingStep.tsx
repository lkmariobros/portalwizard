/**
 * CoBrokingStep Component
 *
 * Handles the co-broking setup step of the transaction form.
 * This step allows users to configure co-broking details and specify
 * whether the broker represents the buyer or seller.
 */

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type React from "react";
import type { StepProps, TransactionFormValues } from "../../types";
import { useTransactionFormContext } from "../TransactionFormProvider";

export function CoBrokingStep({ form, onNext, onPrevious }: StepProps) {
	const { marketType } = useTransactionFormContext();

	// Get form values
	const { coBrokingEnabled, coBrokingDirection, isAgencyListing } =
		form.state.values;

	// Handle input changes
	const handleInputChange =
		(field: keyof TransactionFormValues) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			form.setFieldValue(field, e.target.value);
		};

	// Handle co-broking toggle
	const handleCoBrokingToggle = (checked: boolean) => {
		form.setFieldValue("coBrokingEnabled", checked);

		// Reset co-broking fields when disabled
		if (!checked) {
			form.setFieldValue("coBrokingAgentName", "");
			form.setFieldValue("coBrokingAgentRen", "");
			form.setFieldValue("coBrokingAgencyName", "");
			form.setFieldValue("coBrokingAgentContact", "");
			form.setFieldValue("coBrokingDirection", ""); // Reset direction when co-broking is disabled
		}
	};

	// Handle co-broking direction change
	const handleDirectionChange = (direction: "buyer" | "seller") => {
		form.setFieldValue("coBrokingDirection", direction);
	};

	// Handle agency listing toggle (secondary market only)
	const handleAgencyListingToggle = (checked: boolean) => {
		form.setFieldValue("isAgencyListing", checked);
	};

	// Validate required co-broking fields
	const validateCoBrokingFields = () => {
		// Only validate if co-broking is enabled
		if (!coBrokingEnabled) return true;

		// Check required fields
		const isAgentNameFilled = !!form.state.values.coBrokingAgentName;
		const isAgencyNameFilled = !!form.state.values.coBrokingAgencyName;

		return isAgentNameFilled && isAgencyNameFilled;
	};

	// Handle next button click with validation
	const handleNext = () => {
		// If co-broking is enabled, validate required fields
		if (validateCoBrokingFields()) {
			onNext?.();
		} else {
			// Set field errors to trigger validation styling
			if (!form.state.values.coBrokingAgentName) {
				form.setFieldError("coBrokingAgentName", "Agent name is required");
			}
			if (!form.state.values.coBrokingAgencyName) {
				form.setFieldError("coBrokingAgencyName", "Agency name is required");
			}
		}
	};

	return (
		<div>
			<h3 className="mb-4 font-semibold text-lg">Co-Broking Setup</h3>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{/* Co-Broking Toggle */}
				<div className="flex items-center justify-between rounded-md border p-3">
					<div>
						<Label htmlFor="coBrokingEnabled" className="font-medium text-sm">
							Enable Co-Broking
						</Label>
						<p className="text-gray-500 text-sm">
							Turn on if another agent is involved in this transaction
						</p>
					</div>
					<Switch
						id="coBrokingEnabled"
						checked={coBrokingEnabled}
						onCheckedChange={handleCoBrokingToggle}
					/>
				</div>

				{/* Agency Listing Toggle (Secondary Market Only) */}
				{marketType === "secondary" && (
					<div className="flex items-center justify-between rounded-md border p-3">
						<div>
							<Label htmlFor="isAgencyListing" className="font-medium text-sm">
								Company Listing
							</Label>
							<p className="text-gray-500 text-sm">
								Turn on if this is a company listing
							</p>
						</div>
						<Switch
							id="isAgencyListing"
							checked={isAgencyListing}
							onCheckedChange={handleAgencyListingToggle}
						/>
					</div>
				)}
			</div>

			{/* Co-Broking Direction (Buyer/Seller representation) */}
			{coBrokingEnabled && (
				<div className="mt-4 rounded-md border bg-gray-50 p-4">
					<fieldset>
						<legend className="mb-2 block font-medium text-sm">
							Who do you represent?
						</legend>
						<div
							className="flex space-x-4"
							role="radiogroup"
							aria-labelledby="co-broking-direction-label"
						>
							<label
								className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-center ${
									coBrokingDirection === "buyer"
										? "border-2 border-blue-500 bg-blue-100"
										: "border border-gray-300 bg-white"
								}`}
							>
								<input
									type="radio"
									name="coBrokingDirection"
									value="buyer"
									checked={coBrokingDirection === "buyer"}
									onChange={() => handleDirectionChange("buyer")}
									className="sr-only" /* Visually hidden but accessible */
									aria-label="Represent buyer"
								/>
								<span>Buyer</span>
							</label>
							<label
								className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-center ${
									coBrokingDirection === "seller"
										? "border-2 border-blue-500 bg-blue-100"
										: "border border-gray-300 bg-white"
								}`}
							>
								<input
									type="radio"
									name="coBrokingDirection"
									value="seller"
									checked={coBrokingDirection === "seller"}
									onChange={() => handleDirectionChange("seller")}
									className="sr-only" /* Visually hidden but accessible */
									aria-label="Represent seller"
								/>
								<span>Seller</span>
							</label>
						</div>
					</fieldset>
				</div>
			)}

			{/* Co-Broking Agent Details */}
			{coBrokingEnabled && (
				<div className="mt-4 rounded-md border p-4">
					<h4 className="mb-3 font-medium">Co-Broking Agent Details</h4>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{/* Co-Broking Agent Name */}
						<div className="space-y-2">
							<Label
								htmlFor="coBrokingAgentName"
								className="font-medium text-sm"
							>
								Agent Name <span className="text-red-500">*</span>
							</Label>
							<Input
								id="coBrokingAgentName"
								value={form.state.values.coBrokingAgentName || ""}
								onChange={handleInputChange("coBrokingAgentName")}
								className="w-full"
								placeholder="Enter co-broking agent's name"
							/>
						</div>

						{/* Co-Broking Agent REN */}
						<div className="space-y-2">
							<Label
								htmlFor="coBrokingAgentRen"
								className="font-medium text-sm"
							>
								Agent REN
							</Label>
							<Input
								id="coBrokingAgentRen"
								value={form.state.values.coBrokingAgentRen || ""}
								onChange={handleInputChange("coBrokingAgentRen")}
								className="w-full"
								placeholder="Enter co-broking agent's REN"
							/>
						</div>
					</div>

					<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
						{/* Co-Broking Agency Name */}
						<div className="space-y-2">
							<Label
								htmlFor="coBrokingAgencyName"
								className="font-medium text-sm"
							>
								Agency Name <span className="text-red-500">*</span>
							</Label>
							<Input
								id="coBrokingAgencyName"
								value={form.state.values.coBrokingAgencyName || ""}
								onChange={handleInputChange("coBrokingAgencyName")}
								className="w-full"
								placeholder="Enter co-broking agency name"
							/>
						</div>

						{/* Co-Broking Agent Contact */}
						<div className="space-y-2">
							<Label
								htmlFor="coBrokingAgentContact"
								className="font-medium text-sm"
							>
								Agent Contact
							</Label>
							<Input
								id="coBrokingAgentContact"
								value={form.state.values.coBrokingAgentContact || ""}
								onChange={handleInputChange("coBrokingAgentContact")}
								className="w-full"
								placeholder="Enter co-broking agent's contact"
							/>
						</div>
					</div>
				</div>
			)}

			{/* Error message when validation fails */}
			{coBrokingEnabled &&
				(!form.state.values.coBrokingAgentName ||
					!form.state.values.coBrokingAgencyName) && (
					<div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
						<p className="flex items-center text-sm">
							<span className="mr-2">⚠️</span>
							Please enter both Agent Name and Agency Name to continue when
							co-broking is enabled.
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
					className={`rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
						coBrokingEnabled &&
						(
							!form.state.values.coBrokingAgentName ||
								!form.state.values.coBrokingAgencyName
						)
							? "bg-blue-300 text-white hover:bg-blue-400 focus:ring-blue-300" // Disabled style but still clickable for feedback
							: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
					}`}
					onClick={handleNext}
				>
					Next
				</button>
			</div>
		</div>
	);
}
