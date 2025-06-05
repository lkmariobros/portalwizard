import type { FormApi } from "@tanstack/react-form";
import type React from "react";

// Define TransactionFormValues based on observed usage
export interface TransactionFormValues {
	marketType?: "primary" | "secondary";
	transactionType?: "sale" | "lease" | string;
	transactionDate?: string;
	propertyName?: string;
	propertyType?: string;
	address?: string;
	totalPrice?: number | string;
	propertyDeveloper?: string;
	propertyProject?: string;
	propertyUnitNumber?: string;
	monthlyRent?: string;
	builtUpArea?: string;
	landArea?: string;
	bedrooms?: string;
	bathrooms?: string;
	carParks?: string;
	furnishing?: string;
	propertyFeatures?: string;
	clientName?: string;
	clientEmail?: string;
	clientPhone?: string;
	clientIdNumber?: string;
	clientAcquisitionSource?: string;
	coBrokingEnabled?: boolean;
	coBrokingDirection?: "buyer" | "seller" | string;
	coBrokingAgentName?: string;
	coBrokingAgencyName?: string;
	coBrokingAgentRen?: string;
	coBrokingAgentContact?: string;
	commissionType?: "percentage" | "fixed_amount" | "fixed" | string;
	commissionValue?: number | string;
	commissionPercentage?: number | string;
	documents?: { name: string; url?: string; type?: string }[];
	notes?: string;
	isAgencyListing?: boolean;
	selectedProperty?: Property;
	// Add any other fields present in your form
}

// Define the result type for the onSubmit handler
export type OnSubmitResult = undefined; // Or whatever your onSubmit actually returns

// Placeholder for property type - define more specifically as needed
export interface Property {
	id: string;
	name: string;
	address?: string;
	price?: number;
	// Add other relevant property fields
	[key: string]: unknown; // Allows for additional, less-defined properties
}

// Define StepProps passed to each step component
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
		undefined
	>;
	onNext: () => void;
	onPrevious: () => void;
	isLastStep: boolean;
	navigateToCommissionStep: () => void;
	isCommissionStepComplete: () => boolean;
	// Add other common props if any
}

// Define the type for a step component
export type StepComponentType = React.ComponentType<StepProps>;

// Define the structure of a step configuration object
export interface StepConfig {
	id: string;
	title: string;
	component: StepComponentType; // This is a critical type
	validation: (values: TransactionFormValues) => boolean;
	isApplicable: (values: TransactionFormValues) => boolean;
}

// Define the shape of the transaction form context
export interface TransactionFormContextType {
	form: FormApi<
		TransactionFormValues,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined
	>; // Using 'any' for validator type
	marketType: "primary" | "secondary";
	currentStep: number;
	setCurrentStep: (step: number) => void;
	nextStep: () => void;
	previousStep: () => void;
	jumpToStep: (stepId: string) => void;
	navigateToCommissionStep: () => void;
	activeSteps: StepConfig[];
	totalSteps: number;
	isLastStep: boolean;
	canProceed: boolean;
	validateStep: (stepIndex: number) => boolean;
	isCommissionStepComplete: () => boolean;
	debug: {
		enabled: boolean;
		info: {
			currentStep: number;
			marketType: string;
			transactionType: string;
			transactionDate: string;
			// Add other debug fields if they are part of the context's debug.info
		};
	};
	// Add other context values if any
}

// Define the data structure for displaying a single transaction in lists/modals
export interface TransactionDisplayData {
	id: string; // Unique ID from the database
	transactionDate?: string;
	propertyName?: string; // For concise display in table
	transactionType?: "sale" | "lease" | string;
	totalPrice?: number | string; // For sales
	monthlyRent?: string; // For leases
	status: string; // e.g., "Completed", "Pending", "In Progress"

	// Comprehensive details for the modal view
	marketType?: "primary" | "secondary";
	propertyType?: string;
	address?: string; // Full address
	propertyDeveloper?: string;
	propertyProject?: string;
	propertyUnitNumber?: string;
	builtUpArea?: string;
	landArea?: string;
	bedrooms?: string;
	bathrooms?: string;
	carParks?: string;
	furnishing?: string;
	propertyFeatures?: string;
	clientName?: string;
	clientEmail?: string;
	clientPhone?: string;
	clientIdNumber?: string;
	clientAcquisitionSource?: string;
	coBrokingEnabled?: boolean;
	coBrokingDirection?: "buyer" | "seller" | string;
	coBrokingAgentName?: string;
	coBrokingAgencyName?: string;
	coBrokingAgentRen?: string;
	coBrokingAgentContact?: string;
	commissionType?: "percentage" | "fixed_amount" | "fixed" | string;
	commissionValue?: number | string;
	commissionPercentage?: number | string;
	documents?: { name: string; url?: string; type?: string }[]; // More specific type for documents
	notes?: string;
	isAgencyListing?: boolean;
	// Optional: for transaction timeline/status history if available
	// statusHistory?: { status: string; date: string; notes?: string }[];
}
