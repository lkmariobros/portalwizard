/**
 * NewTransactionForm (Refactored)
 *
 * This is the refactored version of the NewTransactionForm component.
 * It uses a modular approach with individual step components.
 */

"use client";

import React, { useCallback } from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
	TransactionFormProvider,
	useTransactionFormContext,
} from "./TransactionFormProvider";

// Import step components from the steps directory
import {
	ClientInformationStep,
	CoBrokingStep,
	CommissionCalculationStep,
	DocumentUploadStep,
	PropertyDetailsStep,
	PropertySelectionStep,
	ReviewStep,
	TransactionTypeStep,
} from "./steps";

/**
 * FormContainer is the main component that renders the current step
 */
function FormContainer() {
	const {
		form,
		currentStep,
		nextStep,
		previousStep,
		jumpToStep,
		activeSteps,
		isLastStep,
		canProceed,
		navigateToCommissionStep,
		isCommissionStepComplete,
		validateStep,
		marketType,
		debug,
	} = useTransactionFormContext();

	// Form submission handler
	const handleSubmit = useCallback(async () => {
		if (isLastStep) {
			await form.handleSubmit();
		}
	}, [form, isLastStep]);

	// Get the current step component
	const CurrentStepComponent = activeSteps[currentStep]?.component;

	// ---- START Cascade Diagnostic Logs ----
	console.log(
		"[FormContainer] Attempting to render step. CurrentStep Index:",
		currentStep,
		"Step ID:",
		activeSteps[currentStep]?.id,
		"Step Title:",
		activeSteps[currentStep]?.title,
		"Assigned CurrentStepComponent Name:",
		CurrentStepComponent?.name,
		"typeof CurrentStepComponent:",
		typeof CurrentStepComponent,
	);
	// Explicitly check if it's the PropertyDetailsStep component we expect
	if (activeSteps[currentStep]?.id === "propertyDetails") {
		// Assuming 'propertyDetails' is the ID for this step
		console.log(
			"[FormContainer] PropertyDetailsStep - Is activeSteps[currentStep].component the same as imported PropertyDetailsStep?",
			CurrentStepComponent === PropertyDetailsStep,
		);
	}
	if (activeSteps[currentStep]?.id === "review") {
		console.log(
			"[FormContainer] Review Step - Full Config:",
			JSON.stringify(activeSteps[currentStep]),
		);
		// 'ReviewStep' here refers to the component imported at the top of NewTransactionForm.tsx
		console.log(
			"[FormContainer] Review Step - Is activeSteps[currentStep].component the same as imported ReviewStep?",
			activeSteps[currentStep]?.component === ReviewStep,
		);
	}
	// ---- END Cascade Diagnostic Logs ----

	// Common props for all step components
	const stepProps = {
		form,
		onNext: nextStep,
		onPrevious: previousStep,
		isLastStep,
		navigateToCommissionStep,
		isCommissionStepComplete,
	};

	return (
		<div className="mx-auto w-full rounded-lg bg-white p-4 shadow-md">
			{/* Header and progress indicator */}
			<div className="mb-6">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-bold text-xl">New Transaction</h2>
					<div className="flex items-center gap-2">
						<span
							className={`rounded-full px-3 py-1 text-sm ${marketType === "primary" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
						>
							{marketType === "primary" ? "Primary Market" : "Secondary Market"}
						</span>
						<span className="font-medium text-gray-500 text-sm">
							Step {currentStep + 1} of {activeSteps.length}
						</span>
					</div>
				</div>

				<div className="h-2 w-full rounded-full bg-gray-200">
					<div
						className={`h-2 rounded-full transition-all duration-300 ease-in-out ${marketType === "primary" ? "bg-blue-600" : "bg-green-600"}`}
						style={{
							width: `${((currentStep + 1) / activeSteps.length) * 100}%`,
						}}
					/>
				</div>
			</div>

			{/* Main content layout */}
			<div className="flex flex-col gap-6 lg:flex-row">
				{/* Step navigation sidebar */}
				<div className="shrink-0 lg:w-64">
					<Card className="sticky top-4 bg-gray-50 p-3">
						<h3 className="mb-3 px-2 font-medium text-gray-700 text-sm">
							Transaction Steps
						</h3>
						<ul className="space-y-1.5">
							{activeSteps.map((step, index) => (
								<li key={step.id}>
									<div
										onClick={() => {
											if (index <= currentStep) {
												jumpToStep(activeSteps[index].id);
											}
										}}
										onKeyDown={(e) => {
											if (
												(e.key === "Enter" || e.key === " ") &&
												index <= currentStep
											) {
												jumpToStep(activeSteps[index].id);
											}
										}}
										role="button"
										tabIndex={index <= currentStep ? 0 : -1}
										className={`flex cursor-pointer items-center rounded-md px-3 py-2 font-medium text-sm transition-colors duration-150 ${
											index === currentStep
												? marketType === "primary"
													? "bg-blue-100 text-blue-700"
													: "bg-green-100 text-green-700"
												: currentStep >= index
													? "text-gray-700 hover:bg-gray-200"
													: "cursor-not-allowed text-gray-400"
										}`}
									>
										<div
											className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full shadow-sm ${
												index === currentStep
													? marketType === "primary"
														? "bg-blue-100 text-blue-700"
														: "bg-green-100 text-green-700"
													: index < currentStep
														? "bg-emerald-100 text-emerald-700"
														: "bg-gray-200 text-gray-500"
											}`}
										>
											{index < currentStep ? "✓" : index + 1}
										</div>
										<span className="font-medium">{step.title}</span>
									</div>
								</li>
							))}
						</ul>
					</Card>
				</div>

				{/* Main content area */}
				<div className="flex-1">
					<Card className="border-t-4 border-t-blue-500 p-6 shadow-sm">
						{/* Render current step */}
						{CurrentStepComponent ? (
							<>
								<CurrentStepComponent {...stepProps} />
							</>
						) : (
							<div className="rounded border border-red-300 bg-red-50 p-4">
								<p className="font-bold text-red-600">Component not found!</p>
								<p className="text-sm">
									Could not render step component for step {currentStep}.
								</p>
								<pre className="mt-2 bg-gray-100 p-2 text-xs">
									{JSON.stringify(
										{
											currentStep,
											activeStepsLength: activeSteps.length,
											currentStepId: activeSteps[currentStep]?.id,
											formValues: form.state.values,
										},
										null,
										2,
									)}
								</pre>
							</div>
						)}

						{/* Navigation buttons */}
						<div className="mt-8 flex justify-between border-gray-200 border-t pt-4">
							<Button
								variant="outline"
								onClick={previousStep}
								disabled={currentStep === 0}
							>
								Previous
							</Button>

							<div className="flex gap-3">
								{!isLastStep ? (
									<Button
										onClick={nextStep}
										disabled={!canProceed}
										className={
											marketType === "primary"
												? "bg-blue-600 hover:bg-blue-700"
												: "bg-green-600 hover:bg-green-700"
										}
									>
										Next Step
									</Button>
								) : (
									<Button
										onClick={handleSubmit}
										disabled={!canProceed}
										className="bg-amber-600 hover:bg-amber-700"
									>
										Submit Transaction
									</Button>
								)}
							</div>
						</div>
					</Card>
				</div>
			</div>

			{/* Debug information */}
			{debug?.enabled && (
				<div className="mt-6 rounded-md border border-gray-300 bg-gray-50 p-4 text-xs">
					<p className="mb-2 font-medium text-gray-700">Debug Information:</p>
					<pre className="max-h-60 overflow-auto rounded border bg-white p-3">
						{JSON.stringify(
							{
								...debug.info,
								marketType,
								currentStep,
								canProceed,
								isLastStep,
								formValues: form.state.values,
							},
							null,
							2,
						)}
					</pre>
				</div>
			)}
		</div>
	);
}

/**
 * NewTransactionForm is the main exported component
 * It wraps the form container with the TransactionFormProvider
 */
export function NewTransactionForm() {
	return (
		<TransactionFormProvider>
			<div className="mx-auto w-full max-w-7xl">
				<FormContainer />
			</div>
		</TransactionFormProvider>
	);
}
