/**
 * ReviewStep Component
 *
 * Handles the final review step of the transaction form.
 * This step displays a summary of all entered information and allows submission.
 */

"use client";

import { AlertCircle, CheckCircle } from "lucide-react";
import type React from "react";
import type { StepProps } from "../../types";
import { useTransactionFormContext } from "../TransactionFormProvider";

// Helper components moved outside ReviewStep for performance optimization
// Section component for consistent styling
const Section = ({
	title,
	children,
}: { title: string; children: React.ReactNode }) => (
	<div className="space-y-2">
		<h4 className="font-medium text-gray-700">{title}</h4>
		<div className="space-y-3 rounded-md border bg-gray-50 p-4">{children}</div>
	</div>
);

// Field row component for consistent styling
const FieldRow = ({
	label,
	value,
	important = false,
}: {
	label: string;
	value: string | number | boolean | undefined;
	important?: boolean;
}) => (
	<div className="flex items-center justify-between border-gray-200 border-b py-1 last:border-0">
		<span className="text-gray-600 text-sm">{label}</span>
		<span className={`font-medium ${important ? "text-blue-600" : ""}`}>
			{value === true ? "Yes" : value === false ? "No" : value || "-"}
		</span>
	</div>
);

// Validation status component
const ValidationStatus = ({ isValid }: { isValid: boolean }) => (
	<div
		className={`flex items-center gap-2 rounded-md p-2 ${isValid ? "bg-green-50" : "bg-red-50"}`}
	>
		{isValid ? (
			<CheckCircle className="h-5 w-5 text-green-500" />
		) : (
			<AlertCircle className="h-5 w-5 text-red-500" />
		)}
		<span
			className={`font-medium text-sm ${isValid ? "text-green-700" : "text-red-700"}`}
		>
			{isValid ? "Complete" : "Incomplete"}
		</span>
	</div>
);

export function ReviewStep({ form: propsForm, onPrevious }: StepProps) {
	console.log(
		"[[CASCADE_DEBUG]] Executing ReviewStep component from ReviewStep.tsx",
	);
	const { form: contextForm, debug } = useTransactionFormContext();

	// Get form values
	const formValues = contextForm.state.values;
	const {
		marketType,
		transactionType,
		transactionDate,
		propertyName,
		propertyType,
		address,
		totalPrice,
		propertyDeveloper,
		propertyProject,
		clientName,
		clientEmail,
		clientPhone,
		clientIdNumber,
		clientAcquisitionSource,
		coBrokingEnabled,
		coBrokingDirection,
		coBrokingAgentName,
		coBrokingAgencyName,
		commissionType,
		commissionValue,
		commissionPercentage,
		documents,
		notes,
		isAgencyListing,
	} = formValues;

	// Check if form is submitting
	const isSubmitting = contextForm.state.isSubmitting;

	// Handle form submission
	const handleSubmit = () => {
		contextForm.handleSubmit();
	};

	// Format date for display
	const formatDate = (dateString: string) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-lg">Review & Submit</h3>

				{/* Form Status */}
				<div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-blue-700">
					<span className="font-medium text-sm">Form Status:</span>
					<ValidationStatus isValid={true} />
				</div>
			</div>

			{/* Transaction Details Section */}
			<Section title="Transaction Details">
				<FieldRow
					label="Market Type"
					value={
						marketType === "primary" ? "Primary Market" : "Secondary Market"
					}
				/>
				<FieldRow
					label="Transaction Type"
					value={
						transactionType === "sale"
							? "Sale"
							: transactionType === "lease"
								? "Lease"
								: "-"
					}
				/>
				<FieldRow
					label="Transaction Date"
					value={formatDate(transactionDate)}
				/>
				{marketType === "secondary" && (
					<FieldRow label="Company Listing" value={isAgencyListing} />
				)}
			</Section>

			{/* Property Details Section */}
			<Section title="Property Details">
				<FieldRow label="Property Name" value={propertyName} important />
				<FieldRow label="Property Type" value={propertyType} />
				<FieldRow label="Address" value={address} />
				<FieldRow label="Total Price" value={totalPrice} important />

				{marketType === "primary" && (
					<>
						<FieldRow label="Developer" value={propertyDeveloper} />
						<FieldRow label="Project" value={propertyProject} />
					</>
				)}
			</Section>

			{/* Client Information Section */}
			<Section title="Client Information">
				<FieldRow label="Client Name" value={clientName} important />
				<FieldRow label="Client Email" value={clientEmail} />
				<FieldRow label="Client Phone" value={clientPhone} />
				<FieldRow label="Client ID Number" value={clientIdNumber} />
				<FieldRow label="Acquisition Source" value={clientAcquisitionSource} />
			</Section>

			{/* Co-Broking Section */}
			<Section title="Co-Broking Information">
				<FieldRow label="Co-Broking Enabled" value={coBrokingEnabled} />

				{coBrokingEnabled && (
					<>
						<FieldRow
							label="Representation"
							value={coBrokingDirection === "buyer" ? "Buyer" : "Seller"}
						/>
						<FieldRow label="Agent Name" value={coBrokingAgentName} />
						<FieldRow label="Agency Name" value={coBrokingAgencyName} />
					</>
				)}
			</Section>

			{/* Commission Section */}
			<Section title="Commission Details">
				<FieldRow
					label="Commission Type"
					value={
						commissionType === "percentage" ? "Percentage" : "Fixed Amount"
					}
				/>

				{commissionType === "percentage" && (
					<FieldRow
						label="Commission Percentage"
						value={`${commissionPercentage}%`}
					/>
				)}

				<FieldRow label="Commission Value" value={commissionValue} important />
			</Section>

			{/* Documents Section */}
			<Section title="Documents">
				<FieldRow
					label="Uploaded Documents"
					value={
						documents?.length > 0
							? `${documents.length} files`
							: "No documents uploaded"
					}
				/>

				{notes && (
					<div className="mt-2 border-gray-200 border-t pt-2">
						<p className="font-medium text-gray-700 text-sm">Notes:</p>
						<p className="mt-1 text-gray-600 text-sm">{notes}</p>
					</div>
				)}
			</Section>

			{/* Debug Information (only in debug mode) */}
			{debug?.enabled && (
				<div className="rounded-md border border-gray-300 bg-gray-50 p-4 font-mono text-xs">
					<p className="mb-1 font-medium">Debug Information:</p>
					<pre>{JSON.stringify(debug.info, null, 2)}</pre>
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
					className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
					onClick={handleSubmit}
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>
							<svg
								className="h-4 w-4 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<title>Loading spinner</title>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Submitting...
						</>
					) : (
						"Submit Transaction"
					)}
				</button>
			</div>
		</div>
	);
}
