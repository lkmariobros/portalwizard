/**
 * TransactionFormProvider
 *
 * Context provider for the transaction form.
 * Provides form state, navigation, and validation to all step components.
 */

import type React from "react";
import { createContext, useContext } from "react";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { useTransactionForm } from "../hooks/useTransactionForm";
import type { TransactionFormContextType } from "../types";

// Create context with null initial value
const TransactionFormContext = createContext<TransactionFormContextType | null>(
	null,
);

// Custom hook to use the context
export function useTransactionFormContext() {
	const context = useContext(TransactionFormContext);
	if (!context) {
		throw new Error(
			"useTransactionFormContext must be used within a TransactionFormProvider",
		);
	}
	return context;
}

interface TransactionFormProviderProps {
	children: React.ReactNode;
	debugMode?: boolean;
}

export function TransactionFormProvider({
	children,
	debugMode = true,
}: TransactionFormProviderProps) {
	// Initialize form
	const { form, isSubmitting, isSuccess, error } = useTransactionForm();

	// Initialize step navigation
	const {
		currentStep,
		setCurrentStep,
		nextStep,
		previousStep,
		jumpToStep,
		navigateToCommissionStep,
		isCommissionStepComplete,
		steps: activeSteps,
		isLastStep,
		canProceed,
		previousMarketType,
		setPreviousMarketType,
		totalSteps,
	} = useStepNavigation({ form });

	// Get market type from form values
	const marketType = form.state.values.marketType || "secondary";

	// Create context value
	const contextValue: TransactionFormContextType = {
		// Form
		form,
		marketType,

		// Navigation
		currentStep,
		setCurrentStep,
		nextStep,
		previousStep,
		jumpToStep,
		navigateToCommissionStep,

		// Steps
		activeSteps,
		totalSteps,
		isLastStep,
		canProceed,

		// Validation
		validateStep: (stepIndex) => {
			// This is just a wrapper around the step's validation function
			if (stepIndex >= 0 && stepIndex < activeSteps.length) {
				return activeSteps[stepIndex].validation(form.state.values);
			}
			return false;
		},
		isCommissionStepComplete,

		// Debug info
		debug: {
			enabled: debugMode,
			info: {
				currentStep,
				marketType,
				transactionType: form.state.values.transactionType || "",
				transactionDate: form.state.values.transactionDate || "",
			},
		},
	};

	return (
		<TransactionFormContext.Provider value={contextValue}>
			{children}
		</TransactionFormContext.Provider>
	);
}
