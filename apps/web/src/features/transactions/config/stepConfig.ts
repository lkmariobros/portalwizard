/**
 * Transaction Form Step Configuration
 *
 * This file defines the step configuration for the transaction form.
 * It allows for flexible configuration of steps based on market type.
 */

import type { StepConfig } from "../types";
import {
	validateClientInformation,
	validateCoBroking,
	validateCommission,
	validateDocuments,
	validatePropertyDetails,
	validatePropertySelection,
	validateReview,
	validateTransactionType,
} from "../utils/validation";

// Import step components directly from the steps subdirectory
import {
	ClientInformationStep,
	CoBrokingStep,
	CommissionCalculationStep,
	DocumentUploadStep,
	PropertyDetailsStep,
	PropertySelectionStep,
	ReviewStep,
	TransactionTypeStep,
} from "../components/steps";

/**
 * Base steps shared between both market types
 */
export const baseSteps: StepConfig[] = [
	{
		id: "transaction-type",
		title: "Transaction Type",
		component: TransactionTypeStep,
		validation: validateTransactionType,
		isApplicable: () => true, // Always applicable
	},
];

/**
 * Primary market specific steps
 */
export const primaryMarketSteps: StepConfig[] = [
	// Property Selection (Primary Market only)
	{
		id: "property-selection",
		title: "Property Selection",
		component: PropertySelectionStep,
		validation: validatePropertySelection,
		isApplicable: (values) => values.marketType === "primary",
	},
	// Property Details
	{
		id: "property-details",
		title: "Property Details",
		component: PropertyDetailsStep,
		validation: validatePropertyDetails,
		isApplicable: () => true,
	},
	// Client Information
	{
		id: "client-information",
		title: "Client Information",
		component: ClientInformationStep,
		validation: validateClientInformation,
		isApplicable: () => true,
	},
	// Co-Broking
	{
		id: "co-broking",
		title: "Co-Broking",
		component: CoBrokingStep,
		validation: validateCoBroking,
		isApplicable: () => true,
	},
	// Commission Calculation
	{
		id: "commission",
		title: "Commission",
		component: CommissionCalculationStep,
		validation: validateCommission,
		isApplicable: () => true,
	},
	// Document Upload
	{
		id: "documents",
		title: "Documents",
		component: DocumentUploadStep,
		validation: validateDocuments,
		isApplicable: () => true,
	},
	// Review & Submit
	{
		id: "review",
		title: "Review & Submit",
		component: ReviewStep,
		validation: validateReview,
		isApplicable: () => true,
	},
];

/**
 * Secondary market specific steps
 */
export const secondaryMarketSteps: StepConfig[] = [
	// Property Details
	{
		id: "property-details",
		title: "Property Details",
		component: PropertyDetailsStep,
		validation: validatePropertyDetails,
		isApplicable: () => true,
	},
	// Client Information
	{
		id: "client-information",
		title: "Client Information",
		component: ClientInformationStep,
		validation: validateClientInformation,
		isApplicable: () => true,
	},
	// Co-Broking
	{
		id: "co-broking",
		title: "Co-Broking",
		component: CoBrokingStep,
		validation: validateCoBroking,
		isApplicable: () => true,
	},
	// Commission Calculation
	{
		id: "commission",
		title: "Commission",
		component: CommissionCalculationStep,
		validation: validateCommission,
		isApplicable: () => true,
	},
	// Document Upload
	{
		id: "documents",
		title: "Documents",
		component: DocumentUploadStep,
		validation: validateDocuments,
		isApplicable: () => true,
	},
	// Review & Submit
	{
		id: "review",
		title: "Review & Submit",
		component: ReviewStep,
		validation: validateReview,
		isApplicable: () => true,
	},
];

/**
 * Get steps based on market type
 */
export function getStepsByMarketType(marketType: string): StepConfig[] {
	const marketSpecificSteps =
		marketType === "primary" ? primaryMarketSteps : secondaryMarketSteps;
	return [...baseSteps, ...marketSpecificSteps];
}

/**
 * Get step by ID
 */
export function getStepById(
	stepId: string,
	marketType: string,
): StepConfig | undefined {
	const steps = getStepsByMarketType(marketType);
	return steps.find((step) => step.id === stepId);
}

/**
 * Get step index by ID
 */
export function getStepIndexById(stepId: string, marketType: string): number {
	const steps = getStepsByMarketType(marketType);
	return steps.findIndex((step) => step.id === stepId);
}

/**
 * Get commission step index based on market type
 */
export function getCommissionStepIndex(marketType: string): number {
	const allSteps = getStepsByMarketType(marketType);
	const commissionIndex = allSteps.findIndex(
		(step) => step.id === "commission",
	);

	if (commissionIndex === -1) {
		console.error(
			`Commission step with id 'commission' not found for marketType: ${marketType}. Please check stepConfig.ts.`,
		);
		// Fallback to old logic +1 for baseStep, though dynamic find is preferred.
		// This path indicates a configuration issue if 'commission' step is expected.
		return marketType === "primary" ? 6 : 5;
	}
	return commissionIndex;
}
