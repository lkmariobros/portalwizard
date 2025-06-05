/**
 * useStepNavigation Hook
 *
 * Custom hook for managing step navigation in the transaction form.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	getCommissionStepIndex,
	getStepsByMarketType,
} from "../config/stepConfig";
import type { StepConfig, TransactionFormValues } from "../types";
import { validateStep } from "../utils/validation";

import type { FormApi } from "@tanstack/react-form";

interface UseStepNavigationProps {
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
		unknown // TODO: Replace unknown with TanStack Form instance type
	>; // Will be properly typed with TanStack form
}

export function useStepNavigation({ form }: UseStepNavigationProps) {
	// Current step state
	const [currentStep, setCurrentStep] = useState(0);

	// Previous market type for tracking changes
	const [previousMarketType, setPreviousMarketType] = useState<string | null>(
		null,
	);

	// Get form values
	const formValues = form.state.values as TransactionFormValues;
	const marketType = formValues.marketType || "secondary";

	// Get applicable steps based on market type
	const steps = useMemo(
		() =>
			getStepsByMarketType(marketType).filter((step) =>
				step.isApplicable(formValues),
			),
		[marketType, formValues],
	);

	// Navigation helpers
	const nextStep = useCallback(() => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	}, [currentStep, steps.length]);

	const previousStep = useCallback(() => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	}, [currentStep]);

	const jumpToStep = useCallback(
		(stepId: string) => {
			const stepIndex = steps.findIndex((step) => step.id === stepId);
			if (stepIndex >= 0) {
				setCurrentStep(stepIndex);
			}
		},
		[steps],
	);

	// Helper function to navigate directly to commission step
	const navigateToCommissionStep = useCallback(() => {
		const commissionStepIndex = getCommissionStepIndex(marketType);
		setCurrentStep(commissionStepIndex);
	}, [marketType]);

	// Helper function to check if commission step is complete
	const isCommissionStepComplete = useCallback(() => {
		if (!formValues.commissionType) return false;

		// Handle both 'fixed_amount' (new) and 'fixed' (legacy) types
		const commissionTypeStr = formValues.commissionType as string;
		if (commissionTypeStr === "fixed_amount" || commissionTypeStr === "fixed") {
			return !!formValues.commissionValue;
		}

		if (commissionTypeStr === "percentage") {
			return !!formValues.commissionPercentage;
		}

		return false;
	}, [formValues]);

	// Check if can proceed to next step
	const [canProceed, setCanProceed] = useState(false);

	// Update canProceed whenever relevant form values change
	useEffect(() => {
		const newCanProceed = validateStep(formValues, currentStep);
		console.log(`Can proceed update: ${newCanProceed}`);
		setCanProceed(newCanProceed);
	}, [formValues, currentStep]);

	// Reset step when market type changes
	useEffect(() => {
		// Only run this if we have a previous market type and it's different from current
		if (previousMarketType && previousMarketType !== marketType) {
			console.log(
				`Market type changed from ${previousMarketType} to ${marketType}, resetting form state`,
			);
			// Reset the step to 0 when switching market types
			setCurrentStep(0);
		}

		// Update previous market type
		if (marketType !== previousMarketType) {
			setPreviousMarketType(marketType);
		}
	}, [marketType, previousMarketType]);

	// Debug logging
	useEffect(() => {
		console.log("Form state:", {
			currentStep,
			marketType,
			currentStepName: steps[currentStep]?.title,
			totalSteps: steps.length,
			canProceed,
			isLastStep: currentStep === steps.length - 1,
			transactionType: formValues.transactionType,
			transactionDate: formValues.transactionDate,
		});
	}, [currentStep, marketType, steps, canProceed, formValues]);

	return {
		currentStep,
		setCurrentStep,
		nextStep,
		previousStep,
		jumpToStep,
		navigateToCommissionStep,
		isCommissionStepComplete,
		steps,
		activeStep: steps[currentStep],
		isLastStep: currentStep === steps.length - 1,
		canProceed,
		previousMarketType,
		setPreviousMarketType,
		totalSteps: steps.length,
	};
}
