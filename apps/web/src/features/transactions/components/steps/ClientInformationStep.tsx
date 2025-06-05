/**
 * ClientInformationStep Component
 *
 * Handles the client information step of the transaction form.
 * This step allows users to enter client details.
 */

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type React from "react";
import type { StepProps } from "../../types";
import { useTransactionFormContext } from "../TransactionFormProvider";

export function ClientInformationStep({ form, onNext, onPrevious }: StepProps) {
	// Handle input changes
	const handleInputChange =
		(field: string) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			form.setFieldValue(field, e.target.value);
		};

	return (
		<div>
			<h3 className="mb-4 font-semibold text-lg">Client Information</h3>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{/* Client Name */}
				<div className="space-y-2">
					<Label htmlFor="clientName" className="font-medium text-sm">
						Client Name <span className="text-red-500">*</span>
					</Label>
					<Input
						id="clientName"
						value={form.state.values.clientName || ""}
						onChange={handleInputChange("clientName")}
						className="w-full"
						placeholder="Enter client's full name"
					/>
				</div>

				{/* Client Email */}
				<div className="space-y-2">
					<Label htmlFor="clientEmail" className="font-medium text-sm">
						Client Email
					</Label>
					<Input
						id="clientEmail"
						type="email"
						value={form.state.values.clientEmail || ""}
						onChange={handleInputChange("clientEmail")}
						className="w-full"
						placeholder="Enter client's email address"
					/>
				</div>
			</div>

			<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				{/* Client Phone */}
				<div className="space-y-2">
					<Label htmlFor="clientPhone" className="font-medium text-sm">
						Client Phone
					</Label>
					<Input
						id="clientPhone"
						value={form.state.values.clientPhone || ""}
						onChange={handleInputChange("clientPhone")}
						className="w-full"
						placeholder="Enter client's phone number"
					/>
				</div>

				{/* Client ID Number */}
				<div className="space-y-2">
					<Label htmlFor="clientIdNumber" className="font-medium text-sm">
						Client ID Number
					</Label>
					<Input
						id="clientIdNumber"
						value={form.state.values.clientIdNumber || ""}
						onChange={handleInputChange("clientIdNumber")}
						className="w-full"
						placeholder="Enter client's ID number"
					/>
				</div>
			</div>

			<div className="mt-4">
				{/* Client Acquisition Source */}
				<div className="space-y-2">
					<Label
						htmlFor="clientAcquisitionSource"
						className="font-medium text-sm"
					>
						Acquisition Source
					</Label>
					<select
						id="clientAcquisitionSource"
						className="h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={form.state.values.clientAcquisitionSource || ""}
						onChange={handleInputChange("clientAcquisitionSource")}
					>
						<option value="" disabled>
							Select acquisition source
						</option>
						<option value="direct">Direct Contact</option>
						<option value="referral">Referral</option>
						<option value="website">Website</option>
						<option value="social-media">Social Media</option>
						<option value="listing-portal">Listing Portal</option>
						<option value="walk-in">Walk-in</option>
						<option value="other">Other</option>
					</select>
				</div>
			</div>

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
