/**
 * Transaction Form Types
 *
 * This file contains all shared types and interfaces used across the transaction form components.
 */

// Form value types
export interface Property {
	id: string;
	name: string;
	address?: string;
	price?: number;
	[key: string]: unknown;
}

export interface TransactionFormValues {
	marketType: "primary" | "secondary" | "";
	transactionType: "sale" | "lease" | "";
	transactionDate: string;

	// Property details
	propertyName: string;
	propertyType: string;
	address: string;
	totalPrice: string;
	monthlyRent: string; // For lease transactions
	propertyDeveloper: string;
	propertyProject: string;
	propertyUnitNumber: string; // New field for property unit number
	selectedProperty?: Property; // Tracks if a property was selected in the Primary Market flow

	// Additional property details
	builtUpArea: string;
	landArea: string;
	bedrooms: string;
	bathrooms: string;
	carParks: string;
	furnishing: string;
	propertyFeatures: string;

	// Client information
	clientName: string;
	clientEmail: string;
	clientPhone: string;
	clientIdNumber: string;
	clientAcquisitionSource: string;

	// Co-broking setup
	coBrokingEnabled: boolean;
	coBrokingDirection: "seller" | "buyer";
	coBrokingAgentName: string;
	coBrokingAgentRen: string;
	coBrokingAgencyName: string;
	coBrokingAgentContact: string;

	// Commission calculation
	commissionValue: string;
	commissionType: "percentage" | "fixed_amount" | "";
	commissionPercentage: string;

	// Documents and notes
	documents: File[];
	notes: string;
	isAgencyListing: boolean;
}

// Step configuration interface
export interface StepConfig {
	id: string;
	title: string;
	component: React.ComponentType<StepProps>;
	validation: (values: TransactionFormValues) => boolean;
	isApplicable: (values: TransactionFormValues) => boolean;
}

// Import type from TanStack Form
import type { FormApi } from "@tanstack/react-form";

// Consistent props for all step components
export interface StepProps {
	form: FormApi<
		TransactionFormValues,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined
	>;
	onNext?: () => void;
	onPrevious?: () => void;
	isLastStep?: boolean;
	navigateToCommissionStep?: () => void;
	isCommissionStepComplete?: () => boolean;
}

// Form field type for TanStack form
export type FormFieldType<T = unknown> = {
	state: {
		value: T;
		meta: {
			errors: string[];
			errorMap: Record<string, string>;
		};
	};
	handleChange: (value: T) => void;
	handleBlur: () => void;
	name: string;
};

// Form context type for sharing state between components
export interface TransactionFormContextType {
	// Navigation
	currentStep: number;
	setCurrentStep: (step: number) => void;
	nextStep: () => void;
	previousStep: () => void;
	jumpToStep: (stepId: string) => void;
	setFieldValue: (field: string, value: unknown) => void;
	navigateToCommissionStep: () => void;

	// Step management
	activeSteps: StepConfig[];
	totalSteps: number;
	isLastStep: boolean;
	canProceed: boolean;

	// Form state
	form: FormApi<
		TransactionFormValues,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined
	>;
	marketType: "primary" | "secondary" | "";

	// Helpers
	validateStep: (stepIndex: number) => boolean;
	isCommissionStepComplete: () => boolean;

	// Debug info
	debug: {
		enabled: boolean;
		info: {
			currentStep: number;
			marketType: string;
			transactionType: string;
			transactionDate: string;
		};
	};
}
