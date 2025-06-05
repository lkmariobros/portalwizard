/**
 * useTransactionForm Hook
 *
 * Custom hook for managing transaction form state and submission.
 */

import { trpc } from "@/utils/trpc";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { toast } from "sonner";
import type {
	OnSubmitResult as GlobalOnSubmitResult,
	TransactionFormValues,
} from "../types"; // Use alias if global one is different or for clarity

export function useTransactionForm(
	initialData?: Partial<TransactionFormValues>,
) {
	// Local OnSubmitResult for the promise type and 8th generic
	type LocalOnSubmitResult =
		| { status: "success" }
		| { status: "error"; message: string };
	// Set up the mutation for creating a transaction
	// Set up the mutation for creating a transaction
	const createTransaction = useMutation({
		...trpc.transactions.create.mutationOptions(),
		onSuccess: () => {
			toast.success("Transaction created successfully!");
		},
		onError: (error) => {
			// Handle both TRPCClientError and regular Error types
			const errorMessage =
				error instanceof TRPCClientError
					? error.message
					: error instanceof Error
						? error.message
						: "Unknown error";
			toast.error(`Error creating transaction: ${errorMessage}`);
		},
	});

	// Initialize the form with default values
	// Define a validator type, even if it's a no-op, to satisfy TypeScript's focus
	type FormApiForValidation = import("@tanstack/react-form").FormApi<
		TransactionFormValues,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any
	>;
	type FormValidatorType = (props: {
		value: TransactionFormValues;
		formApi: FormApiForValidation;
	}) => Record<string, never> | undefined;

	const form = useForm<
		TransactionFormValues, // 1. TData
		FormValidatorType, // 2. TFormValidator
		undefined, // 3. TFormSerializer
		undefined, // 4. TServerData
		undefined, // 5. TServerError
		undefined, // 6. TSelectedData
		TransactionFormValues, // 7. TOnSubmit (type of 'value' in onSubmit handler)
		LocalOnSubmitResult, // 8. TOnSubmitResult (return type of onSubmit promise)
		undefined, // 9. TLayoutComponent
		undefined // 10. TFieldComponent
	>({
		defaultValues: {
			marketType: initialData?.marketType || "secondary",
			transactionType: initialData?.transactionType || "",
			transactionDate: initialData?.transactionDate || "",
			propertyName: initialData?.propertyName || "",
			propertyType: initialData?.propertyType || "",
			address: initialData?.address || "",
			totalPrice: initialData?.totalPrice || "",
			monthlyRent: initialData?.monthlyRent || "",
			propertyDeveloper: initialData?.propertyDeveloper || "",
			propertyProject: initialData?.propertyProject || "",
			propertyUnitNumber: initialData?.propertyUnitNumber || "",
			selectedProperty: initialData?.selectedProperty || undefined,
			builtUpArea: initialData?.builtUpArea || "",
			landArea: initialData?.landArea || "",
			bedrooms: initialData?.bedrooms || "",
			bathrooms: initialData?.bathrooms || "",
			carParks: initialData?.carParks || "",
			furnishing: initialData?.furnishing || "",
			propertyFeatures: initialData?.propertyFeatures || "",
			clientName: initialData?.clientName || "",
			clientEmail: initialData?.clientEmail || "",
			clientPhone: initialData?.clientPhone || "",
			clientIdNumber: initialData?.clientIdNumber || "",
			clientAcquisitionSource: initialData?.clientAcquisitionSource || "",
			coBrokingEnabled: initialData?.coBrokingEnabled || false,
			coBrokingDirection: initialData?.coBrokingDirection || "buyer",
			coBrokingAgentName: initialData?.coBrokingAgentName || "",
			coBrokingAgentRen: initialData?.coBrokingAgentRen || "",
			coBrokingAgencyName: initialData?.coBrokingAgencyName || "",
			coBrokingAgentContact: initialData?.coBrokingAgentContact || "",
			commissionValue: initialData?.commissionValue || "",
			commissionType: initialData?.commissionType || "",
			commissionPercentage: initialData?.commissionPercentage || "",
			documents: initialData?.documents || [],
			notes: initialData?.notes || "",
			isAgencyListing: initialData?.isAgencyListing || false,
		},
		// Form submission handler
		onSubmit: async ({
			value,
		}: { value: TransactionFormValues }): Promise<LocalOnSubmitResult> => {
			try {
				// Transform form data to match tRPC schema defined in createTransactionSchema
				const transactionData = {
					// Step 1: Transaction Type & Date
					marketType: value.marketType as "primary" | "secondary",
					transactionType: value.transactionType as "sale" | "lease",
					transactionDate: new Date(
						value.transactionDate || new Date(),
					).toISOString(),

					// Step 2: Property Details
					propertyDetails: {
						name: value.propertyName || "",
						type: (value.propertyType || "other") as
							| "residential_villa"
							| "residential_apartment"
							| "residential_townhouse"
							| "commercial_office"
							| "commercial_retail"
							| "commercial_warehouse"
							| "land_residential"
							| "land_commercial"
							| "industrial_factory"
							| "other",
						address: value.address || "",
						developer: value.propertyDeveloper || undefined,
						project: value.propertyProject || undefined,
						unitNumber: value.propertyUnitNumber || undefined, // New field
					},

					// Step 3: Client Information - These must be at root level as per API schema
					clientName: value.clientName || "",
					clientEmail: value.clientEmail || "",
					clientPhone: value.clientPhone || "",
					clientType: "buyer" as "buyer" | "seller" | "tenant" | "landlord", // Default to buyer, should be set based on form
					clientIdNumber: value.clientIdNumber || "",

					// Step 4: Co-Broking Setup
					coBrokingType: value.coBrokingEnabled
						? "co_broke"
						: ("direct" as "direct" | "co_broke"),
					coBrokingAgentName: value.coBrokingEnabled
						? value.coBrokingAgentName
						: undefined,
					coBrokingAgencyName: value.coBrokingEnabled
						? value.coBrokingAgencyName
						: undefined,
					coBrokingAgentRera: value.coBrokingEnabled
						? value.coBrokingAgentRen
						: undefined,

					// Step 5: Commission Calculation
					totalPrice: String(value.totalPrice || "0"),
					commissionValue: String(value.commissionValue || "0"),
					// Handle both fixed_amount (new) and fixed (legacy) values
					commissionType: ((value.commissionType as string) === "fixed"
						? "fixed_amount"
						: value.commissionType) as "percentage" | "fixed_amount",
					commissionPercentage: value.commissionPercentage
						? String(value.commissionPercentage)
						: undefined,

					// Step 6: Notes
					notes: value.notes || undefined,
				};

				// Submit the transaction
				await createTransaction.mutateAsync(transactionData);

				return { status: "success" };
			} catch (error: unknown) {
				console.error("Error submitting transaction:", error);
				if (error instanceof Error) {
					return { status: "error", message: error.message };
				}
				return { status: "error", message: "An unknown error occurred" };
			}
		},
		validator: (_props: {
			value: TransactionFormValues;
			formApi: FormApiForValidation;
		}) => undefined, // No-op validator
	});

	return {
		form,
		isSubmitting: createTransaction.isPending,
		isSuccess: createTransaction.isSuccess,
		error: createTransaction.error,
	};
}
