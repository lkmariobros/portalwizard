import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { TransactionDisplayData } from "@/features/transactions/types";
import { format } from "date-fns"; // For date formatting
import React from "react";

interface TransactionDetailsModalProps {
	transaction: TransactionDisplayData | null;
	isOpen: boolean;
	onClose: () => void;
}

function formatDisplay(value: string | number | undefined, defaultValue = "-") {
	return value !== undefined && value !== null && value !== ""
		? String(value)
		: defaultValue;
}

export function TransactionDetailsModal({
	transaction,
	isOpen,
	onClose,
}: TransactionDetailsModalProps) {
	if (!transaction) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						Transaction Details: {transaction.propertyName || "N/A"}
					</DialogTitle>
					<DialogDescription>
						Detailed information for transaction ID: {transaction.id}
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<h4 className="mb-2 font-semibold text-lg">Property Information</h4>
					<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
						<p>
							<strong>Property Name:</strong>{" "}
							{formatDisplay(transaction.propertyName)}
						</p>
						<p>
							<strong>Full Address:</strong>{" "}
							{formatDisplay(transaction.address)}
						</p>
						<p>
							<strong>Property Type:</strong>{" "}
							{formatDisplay(transaction.propertyType)}
						</p>
						<p>
							<strong>Market Type:</strong>{" "}
							{formatDisplay(transaction.marketType)}
						</p>
						<p>
							<strong>Developer:</strong>{" "}
							{formatDisplay(transaction.propertyDeveloper)}
						</p>
						<p>
							<strong>Project:</strong>{" "}
							{formatDisplay(transaction.propertyProject)}
						</p>
						<p>
							<strong>Unit Number:</strong>{" "}
							{formatDisplay(transaction.propertyUnitNumber)}
						</p>
						<p>
							<strong>Built-up Area:</strong>{" "}
							{formatDisplay(transaction.builtUpArea)} sqft
						</p>
						<p>
							<strong>Land Area:</strong> {formatDisplay(transaction.landArea)}{" "}
							sqft
						</p>
						<p>
							<strong>Bedrooms:</strong> {formatDisplay(transaction.bedrooms)}
						</p>
						<p>
							<strong>Bathrooms:</strong> {formatDisplay(transaction.bathrooms)}
						</p>
						<p>
							<strong>Car Parks:</strong> {formatDisplay(transaction.carParks)}
						</p>
						<p>
							<strong>Furnishing:</strong>{" "}
							{formatDisplay(transaction.furnishing)}
						</p>
						<p>
							<strong>Features:</strong>{" "}
							{formatDisplay(transaction.propertyFeatures)}
						</p>
					</div>

					<h4 className="mt-4 mb-2 font-semibold text-lg">
						Transaction & Financials
					</h4>
					<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
						<p>
							<strong>Transaction Date:</strong>{" "}
							{transaction.transactionDate
								? format(new Date(transaction.transactionDate), "PPP")
								: "-"}
						</p>
						<p>
							<strong>Transaction Type:</strong>{" "}
							{formatDisplay(transaction.transactionType)}
						</p>
						{transaction.transactionType === "lease" ? (
							<p>
								<strong>Monthly Rent:</strong> MYR{" "}
								{formatDisplay(transaction.monthlyRent)}
							</p>
						) : (
							<p>
								<strong>Total Price:</strong> MYR{" "}
								{formatDisplay(transaction.totalPrice)}
							</p>
						)}
						<p>
							<strong>Status:</strong> {formatDisplay(transaction.status)}
						</p>
						<p>
							<strong>Commission Type:</strong>{" "}
							{formatDisplay(transaction.commissionType)}
						</p>
						<p>
							<strong>Commission Value:</strong>{" "}
							{formatDisplay(transaction.commissionValue)}
						</p>
						<p>
							<strong>Commission Percentage:</strong>{" "}
							{formatDisplay(transaction.commissionPercentage)}%
						</p>
					</div>

					<h4 className="mt-4 mb-2 font-semibold text-lg">
						Client Information
					</h4>
					<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
						<p>
							<strong>Client Name:</strong>{" "}
							{formatDisplay(transaction.clientName)}
						</p>
						<p>
							<strong>Client Email:</strong>{" "}
							{formatDisplay(transaction.clientEmail)}
						</p>
						<p>
							<strong>Client Phone:</strong>{" "}
							{formatDisplay(transaction.clientPhone)}
						</p>
						<p>
							<strong>Client ID Number:</strong>{" "}
							{formatDisplay(transaction.clientIdNumber)}
						</p>
						<p>
							<strong>Acquisition Source:</strong>{" "}
							{formatDisplay(transaction.clientAcquisitionSource)}
						</p>
					</div>

					{transaction.coBrokingEnabled && (
						<>
							<h4 className="mt-4 mb-2 font-semibold text-lg">
								Co-Broking Information
							</h4>
							<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
								<p>
									<strong>Direction:</strong>{" "}
									{formatDisplay(transaction.coBrokingDirection)}
								</p>
								<p>
									<strong>Agent Name:</strong>{" "}
									{formatDisplay(transaction.coBrokingAgentName)}
								</p>
								<p>
									<strong>Agency:</strong>{" "}
									{formatDisplay(transaction.coBrokingAgencyName)}
								</p>
								<p>
									<strong>REN:</strong>{" "}
									{formatDisplay(transaction.coBrokingAgentRen)}
								</p>
								<p>
									<strong>Contact:</strong>{" "}
									{formatDisplay(transaction.coBrokingAgentContact)}
								</p>
							</div>
						</>
					)}

					{transaction.notes && (
						<>
							<h4 className="mt-4 mb-2 font-semibold text-lg">Notes</h4>
							<p className="whitespace-pre-wrap text-sm">{transaction.notes}</p>
						</>
					)}

					{/* Placeholder for Documents & Status History */}
					{/* <h4 className="font-semibold text-lg mt-4 mb-2">Documents</h4> */}
					{/* <p className="text-sm">Document list here...</p> */}
					{/* <h4 className="font-semibold text-lg mt-4 mb-2">Status History</h4> */}
					{/* <p className="text-sm">Status timeline here...</p> */}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
