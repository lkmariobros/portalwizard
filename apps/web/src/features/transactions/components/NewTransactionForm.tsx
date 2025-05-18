"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FormApi, useForm } from "@tanstack/react-form";
import type { AnyFieldApi, AnyFormApi } from "@tanstack/react-form";
import React, { useState, useEffect, useMemo } from "react";
import { CalendarIcon, ChevronDown, ChevronsUpDown, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";


// Utility function to format currency values
const formatCurrency = (value: string | number) => {
	if (value === undefined || value === null || value === "") return "";
	const stringValue = typeof value === 'number' ? String(value) : value;
	const num = Number.parseFloat(stringValue.replace(/[^0-9.]/g, ""));
	return Number.isNaN(num)
		? ""
		: num.toLocaleString("en-US", {
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			});
};

// Helper function to parse currency string to number
const parseCurrency = (value: string) => {
	if (!value) return 0;
	const num = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
	return Number.isNaN(num) ? 0 : num;
};

// Agent tier definitions for commission calculation
type AgentTier = {
	name: string;
	overridingPercentage: number;
	leadershipBonus: number;
};

const agentTiers: Record<string, AgentTier> = {
	advisor: { 
		name: "Advisor", 
		overridingPercentage: 70, 
		leadershipBonus: 0
	},
	salesLeader: { 
		name: "Sales Leader", 
		overridingPercentage: 80, 
		leadershipBonus: 7 
	},
	teamLeader: { 
		name: "Team Leader", 
		overridingPercentage: 83, 
		leadershipBonus: 5 
	},
	groupLeader: { 
		name: "Group Leader", 
		overridingPercentage: 85, 
		leadershipBonus: 8 
	},
	supremeLeader: { 
		name: "Supreme Leader", 
		overridingPercentage: 85, 
		leadershipBonus: 6 
	},
};

interface TransactionFormValues {
	marketType: string;
	developerProject: string;
	secondaryType: string;
	transactionType: string;
	transactionDate: string;
	propertyName: string;
	propertyType: string;
	address: string;
	clientName: string;
	clientEmail: string;
	clientPhone: string;
	clientIdNumber: string;
	clientAcquisitionSource: string;
	paymentMethod: string;
	bankName: string;
	ownerName: string;
	coBrokingEnabled: boolean;
	coBrokingDirection: "seller" | "buyer";
	coBrokingAgentName: string;
	coBrokingAgentRen: string;
	coBrokingAgencyName: string;
	coBrokingAgentContact: string;
	totalPrice: string;
	annualRent: string;
	commissionValue: string;
	commissionType: string;
	commissionPercentage: string;
	documents: File[];
	notes: string;
}

function FormField({
	label,
	field,
	type = "text",
	...props
}: {
	label: string;
	field: AnyFieldApi;
	type?: string;
	[key: string]: any;
}) {
	return (
		<div className="mb-4">
			<label className="mb-1 block font-medium" htmlFor={field.name}>
				{label}
			</label>
			<Input
				id={field.name}
				type={type}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				aria-invalid={field.state.meta.isTouched && !!field.state.meta.errors}
				{...props}
			/>
			{field.state.meta.isTouched && field.state.meta.errors && (
				<span className="text-red-600 text-sm">{field.state.meta.errors}</span>
			)}
		</div>
	);
}

const STEPS = [
	"Transaction Type",
	"Property Details",
	"Client Information",
	"Co-Broking",
	"Commission",
	"Documents",
	"Review & Submit",
];

interface NewTransactionFormProps {
	onComplete?: () => void;
	agentTierKey?: keyof typeof agentTiers;
}

export function NewTransactionForm({ onComplete, agentTierKey = 'advisor' }: NewTransactionFormProps) {
	const [step, setStep] = useState(0);
	const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

	const [developerProjectSearch, setDeveloperProjectSearch] =
		React.useState("");
	const [isProjectDropdownOpen, setIsProjectDropdownOpen] =
		React.useState(false);
	// State for property type suggestions dropdown
	const [showPropertyTypeSuggestions, setShowPropertyTypeSuggestions] =
		React.useState(false);
	const [propertyTypeInputValue, setPropertyTypeInputValue] = React.useState("");
	// Local state for co-broking to ensure immediate UI updates
	const [localCoBrokingEnabled, setLocalCoBrokingEnabled] =
		React.useState(false);
	const [localCoBrokingDirection, setLocalCoBrokingDirection] = React.useState<
		"seller" | "buyer"
	>("seller");


	// Get today's date in YYYY-MM-DD format for default transaction date
	const today = new Date().toISOString().slice(0, 10);

	const form = useForm({
		defaultValues: {
			marketType: "Primary",
			developerProject: "",
			secondaryType: "",
			transactionType: "", // Default to empty, user must select
			transactionDate: today,
			propertyName: "",
			propertyType: "",
			address: "",
			clientName: "",
			clientEmail: "",
			clientPhone: "",
			clientIdNumber: "",
			clientAcquisitionSource: "",
			paymentMethod: "",
			bankName: "",
			ownerName: "",
			coBrokingEnabled: false,
			coBrokingDirection: "seller",
			coBrokingAgentName: "",
			coBrokingAgentRen: "",
			coBrokingAgencyName: "",
			coBrokingAgentContact: "",
			totalPrice: "",
			annualRent: "",
			commissionValue: "",
			commissionType: "", // Default to empty, user must select
			commissionPercentage: "",
			documents: [],
			notes: "",
		},
		onSubmit: async ({ value }) => {
			// console.log("Form submitted:", value);
			if (onComplete) {
				onComplete();
			}
		},
	});

	React.useEffect(() => {
		// Sync local input state with form state for propertyType
		if (form.state.values.propertyType !== propertyTypeInputValue) {
			setPropertyTypeInputValue(form.state.values.propertyType || "");
		}
	}, [form.state.values.propertyType, propertyTypeInputValue, setPropertyTypeInputValue]);

	// Function to validate the current step before navigation
	const validateStep = (currentStep: number): boolean => {
		let isValid = true;
		const values = form.state.values;
		const newFormErrors: Record<string, boolean> = {};

		switch (currentStep) {
			case 0: // Transaction Type
				// Validate marketType
				if (!values.marketType) {
					newFormErrors.marketType = true;
					isValid = false;
				}

				// Validate dependencies and auto-set transactionType consistency
				if (values.marketType === "Primary") {
					if (!values.developerProject) {
						newFormErrors.developerProject = true;
						isValid = false;
					}
					// Ensure transactionType is correctly set to "Sale" for Primary
					if (values.transactionType !== "Sale") {
						newFormErrors.transactionType = true; // "Transaction type must be Sale for Primary market."
						isValid = false;
					}
				} else if (values.marketType === "Secondary") {
					if (!values.secondaryType) {
						newFormErrors.secondaryType = true;
						isValid = false;
					} else {
						// Ensure transactionType is correctly set based on secondaryType
						if (values.transactionType !== values.secondaryType) {
							newFormErrors.transactionType = true; // "Transaction type must match Secondary market type."
							isValid = false;
						}
					}
				} else if (values.marketType) {
					// This case implies marketType is selected, but neither Primary nor Secondary (should not happen with current UI)
					// Or it can be a fallback if transactionType is still not set for a selected marketType
					if (!values.transactionType) {
						newFormErrors.transactionType = true;
						isValid = false;
					}
				}
				// If marketType is not selected, other checks will catch it. If it is, the blocks above handle transactionType.
				break;
			case 1: // Property Details
				if (!values.transactionDate) {
					newFormErrors.transactionDate = true;
					isValid = false;
				}
				if (!values.propertyName) {
					newFormErrors.propertyName = true;
					isValid = false;
				}
				if (!values.propertyType) {
					newFormErrors.propertyType = true;
					isValid = false;
				}
				// Validate totalPrice only if it's a Sale or Resale/Subsale (Sale)
				if (
					(values.marketType === "Primary" || (values.marketType === "Secondary" && values.secondaryType === "Sale")) &&
					(!values.totalPrice || parseCurrency(values.totalPrice) <= 0)
				) {
					newFormErrors.totalPrice = true;
					isValid = false;
				}
        // Validate annualRent only if it's a Rental transaction
        if (
          values.transactionType === "Rental" &&
          (!values.annualRent || parseCurrency(values.annualRent) <= 0)
        ) {
          newFormErrors.annualRent = true;
          isValid = false;
        }
				break;
			case 2: // Client Information
				if (!values.clientName) {
					newFormErrors.clientName = true;
					isValid = false;
				}
				if (!values.clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.clientEmail)) {
					newFormErrors.clientEmail = true;
					isValid = false;
				}
				break;
			case 3: // Co-Broking
				if (values.coBrokingEnabled) {
					if (!values.coBrokingAgentName) {
						newFormErrors.coBrokingAgentName = true;
						isValid = false;
					}
				}
				break;
			case 4: // Commission
				if (!values.commissionType) {
					newFormErrors.commissionType = true;
					isValid = false;
				}
				if (values.commissionType === "Percentage" && (!values.commissionPercentage || parseFloat(values.commissionPercentage) <= 0 || parseFloat(values.commissionPercentage) > 100)) {
					newFormErrors.commissionPercentage = true;
					isValid = false;
				}
				if (values.commissionType === "Fixed Amount" && (!values.commissionValue || parseCurrency(values.commissionValue) <= 0)) {
					newFormErrors.commissionValue = true;
					isValid = false;
				}
				break;
		}
		setFormErrors(newFormErrors);
		return isValid;
	};

	// Reset dependent fields and search when marketType changes, reliably
	const prevMarketType = React.useRef(form.state.values.marketType);
	React.useEffect(() => {
		if (form.state.values.marketType !== prevMarketType.current) {
			// Reset fields that depend on marketType
			form.setFieldValue("developerProject", "");
			setDeveloperProjectSearch(""); // Also reset search text
			form.setFieldValue("secondaryType", "");

			if (form.state.values.marketType === "Primary") {
				form.setFieldValue("transactionType", "Sale");
			} else {
				// For "Secondary" or if marketType is cleared, transactionType is cleared initially
				form.setFieldValue("transactionType", "");
			}
			// Update ref for next comparison
			prevMarketType.current = form.state.values.marketType;
		}
	}, [form.state.values.marketType, form, setDeveloperProjectSearch]);

	const renderStep = () => {
		switch (step) {
			case 0: // Transaction Type
				return (
					<div>
						<h2 className="mb-4 font-semibold text-xl text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">
							Transaction Type
						</h2>
						<form.Field
							name="marketType"
							validators={{
								onChange: (value) =>
									!value ? "Please select a market type." : undefined,
							}}
						>
							{(field) => (
								<div className="mb-4">
									<label
										id="market-type-label"
										className="mb-2 block font-medium"
									>
										Market Type <span className="text-red-500">*</span>
									</label>
									<ToggleGroup
										type="single"
										value={field.state.value}
										onValueChange={(val) => {
											if (val) {
												field.handleChange(val);
												// Clear any previous errors for this field
												setFormErrors((prev) => ({
													...prev,
													marketType: false,
												}));
											}
										}}
										className="flex flex-row gap-2"
										aria-labelledby="market-type-label"
									>
										<ToggleGroupItem
											value="Primary"
											className={
												field.state.value === "Primary"
													? "rounded bg-[oklch(0.723_0.219_149.579)] dark:bg-[oklch(0.696_0.17_162.48)] px-4 py-2 font-semibold text-[oklch(0.982_0.018_155.826)] dark:text-[oklch(0.266_0.065_152.934)] shadow focus:outline-none focus:ring-2 focus:ring-[oklch(0.723_0.219_149.579)]/70 dark:focus:ring-[oklch(0.696_0.17_162.48)]/70"
													: "rounded bg-[oklch(0.967_0.001_286.375)] dark:bg-[oklch(0.21_0.006_285.885)] px-4 py-2 text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:bg-[oklch(0.967_0.001_286.375)]/70 dark:hover:bg-[oklch(0.274_0.006_286.033)]/30 focus:outline-none focus:ring-2 focus:ring-[oklch(0.723_0.219_149.579)]/70 dark:focus:ring-[oklch(0.696_0.17_162.48)]/70"
											}
											aria-pressed={field.state.value === "Primary"}
										>
											Primary
										</ToggleGroupItem>
										<ToggleGroupItem
											value="Secondary"
											className={
												field.state.value === "Secondary"
													? "rounded bg-[oklch(0.723_0.219_149.579)] dark:bg-[oklch(0.696_0.17_162.48)] px-4 py-2 font-semibold text-[oklch(0.982_0.018_155.826)] dark:text-[oklch(0.266_0.065_152.934)] shadow focus:outline-none focus:ring-2 focus:ring-[oklch(0.723_0.219_149.579)]/70 dark:focus:ring-[oklch(0.696_0.17_162.48)]/70"
													: "rounded bg-[oklch(0.967_0.001_286.375)] dark:bg-[oklch(0.21_0.006_285.885)] px-4 py-2 text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:bg-[oklch(0.967_0.001_286.375)]/70 dark:hover:bg-[oklch(0.274_0.006_286.033)]/30 focus:outline-none focus:ring-2 focus:ring-[oklch(0.723_0.219_149.579)]/70 dark:focus:ring-[oklch(0.696_0.17_162.48)]/70"
											}
											aria-pressed={field.state.value === "Secondary"}
										>
											Secondary
										</ToggleGroupItem>
									</ToggleGroup>
									{((field.state.meta.isTouched && field.state.meta.errors) ||
										formErrors.marketType) && (
										<span className="mt-2 block text-red-600 text-sm">
											{formErrors.marketType
												? "Please select a market type."
												: Array.isArray(field.state.meta.errors)
													? field.state.meta.errors[0]
													: field.state.meta.errors}
										</span>
									)}
								</div>
							)}
						</form.Field>
						{form.state.values.marketType === "Primary" && (
							<form.Field
								name="developerProject"
								validators={{
									onChange: (value) =>
										!value ? "Please select a developer project." : undefined,
								}}
							>
								{(field) => {
									const projects = [
										{ name: "Sunrise Residences", location: "KL" },
										{ name: "Emerald Towers", location: "KL" },
										{ name: "Skyline Heights", location: "Penang" },
										{ name: "Bayfront Suites", location: "Penang" },
										...Array.from({ length: 30 }, (_, i) => ({
											name: `Project ${i + 1}`,
											location: i % 2 === 0 ? "KL" : "Penang",
										})),
									];
									const filtered = projects.filter((p) =>
										p.name
											.toLowerCase()
											.includes(developerProjectSearch.toLowerCase()),
									);
									const grouped = filtered.reduce(
										(acc, p) => {
											acc[p.location] = acc[p.location] || [];
											acc[p.location].push(p);
											return acc;
										},
										{} as Record<string, typeof projects>,
									);
									return (
										<div className="relative mb-4">
											<label className="mb-1 block font-medium">
												Developer Project <span className="text-red-500">*</span>
											</label>
											<label
												htmlFor="developer-project-search"
												className="sr-only"
											>
												Search projects
											</label>
											<input
												id="developer-project-search"
												className="mb-2 w-full rounded border px-2 py-1"
												placeholder="Search projects..."
												value={developerProjectSearch}
												onChange={(e) => {
													setDeveloperProjectSearch(e.target.value);
													// Open dropdown when user types
													setIsProjectDropdownOpen(true);
													// Clear selection if search text doesn't match selected
													if (field.state.value && !e.target.value) {
														field.handleChange("");
													}
												}}
												onFocus={() => {
													// Open dropdown when input is focused
													if (developerProjectSearch || filtered.length > 0) {
														setIsProjectDropdownOpen(true);
													}
												}}
												autoComplete="off"
												aria-label="Search developer projects"
												onBlur={(e) => {
													setTimeout(() => {
														if (!field.state.value && document.activeElement !== e.target && !document.querySelector('[role="listbox"]')?.contains(document.activeElement) ) {
															setDeveloperProjectSearch("");
														}
														setIsProjectDropdownOpen(false);
													}, 200);
												}}
											/>
											{isProjectDropdownOpen && (
												<div role="listbox" className="absolute z-20 max-h-60 w-full overflow-auto rounded border border-[var(--color-sidebar-primary)]/20 dark:border-[var(--color-sidebar-primary)]/30 dark:border-gray-600 bg-white dark:bg-[var(--color-sidebar)] shadow">
													{Object.keys(grouped).length > 0 ? Object.entries(grouped).map(([loc, projs]) => (
														<div key={loc}>
															<div className="px-2 pt-2 pb-1 font-semibold text-muted-foreground text-xs">
																{loc}
															</div>
															{projs.slice(0, 20).map((p) => (
																<div
																	key={p.name}
																	className={`cursor-pointer px-4 py-2 hover:bg-[var(--color-sidebar-accent)] dark:hover:bg-[var(--color-sidebar-accent)]/20 ${field.state.value === p.name ? "bg-[var(--color-sidebar-accent)]/50 dark:bg-[var(--color-sidebar-accent)]/30 font-semibold" : ""}`}
																	tabIndex={0}
																	role="option"
																	aria-selected={field.state.value === p.name}
																	onMouseDown={(e) => {
																		e.preventDefault();
																		field.handleChange(p.name);
																		setDeveloperProjectSearch(p.name);
																		setFormErrors((prev) => ({
																			...prev,
																			developerProject: false,
																		}));
																		setIsProjectDropdownOpen(false);
																	}}
																	onKeyDown={(e) => {
																		if (e.key === "Enter" || e.key === " ") {
																			field.handleChange(p.name);
																			setDeveloperProjectSearch(p.name);
																			setIsProjectDropdownOpen(false);
																		}
																	}}
																>
																	{p.name}
																</div>
															))}
														</div>
													)) : (
														<div className="p-2 text-muted-foreground text-sm">
															No projects found.
														</div>
													)}
												</div>
											)}
											{((field.state.meta.isTouched &&
												field.state.meta.errors) ||
												formErrors.developerProject) && (
												<span className="text-red-600 text-sm">
													{formErrors.developerProject
														? "Please select a developer project."
														: Array.isArray(field.state.meta.errors)
															? field.state.meta.errors[0]
															: field.state.meta.errors}
												</span>
											)}
										</div>
									);
								}}
							</form.Field>
						)}
						{form.state.values.marketType === "Secondary" && (
							<form.Field
								name="secondaryType"
								validators={{
									onChange: (value) =>
										!value
											? "Please select a secondary transaction type."
											: undefined,
								}}
							>
								{(field) => (
									<div className="mb-4">
										<label className="mb-1 block font-medium">
											Secondary Market Type <span className="text-red-500">*</span>
										</label>
										<ToggleGroup
											type="single"
											value={field.state.value}
											onValueChange={(val) => {
												if (val) {
													field.handleChange(val);
													if (form.state.values.marketType === "Secondary") {
														form.setFieldValue("transactionType", val);
													}
													setFormErrors((prev) => ({
														...prev,
														secondaryType: false,
														transactionType: false, // Also clear potential transaction type error
													}));
												}
											}}
											className="flex flex-row gap-2"
										>
											<ToggleGroupItem value="Sale" className="px-4 py-2">
												Sale
											</ToggleGroupItem>
											<ToggleGroupItem value="Rental" className="px-4 py-2">
												Rental
											</ToggleGroupItem>
										</ToggleGroup>
										{((field.state.meta.isTouched &&
											field.state.meta.errors) ||
											formErrors.secondaryType) && (
											<span className="mt-1 block text-red-600 text-sm">
												{formErrors.secondaryType
													? "Please select a secondary market type."
													: Array.isArray(field.state.meta.errors)
														? field.state.meta.errors[0]
														: field.state.meta.errors}
											</span>
										)}
									</div>
								)}
							</form.Field>
						)}
						{/* Transaction Type (Sale/Rental) - Now only for Primary Market */}
						{(form.state.values.marketType === "Primary") && (
							<form.Field
								name="transactionType"
								validators={{
									onChange: (value) => !value ? "Please select a transaction type." : undefined,
								}}
							>
								{(field) => (
									<div className="mb-4">
										<label className="mb-1 block font-medium">
											Transaction Type <span className="text-red-500">*</span>
										</label>
										<ToggleGroup
											type="single"
											value={field.state.value} // Should be "Sale" when marketType is "Primary"
											onValueChange={(val) => { // val should be "Sale"
												if (val) {
													field.handleChange(val);
													setFormErrors((prev) => ({ ...prev, transactionType: false }));
													// Reset price fields when type changes
													form.setFieldValue('totalPrice', '');
													form.setFieldValue('annualRent', '');
												}
											}}
											className="flex flex-row gap-2"
										>
											{/* Primary market is always Sale, so only show Sale option and it's auto-selected */}
											<ToggleGroupItem value="Sale" className="px-4 py-2">Sale</ToggleGroupItem>
										</ToggleGroup>
										{((field.state.meta.isTouched && field.state.meta.errors) || formErrors.transactionType) && (
											<span className="mt-1 block text-red-600 text-sm">
												{formErrors.transactionType
													? "Please select a transaction type."
													: Array.isArray(field.state.meta.errors)
														? field.state.meta.errors[0]
														: field.state.meta.errors}
											</span>
										)}
									</div>
								)}
							</form.Field>
						)}
					</div>
				);
			case 1: // Property Details
				return (
					<div>
						<h2 className="mb-4 font-semibold text-xl text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">
							Property Details
						</h2>
						<div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
							<form.Field
								name="transactionDate"
								validators={{
									onChange: ({ value }: { value: string }) =>
										!value ? "Transaction date is required." : undefined,
								}}
							>
								{(field: AnyFieldApi) => (
									<div className="mb-4">
										<label className="mb-1 block font-medium">
											Transaction Date <span className="text-red-500">*</span>
										</label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className={cn(
														"w-full justify-start text-left font-normal",
														!field.state.value && "text-muted-foreground",
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.state.value ? (
														new Date(field.state.value).toLocaleDateString()
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={
														field.state.value
															? new Date(field.state.value)
															: undefined
													}
													onSelect={(date) =>
														field.handleChange(
															date ? date.toISOString().slice(0, 10) : "",
														)
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										{field.state.meta.isTouched && field.state.meta.errors && (
											<span className="text-red-600 text-sm">
												{field.state.meta.errors}
											</span>
										)}
									</div>
								)}
							</form.Field>

							<form.Field
								name="propertyName"
								validators={{
									onChange: ({ value }: { value: string }) =>
										!value ? "Property name is required." : undefined,
								}}
							>
								{(fieldApiInstance) => (
									<FormField
										label="Property Name"
										field={fieldApiInstance}
										required
									/>
								)}
							</form.Field>
							<form.Field
								name="propertyType"
								validators={{
									onChange: (value: string) =>
										!value ? "Property type is required." : undefined,
								}}
							>
								{(field: AnyFieldApi) => {
									const propertyTypes = ["Condominium", "Apartment", "Terrace House", "Semi-D", "Bungalow", "Commercial Lot", "Office Space", "Industrial", "Land"];
									// const [inputValue, setInputValue] = useState(field.state.value || ""); // Removed local state
									const suggestions = propertyTypes.filter(type => type.toLowerCase().includes(propertyTypeInputValue.toLowerCase()));

									return (
										<div className="relative mb-4">
											<label className="mb-1 block font-medium">Property Type <span className="text-red-500">*</span></label>
											<Input
												type="text"
												value={propertyTypeInputValue}
												onChange={(e) => {
													setPropertyTypeInputValue(e.target.value);
													field.handleChange(e.target.value); // Update form state immediately
													setShowPropertyTypeSuggestions(true);
												}}
												onFocus={() => setShowPropertyTypeSuggestions(true)}
												onBlur={() => setTimeout(() => setShowPropertyTypeSuggestions(false), 150)} // Delay to allow click on suggestion
												placeholder="e.g., Condominium"
											/>
											{showPropertyTypeSuggestions && suggestions.length > 0 && propertyTypeInputValue && (
												<Card className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto">
													{suggestions.map(type => (
														<div
															key={type}
															className="p-2 hover:bg-accent cursor-pointer"
															onMouseDown={() => { // Use onMouseDown to beat onBlur
																setPropertyTypeInputValue(type);
																field.handleChange(type);
																setShowPropertyTypeSuggestions(false);
															}}
														>
															{type}
														</div>
													))}
												</Card>
											)}
											{field.state.meta.isTouched && field.state.meta.errors && (
												<span className="text-red-600 text-sm">{field.state.meta.errors}</span>
											)}
										</div>
									);
								}}
							</form.Field>
							<form.Field
								name="address"
							>
								{(fieldApiInstance) => (
									<FormField
										label="Address"
										field={fieldApiInstance}
									/>
								)}
							</form.Field>
						</div>

						{/* Conditional rendering for Total Price */}
						{(form.state.values.marketType === "Primary" || (form.state.values.marketType === "Secondary" && form.state.values.secondaryType === "Sale")) && (
							<form.Field
								name="totalPrice"
								validators={{
									onChange: (value: string) => {
										const parsedValue = parseCurrency(value);
										if (parsedValue <= 0) {
											return "Total price must be greater than 0.";
										}
										return undefined;
									},
								}}
							>
								{(field: AnyFieldApi) => {
									const fieldValue = String(field.state.value || "");
									return (
										<div className="mb-4">
											<label className="mb-1 block font-medium">
												Total Price (MYR) <span className="text-red-500">*</span>
											</label>
											<Input
												type="text"
												value={fieldValue}
												onBlur={field.handleBlur}
												onChange={(e) => {
													const rawValue = e.target.value;
													const formatted = formatCurrency(rawValue);
													field.handleChange(formatted); // Store formatted value
												}}
												placeholder="e.g., 1,200,000"
											/>
											{field.state.meta.isTouched && field.state.meta.errors && (
												<span className="text-red-600 text-sm">{field.state.meta.errors}</span>
											)}
										</div>
									);
								}}
							</form.Field>
						)}

						{/* Conditional rendering for Annual Rent */}
						{form.state.values.transactionType === "Rental" && (
							<form.Field
								name="annualRent"
								validators={{
									onChange: (value: string) => {
										const parsedValue = parseCurrency(value);
										if (form.state.values.transactionType === "Rental" && parsedValue <= 0) {
											return "Annual rent must be greater than 0 for rental transactions.";
										}
										return undefined;
									},
								}}
							>
								{(field: AnyFieldApi) => {
									const fieldValue = String(field.state.value || "");
									return (
										<div className="mb-4">
											<label className="mb-1 block font-medium">
												Annual Rent (MYR) <span className="text-red-500">*</span>
											</label>
											<Input
												type="text"
												value={fieldValue}
												onBlur={field.handleBlur}
												onChange={(e) => {
													const rawValue = e.target.value;
													const formatted = formatCurrency(rawValue);
													field.handleChange(formatted); // Store formatted value
												}}
												placeholder="e.g., 24,000"
											/>
											{field.state.meta.isTouched && field.state.meta.errors && (
												<span className="text-red-600 text-sm">{field.state.meta.errors}</span>
											)}
										</div>
									);
								}}
							</form.Field>
						)}
					</div>
				);
			case 2: // Client Information
				return (
					<div>
						<h2 className="mb-4 font-semibold text-xl text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">Client Information</h2>
						<div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
							<form.Field
								name="clientName"
								validators={{
									onChange: ({ value }: { value: string }) =>
										!value ? "Client Name is required." : undefined,
								}}
							>
								{(fieldApiInstance) => (
									<FormField
										label="Client Name"
										field={fieldApiInstance}
										required
									/>
								)}
							</form.Field>
							<form.Field
								name="clientEmail"
								validators={{
									onChange: ({ value }: { value: string }) => {
										if (!value) return "Client Email is required.";
										if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
											return "Invalid email address.";
										}
										return undefined;
									},
								}}
							>
								{(fieldApiInstance) => (
									<FormField
										label="Client Email"
										field={fieldApiInstance}
										type="email"
										required
									/>
								)}
							</form.Field>
							<form.Field
								name="clientPhone"
							>
								{(fieldApiInstance) => (
									<FormField
										label="Client Phone"
										field={fieldApiInstance}
										type="tel"
									/>
								)}
							</form.Field>
							<form.Field
								name="clientIdNumber"
							>
								{(fieldApiInstance) => (
									<FormField
										label="Client ID Number"
										field={fieldApiInstance}
									/>
								)}
							</form.Field>
							<form.Field name="clientAcquisitionSource">
								{(field) => (
									<div>
										<Label htmlFor={field.name} className="mb-1 block font-medium">Client Acquisition Source</Label>
										<Select onValueChange={field.handleChange} value={field.state.value}>
											<SelectTrigger id={field.name}>
												<SelectValue placeholder="Select source" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Referral">Referral</SelectItem>
												<SelectItem value="Online Ad">Online Ad</SelectItem>
												<SelectItem value="Walk-in">Walk-in</SelectItem>
												<SelectItem value="Existing Client">Existing Client</SelectItem>
												<SelectItem value="Social Media">Social Media</SelectItem>
												<SelectItem value="Property Portal">Property Portal</SelectItem>
												<SelectItem value="Other">Other</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
							</form.Field>
						</div>
					</div>
				);
			case 3: // Co-Broking
				return (
					<div>
						<h2 className="mb-4 font-semibold text-xl text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">Co-Broking Details</h2>
						<form.Field name="coBrokingEnabled">
							{(field) => (
								<div className="mb-4 flex items-center">
									<input
										type="checkbox"
										id="coBrokingEnabled"
										checked={localCoBrokingEnabled}
										onChange={(e) => {
											const checked = e.target.checked;
											setLocalCoBrokingEnabled(checked);
											field.handleChange(checked);
											if (!checked) {
												// Clear co-broking fields if disabled
												form.setFieldValue('coBrokingDirection', 'seller');
												form.setFieldValue('coBrokingAgentName', '');
												form.setFieldValue('coBrokingAgentRen', '');
												form.setFieldValue('coBrokingAgencyName', '');
												form.setFieldValue('coBrokingAgentContact', '');
											}
										}}
										className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<label htmlFor="coBrokingEnabled" className="ml-2 block text-sm font-medium">
										Enable Co-Broking
									</label>
								</div>
							)}
						</form.Field>

						{localCoBrokingEnabled && (
							<div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
								<form.Field name="coBrokingDirection">
									{(field) => (
										<div className="mb-4">
											<label className="mb-1 block font-medium">Co-Broking Direction</label>
											<ToggleGroup
												type="single"
												value={localCoBrokingDirection}
												onValueChange={(value: "seller" | "buyer") => {
													if (value) {
														setLocalCoBrokingDirection(value);
														field.handleChange(value);
													}
												}}
												className="flex flex-row gap-2"
											>
												<ToggleGroupItem value="seller">Representing Seller</ToggleGroupItem>
												<ToggleGroupItem value="buyer">Representing Buyer</ToggleGroupItem>
											</ToggleGroup>
										</div>
									)}
								</form.Field>
								<form.Field
									name="coBrokingAgentName"
									validators={{
										onChange: ({ value }: { value: string }) =>
											localCoBrokingEnabled && !value ? "Co-Broking Agent Name is required." : undefined,
									}}
								>
									{(fieldApiInstance) => (
										<FormField
											label="Co-Broking Agent Name"
											field={fieldApiInstance}
											required={localCoBrokingEnabled}
										/>
									)}
								</form.Field>
								<form.Field
									name="coBrokingAgentRen"
								>
									{(fieldApiInstance) => (
										<FormField
											label="Co-Broking Agent REN"
											field={fieldApiInstance}
										/>
									)}
								</form.Field>
								<form.Field
									name="coBrokingAgencyName"
								>
									{(fieldApiInstance) => (
										<FormField
											label="Co-Broking Agency Name"
											field={fieldApiInstance}
										/>
									)}
								</form.Field>
								<form.Field
									name="coBrokingAgentContact"
								>
									{(fieldApiInstance) => (
										<FormField
											label="Co-Broking Agent Contact"
											field={fieldApiInstance}
										/>
									)}
								</form.Field>
							</div>
						)}
					</div>
				);
			case 4: { // Commission Details
        const { commissionType, totalPrice, annualRent, transactionType, commissionPercentage: currentCommissionPercentage, commissionValue: currentCommissionValue } = form.state.values;
        const isSaleTransaction = transactionType === "Sale" || (transactionType === "Resale/Subsale" && form.state.values.secondaryType === "Sale");
        const basePriceForCommission = isSaleTransaction ? parseCurrency(totalPrice) : parseCurrency(annualRent);

        const defaultCommissionPercent = isSaleTransaction ? 3 : 100; // 100% for rental means 1 month rent

        const currentAgentTier = agentTiers[agentTierKey] ?? agentTiers["advisor"];
        let calculatedCommissionValue = 0;

        if (commissionType === 'Percentage') {
            const percentage = parseFloat(currentCommissionPercentage || "0");
            if (!Number.isNaN(percentage) && basePriceForCommission > 0) {
                 calculatedCommissionValue = (basePriceForCommission * percentage) / 100;
            }
        } else if (commissionType === 'Fixed Amount') {
            calculatedCommissionValue = parseCurrency(currentCommissionValue || "0");
        }

        const baseCommission = (calculatedCommissionValue * currentAgentTier.overridingPercentage) / 100;
        const leadershipBonus = (calculatedCommissionValue * currentAgentTier.leadershipBonus) / 100;
        const totalAgentCommission = baseCommission + leadershipBonus;
        const agencyShare = Math.max(
   0,
   calculatedCommissionValue - totalAgentCommission
 );
        const isCommissionOverage = totalAgentCommission > agencyShare && calculatedCommissionValue > 0;


        return (
            <div>
                <h2 className="mb-4 font-semibold text-xl text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">Commission Details</h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                    <div className="space-y-4">
                        <form.Field
                            name="commissionType"
                            validators={{
                                onChange: (value) => !value ? "Please select a commission type." : undefined,
                            }}
                        >
                            {(field) => (
                                <div>
                                    <label className="mb-1 block font-medium">Commission Type <span className="text-red-500">*</span></label>
                                    <ToggleGroup
                                        type="single"
                                        value={field.state.value}
                                        onValueChange={(value: string) => {
                                            if (value) {
                                                field.handleChange(value);
                                                form.setFieldValue('commissionPercentage', '');
                                                form.setFieldValue('commissionValue', '');
                                            }
                                        }}
                                        className="flex flex-row gap-2"
                                    >
                                        <ToggleGroupItem value="Percentage" aria-label="Percentage Commission" className="px-4 py-2">Percentage</ToggleGroupItem>
                                        <ToggleGroupItem value="Fixed Amount" aria-label="Fixed Amount Commission" className="px-4 py-2">Fixed Amount</ToggleGroupItem>
                                    </ToggleGroup>
                                    {field.state.meta.isTouched && field.state.meta.errors && (
                                        <span className="mt-1 block text-red-600 text-sm">{field.state.meta.errors}</span>
                                    )}
                                </div>
                            )}
                        </form.Field>

                        {form.state.values.commissionType === 'Percentage' && (
                            <form.Field
                                name="commissionPercentage"
                                validators={{
                                    onChange: (value: string) => {
                                        if (form.state.values.commissionType === 'Percentage' && !value) {
                                            return "Commission percentage is required.";
                                        }
                                        const percentage = parseFloat(value);
                                        if (Number.isNaN(percentage) || percentage <= 0 || percentage > 100) {
                                            return "Must be between 0.01 and 100.";
                                        }
                                        return undefined;
                                    },
                                }}
                            >
                                {(field: AnyFieldApi) => (
                                    <div>
                                        <label className="mb-1 block font-medium" htmlFor={field.name}>
                                            Commission Percentage (%) <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            id={field.name}
                                            type="text"
                                            value={field.state.value || ""}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => {
                                                const rawValue = e.target.value;
                                                let cleanedValue = rawValue.replace(/[^0-9.]/g, '');
                                                const parts = cleanedValue.split('.');
                                                if (parts.length > 2) {
                                                    cleanedValue = `${parts[0]}.${parts.slice(1).join('')}`;
                                                }
                                                field.handleChange(cleanedValue);
                                            }}
                                            placeholder="e.g., 3 for 3%"
                                        />
                                        {field.state.meta.isTouched && field.state.meta.errors && (
                                            <span className="mt-1 block text-red-600 text-sm">{field.state.meta.errors}</span>
                                        )}
                                        <p className="mt-1 text-[oklch(0.552_0.016_285.938)] dark:text-[oklch(0.705_0.015_286.067)] text-sm">
                                            {isSaleTransaction
                                                ? `Suggested: ${defaultCommissionPercent}% of property price`
                                                : `Suggested: ${defaultCommissionPercent}% of annual rent (i.e. 1 month rent)`}
                                        </p>
                                    </div>
                                )}
                            </form.Field>
                        )}

                        {form.state.values.commissionType === 'Fixed Amount' && (
                            <form.Field
                                name="commissionValue"
                                validators={{
                                    onChange: (value: string) => {
                                        if (form.state.values.commissionType === 'Fixed Amount' && !value) {
                                            return "Commission value is required.";
                                        }
                                        const parsedValue = parseCurrency(value);
                                        if (parsedValue <= 0) {
                                            return "Commission value must be greater than 0.";
                                        }
                                        return undefined;
                                    },
                                }}
                            >
                                {(field: AnyFieldApi) => {
                                    const fieldValue = String(field.state.value || "");
                                    return (
                                        <div>
                                            <label className="mb-1 block font-medium" htmlFor={field.name}>
                                                Commission Value (MYR) <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                id={field.name}
                                                type="text"
                                                value={fieldValue} // Display raw or formatted value
                                                onBlur={field.handleBlur}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value;
                                                    const formatted = formatCurrency(rawValue); // Format for storage
                                                    field.handleChange(formatted);
                                                }}
                                                placeholder="e.g., 10,000"
                                            />
                                            {field.state.meta.isTouched && field.state.meta.errors && (
                                                <span className="mt-1 block text-red-600 text-sm">{field.state.meta.errors}</span>
                                            )}
                                        </div>
                                    );
                                }}
                            </form.Field>
                        )}
                    </div>

                    <div className="bg-gray-50 dark:bg-[var(--color-sidebar-accent)]/10 p-4 rounded-lg border dark:border-[var(--color-sidebar-border)]">
                        <h4 className="font-semibold mb-3 text-lg">Commission Breakdown</h4>
                        <div className="space-y-2 text-sm">
                            <p>Agent Tier: <span className="font-semibold">{currentAgentTier.name}</span></p>
                            <hr className="my-2 border-gray-200 dark:border-gray-600"/>
                            <p>Total Potential Commission: <span className="font-semibold">{formatCurrency(calculatedCommissionValue)}</span></p>
                             <hr className="my-2 border-gray-200 dark:border-gray-600"/>
                            <p>Base ({currentAgentTier.overridingPercentage}%): <span className="font-semibold">{formatCurrency(baseCommission)}</span></p>
                            <p>Leadership Bonus ({currentAgentTier.leadershipBonus}%): <span className="font-semibold">{formatCurrency(leadershipBonus)}</span></p>
                            <hr className="my-2 border-gray-200 dark:border-gray-600"/>
                            <p className="text-base">Total Agent Payout: <span className="font-bold text-green-600 dark:text-green-500">{formatCurrency(totalAgentCommission)}</span></p>
                            <p>Agency Share: <span className="font-semibold">{formatCurrency(agencyShare)}</span></p>
                            {isCommissionOverage && (
                                <p className="mt-2 text-sm text-red-500 font-semibold">
                                    Warning: Agent payout exceeds potential commission.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
			case 5:
				return (
					<div>
						<h2 className="mb-4 font-semibold text-xl text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">Documents</h2>
						<div className="mb-4">
							<label className="mb-1 block font-medium">
								Upload Documents (not yet implemented)
							</label>
							<Input type="file" multiple disabled />
							<p className="text-muted-foreground text-sm">
								Document upload coming soon.
							</p>
						</div>
					</div>
				);
			case 6:
				return (
					<div>
						<h2 className="mb-4 font-semibold text-xl text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">Review & Submit</h2>
						<h3 className="mb-2 font-semibold">Form Data:</h3>
						<Card className="p-4 bg-gray-50 dark:bg-gray-800 max-h-96 overflow-y-auto">
							<pre className="text-xs whitespace-pre-wrap break-all">
								{JSON.stringify(form.state.values, null, 2)}
							</pre>
						</Card>
						<form.Field name="notes">
							{(field: AnyFieldApi) => (
								<div className="mt-4">
									<FormField label="Notes / Remarks" field={field} />
								</div>
							)}
						</form.Field>
					</div>
				);
			default:
				return null;
		}
	}

	return (
		<div className="flex flex-col h-full overflow-hidden bg-[oklch(0.967_0.001_286.375)] dark:bg-[oklch(0.21_0.006_285.885)] w-full">
			{/* Horizontal step indicator */}
			<div className="bg-white dark:bg-[oklch(0.21_0.006_285.885)] shadow-sm px-6 py-3 border-b border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(1_0_0_/_10%)]">
				{/* Step indicators with connector lines */}
				<div className="relative mx-auto px-8 max-w-3xl">
					{/* Connector lines rendered first (below the circles) */}
					<div className="absolute top-5 left-0 right-0 h-0.5 mx-5">
						{/* Single background line with individual colored segments positioned absolutely */}
						<div className="w-full h-full bg-[var(--color-muted)] dark:bg-[var(--color-sidebar-accent)]"></div>
						{STEPS.map((_, index) => {
							if (index === STEPS.length - 1) return null; // No connector after last item
							const isCompleted = index < step;
							if (!isCompleted) return null; // Only render completed segments
							
							const segmentWidth = `${100 / (STEPS.length - 1)}%`;
							const leftPosition = `${(index / (STEPS.length - 1)) * 100}%`;
							
							return (
								<div 
									key={`connector-${index}`}
									className="absolute h-full bg-blue-600 dark:bg-blue-600 transition-all duration-300"
									style={{
										left: leftPosition,
										width: segmentWidth
									}}
								/>
							);
						})}
					</div>
					
					{/* Step circles and labels */}
					<div className="flex justify-between relative z-10">
						{STEPS.map((stepName, index) => {
							const isActive = index === step;
							const isCompleted = index < step;
							return (
								<div key={index} className="flex flex-col items-center">
									<div 
										className={`flex items-center justify-center rounded-full w-10 h-10 bg-white text-sm font-medium 
										${isActive ? 'bg-blue-600 text-white border-2 border-blue-600 shadow-md' : 
											isCompleted ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-600' : 
											'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-700'}`}
									>
										{isCompleted ? '✓' : index + 1}
									</div>
									<div className="mt-2 text-xs text-center max-w-[80px] truncate">
										{stepName}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Form content area with fixed height and scrollable */}
			<div className="flex-1 overflow-hidden flex flex-col w-full">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
					noValidate
					className="flex-1 flex flex-col h-full"
				>
					{/* Scrollable content area */}
					<div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[oklch(0.141_0.005_285.823)]">
						{renderStep()}
					</div>

					{/* Fixed navigation footer */}
					<div className="border-t border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(1_0_0_/_10%)] bg-white dark:bg-[oklch(0.21_0.006_285.885)] p-4 flex justify-between items-center">
						<div>
							{step > 0 && (
								<Button
									type="button"
									variant="outline"
									onClick={() => setStep((s) => s - 1)}
								>
									Back
								</Button>
							)}
						</div>
						<div className="flex space-x-3">
							{step < STEPS.length - 1 ? (
								<Button
									type="button"
									onClick={() => {
										if (validateStep(step)) {
											setStep((s) => s + 1);
										}
									}}
								>
									Next
								</Button>
							) : (
								<Button type="submit" variant="default">
									Submit Transaction
								</Button>
							)}
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}