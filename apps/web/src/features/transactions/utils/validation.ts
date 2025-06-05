/**
 * Transaction Form Validation
 *
 * Utility functions for validating form steps and fields.
 */

import type { TransactionFormValues } from "../types";

/**
 * Validates the Transaction Type step (Step 0)
 */
export function validateTransactionType(
	values: TransactionFormValues,
): boolean {
	const { marketType, transactionType, transactionDate } = values;

	if (!marketType || !transactionDate) {
		// Market type and transaction date are always required to proceed
		return false;
	}

	if (marketType === "primary") {
		// For primary market, transactionType should be 'sale' (auto-set by the component)
		// and a date must be present.
		return transactionType === "sale";
	}

	if (marketType === "secondary") {
		// For secondary market, transactionType must be either 'sale' or 'lease'
		// and a date must be present.
		return transactionType === "sale" || transactionType === "lease";
	}

	// If marketType is somehow not 'primary' or 'secondary', consider it invalid.
	return false;
}

/**
 * Validates the Property Selection step (Step 1 - Primary Market only)
 */
export function validatePropertySelection(
	values: TransactionFormValues,
): boolean {
	// For property selection, we check if the selectedProperty flag is set (future use)
	// or if all mandatory fields for manual entry were filled.
	return !!(
		(
			values.selectedProperty ||
			(values.propertyName &&
				values.propertyType &&
				values.address &&
				values.propertyDeveloper &&
				values.propertyProject &&
				values.totalPrice)
		) // Added totalPrice to mandatory check
	);
}

/**
 * Validates the Property Details step (Step 2 - Primary Market, Step 1 - Secondary Market)
 */
export function validatePropertyDetails(
	values: TransactionFormValues,
): boolean {
	// More lenient validation - only require property name
	return !!values.propertyName;
}

/**
 * Validates the Client Information step (Step 3 - Primary Market, Step 2 - Secondary Market)
 */
export function validateClientInformation(
	values: TransactionFormValues,
): boolean {
	// Client name is required, other fields are optional.
	return !!values.clientName;
}

/**
 * Validates the Co-Broking Setup step (Step 4 - Primary Market, Step 3 - Secondary Market)
 */
export function validateCoBroking(values: TransactionFormValues): boolean {
	return (
		!values.coBrokingEnabled ||
		!!(values.coBrokingAgentName && values.coBrokingAgencyName)
	);
}

/**
 * Validates the Commission Calculation step (Step 5 - Primary Market, Step 4 - Secondary Market)
 */
export function validateCommission(values: TransactionFormValues): boolean {
	// Relaxed validation: Only require commission type
	// For percentage mode, commissionValue is auto-calculated
	// For fixed mode, both commissionType and commissionValue are required
	if (!values.commissionType) return false;

	// Handle both 'fixed_amount' (new) and 'fixed' (legacy) types
	const commissionTypeStr = values.commissionType as string;
	if (commissionTypeStr === "fixed_amount" || commissionTypeStr === "fixed") {
		return !!values.commissionValue;
	}

	// For percentage mode, also check if percentage is provided
	if (commissionTypeStr === "percentage") {
		return !!values.commissionPercentage;
	}

	return true;
}

/**
 * Validates the Documents step (Step 6 - Primary Market, Step 5 - Secondary Market)
 */
export function validateDocuments(values: TransactionFormValues): boolean {
	return true; // Optional step
}

/**
 * Validates the Review step (Step 7 - Primary Market, Step 6 - Secondary Market)
 */
export function validateReview(values: TransactionFormValues): boolean {
	return true; // Final step
}

/**
 * Validates a specific step based on market type and step index
 */
export function validateStep(
	values: TransactionFormValues,
	step: number,
): boolean {
	const { marketType } = values;

	// Step 0 is common for both market types
	if (step === 0) {
		return validateTransactionType(values);
	}

	// Different validation paths for remaining steps based on market type
	if (marketType === "primary") {
		// Primary Market validation path
		switch (step) {
			case 1: // Property Selection (Primary Market only)
				return validatePropertySelection(values);
			case 2: // Property Details
				return validatePropertyDetails(values);
			case 3: // Client Information
				return validateClientInformation(values);
			case 4: // Co-Broking
				return validateCoBroking(values);
			case 5: // Commission
				return validateCommission(values);
			case 6: // Documents
				return validateDocuments(values);
			case 7: // Review
				return validateReview(values);
			default:
				return false;
		}
	}
	// Secondary Market validation path
	switch (step) {
		case 0: // Transaction Type & Date
			return !!(
				values.marketType &&
				values.transactionType &&
				values.transactionDate
			);
		case 1: // Property Details
			return !!(
				values.propertyName &&
				values.propertyType &&
				values.address &&
				values.totalPrice
			);
		case 2: // Client Information
			return true; // Allow proceeding regardless of fields
		case 3: // Co-Broking
			return true; // Co-broking is optional
		case 4: // Commission Calculation
			if (!values.commissionType) return false;
			if (values.commissionType === "fixed") {
				return !!values.commissionValue;
			}
			if (values.commissionType === "percentage") {
				return !!values.commissionPercentage;
			}
			return true;
		case 5: // Document Upload
			return true; // Document upload is optional for now
		case 6: // Review & Submit
			return true; // Review step, no specific validation here
		default:
			return false;
	}
}
