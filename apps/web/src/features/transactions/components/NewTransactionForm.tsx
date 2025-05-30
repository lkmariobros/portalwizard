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
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { FormApi, useForm } from "@tanstack/react-form";
import type { AnyFieldApi, AnyFormApi } from "@tanstack/react-form";
import React, { useState } from "react";

// Utility function to format currency values
const formatCurrency = (value: string) => {
	if (!value) return "";
	const num = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
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

export function NewTransactionForm() {
	const [step, setStep] = useState(0);
	const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

	const [developerProjectSearch, setDeveloperProjectSearch] =
		React.useState("");
	const [isProjectDropdownOpen, setIsProjectDropdownOpen] =
		React.useState(false);
	// State for property type suggestions dropdown
	const [showPropertyTypeSuggestions, setShowPropertyTypeSuggestions] =
		React.useState(false);
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
			transactionType: "",
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
			commissionType: "",
			commissionPercentage: "",
			documents: [],
			notes: "",
		},
		onSubmit: async ({ value }) => {
			alert("Submitted! Check console for data.");
			console.log("Transaction Data:", value);
		},
	});

	// Reset dependent fields and search when marketType changes, reliably
	const prevMarketType = React.useRef(form.state.values.marketType);
	React.useEffect(() => {
		if (form.state.values.marketType !== prevMarketType.current) {
			setDeveloperProjectSearch("");
			if (form.state.values.marketType === "Primary") {
				// Reset all Secondary-only fields
				form.setFieldValue("secondaryType", "");
			} else if (form.state.values.marketType === "Secondary") {
				// Reset all Primary-only fields
				form.setFieldValue("developerProject", "");
			}
			// Optionally reset other fields that depend on marketType here
			prevMarketType.current = form.state.values.marketType;
		}
	}, [form.state.values.marketType]);

	// Synchronize local co-broking state with form state
	React.useEffect(() => {
		if (form.state.values.coBrokingEnabled !== undefined) {
			setLocalCoBrokingEnabled(form.state.values.coBrokingEnabled);
		}
		if (
			form.state.values.coBrokingDirection === "seller" ||
			form.state.values.coBrokingDirection === "buyer"
		) {
			setLocalCoBrokingDirection(form.state.values.coBrokingDirection);
		}
	}, [
		form.state.values.coBrokingEnabled,
		form.state.values.coBrokingDirection,
	]);

	// Step content renderers
	// Local UI state for toggling secondary client fields
	const [showClientSecondaryFields, setShowClientSecondaryFields] =
		useState(false);

	function renderStep() {
		switch (step) {
			case 0:
				return (
					<>
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
										className="mb-1 block font-medium"
										id="market-type-label"
									>
										Market Type
									</label>
									<ToggleGroup
										type="single"
										value={field.state.value || ""}
										onValueChange={(val) => {
											if (val === "Primary" || val === "Secondary") {
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
													? "rounded bg-blue-600 px-4 py-2 font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
													: "rounded bg-muted px-4 py-2 text-foreground hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
											}
											aria-pressed={field.state.value === "Primary"}
										>
											Primary
										</ToggleGroupItem>
										<ToggleGroupItem
											value="Secondary"
											className={
												field.state.value === "Secondary"
													? "rounded bg-blue-600 px-4 py-2 font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
													: "rounded bg-muted px-4 py-2 text-foreground hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
												Developer Project
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
													if (developerProjectSearch) {
														setIsProjectDropdownOpen(true);
													}
												}}
												autoComplete="off"
												aria-label="Search developer projects"
												onBlur={(e) => {
													// Only close dropdown if click was outside the dropdown
													// This prevents immediate closing when clicking inside the dropdown
													setTimeout(() => {
														// If user leaves input and hasn't selected, clear search
														if (!field.state.value)
															setDeveloperProjectSearch("");
														// Close dropdown after a short delay to allow click events to process
														setIsProjectDropdownOpen(false);
													}, 200);
												}}
											/>
											{/* Auto-suggest dropdown */}
											{developerProjectSearch &&
												filtered.length > 0 &&
												isProjectDropdownOpen && (
													<div className="absolute z-20 max-h-60 w-full overflow-auto rounded border bg-card shadow">
														{Object.entries(grouped).map(([loc, projs]) => (
															<div key={loc}>
																<div className="px-2 pt-2 pb-1 font-semibold text-muted-foreground text-xs">
																	{loc}
																</div>
																{projs.slice(0, 20).map((p) => (
																	<div
																		key={p.name}
																		className={`cursor-pointer px-4 py-2 hover:bg-blue-100 ${field.state.value === p.name ? "bg-blue-50 font-semibold" : ""}`}
																		tabIndex={0}
																		role="option"
																		aria-selected={field.state.value === p.name}
																		onMouseDown={(e) => {
																			e.preventDefault();
																			field.handleChange(p.name);
																			setDeveloperProjectSearch(p.name);
																			// Clear any previous errors for this field
																			setFormErrors((prev) => ({
																				...prev,
																				developerProject: false,
																			}));
																			// Close dropdown after selection
																			setIsProjectDropdownOpen(false);
																		}}
																		onKeyDown={(e) => {
																			if (e.key === "Enter" || e.key === " ") {
																				field.handleChange(p.name);
																				setDeveloperProjectSearch(p.name);
																				// Close dropdown after selection
																				setIsProjectDropdownOpen(false);
																			}
																		}}
																	>
																		{p.name}
																	</div>
																))}
															</div>
														))}
													</div>
												)}
											{developerProjectSearch &&
												filtered.length === 0 &&
												isProjectDropdownOpen && (
													<div className="absolute z-20 w-full rounded border bg-card p-2 text-muted-foreground text-sm shadow">
														No projects found.
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
										<label
											htmlFor="secondaryTransactionType"
											className="mb-1 block font-medium"
										>
											Secondary Transaction Type
										</label>
										<ToggleGroup
											id="secondaryTransactionType"
											type="single"
											value={field.state.value}
											onValueChange={(val: string) => {
												if (val) {
													field.handleChange(val);
													// Clear any previous errors for this field
													setFormErrors((prev) => ({
														...prev,
														secondaryType: false,
													}));
												}
											}}
											className="gap-2"
										>
											<ToggleGroupItem
												value="Sale"
												className={
													field.state.value === "Sale"
														? "rounded bg-blue-600 px-4 py-2 font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
														: "rounded bg-muted px-4 py-2 text-foreground hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
												}
												aria-pressed={field.state.value === "Sale"}
											>
												Sale
											</ToggleGroupItem>
											<ToggleGroupItem
												value="Rental"
												className={
													field.state.value === "Rental"
														? "rounded bg-blue-600 px-4 py-2 font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
														: "rounded bg-muted px-4 py-2 text-foreground hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
												}
												aria-pressed={field.state.value === "Rental"}
											>
												Rental
											</ToggleGroupItem>
										</ToggleGroup>
										{((field.state.meta.isTouched && field.state.meta.errors) ||
											formErrors.secondaryType) && (
											<span className="text-red-600 text-sm">
												{formErrors.secondaryType
													? "Please select a secondary transaction type."
													: Array.isArray(field.state.meta.errors)
														? field.state.meta.errors[0]
														: field.state.meta.errors}
											</span>
										)}
									</div>
								)}
							</form.Field>
						)}
						<form.Field
							name="transactionDate"
							validators={{
								onChange: (value) =>
									!value ? "Please select a transaction date." : undefined,
							}}
						>
							{(field) => (
								<div className="mb-4">
									<label
										className="mb-1 block font-medium"
										htmlFor="transactionDate-picker"
									>
										Transaction Date
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!field.state.value && "text-muted-foreground",
												)}
												id="transactionDate-picker"
												aria-label="Select transaction date"
											>
												{field.state.value
													? new Date(field.state.value).toLocaleDateString()
													: "Pick a date"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={
													field.state.value
														? new Date(field.state.value)
														: new Date()
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
											{Array.isArray(field.state.meta.errors)
												? field.state.meta.errors[0]
												: field.state.meta.errors}
										</span>
									)}
								</div>
							)}
						</form.Field>
					</>
				);
			case 1:
				return (
					<>
						{/* Transaction Price/Rent based on market and transaction type */}
						{form.state.values.marketType === "Primary" ||
						(form.state.values.marketType === "Secondary" &&
							form.state.values.transactionType === "Sale") ? (
							<form.Field
								name="totalPrice"
								validators={{
									onChange: (input: string | { value: string }) => {
										const value =
											typeof input === "string"
												? input
												: input && typeof input.value === "string"
													? input.value
													: "";
										if (!value || value === "0")
											return "This field is required";
										const numValue = Number(value);
										if (Number.isNaN(numValue) || numValue <= 0)
											return "Price must be greater than 0";
										return undefined;
									},
								}}
							>
								{(field: AnyFieldApi) => {
									const fieldValue = String(field.state.value || "");
									return (
										<div className="mb-6 space-y-2">
											<label
												className="block font-medium text-gray-700 text-sm"
												htmlFor="primary-price"
											>
												{form.state.values.marketType === "Primary"
													? "Transaction Price"
													: "Total Price"}{" "}
												<span className="text-red-500">*</span>
											</label>
											<div className="relative rounded-md shadow-sm">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" />
												<input
													id="primary-price"
													type="number"
													className="block w-full rounded-md border border-gray-300 p-2 pr-12 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
													placeholder="Enter price"
													value={fieldValue}
													onChange={(e) => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
												/>
												<span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 sm:text-sm">
													MYR
												</span>
											</div>
											{field.state.meta.isTouched &&
												field.state.meta.errors && (
													<span className="text-red-600 text-sm">
														{Array.isArray(field.state.meta.errors)
															? field.state.meta.errors[0]
															: field.state.meta.errors}
													</span>
												)}
										</div>
									);
								}}
							</form.Field>
						) : (
							<form.Field
								name="annualRent"
								validators={{
									onChange: (input: string | { value: string }) => {
										const value =
											typeof input === "string"
												? input
												: input && typeof input.value === "string"
													? input.value
													: "";
										if (!value || value === "0")
											return "This field is required";
										const numValue = Number(value);
										if (Number.isNaN(numValue) || numValue <= 0)
											return "Rent must be greater than 0";
										return undefined;
									},
								}}
							>
								{(field: AnyFieldApi) => {
									const fieldValue = String(field.state.value || "");
									return (
										<div className="mb-6 space-y-2">
											<label
												className="block font-medium text-gray-700 text-sm"
												htmlFor="secondary-rent"
											>
												Annual Rent <span className="text-red-500">*</span>
											</label>
											<div className="relative rounded-md shadow-sm">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
													<span className="text-gray-500 sm:text-sm">MYR</span>
												</div>
												<input
													id="secondary-annual-rent"
													type="text"
													className="block w-full rounded-md border border-gray-300 p-2 pr-12 pl-14 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
													placeholder="0"
													value={formatCurrency(fieldValue)}
													onChange={(e) => {
														const rawValue = e.target.value.replace(
															/[^0-9]/g,
															"",
														);
														field.handleChange(rawValue);
													}}
													onBlur={field.handleBlur}
													aria-invalid={
														field.state.meta.isTouched &&
														!!field.state.meta.errors
													}
												/>
											</div>
											{field.state.meta.isTouched &&
												field.state.meta.errors && (
													<p className="mt-1 text-red-600 text-sm">
														{Array.isArray(field.state.meta.errors)
															? field.state.meta.errors[0]
															: field.state.meta.errors}
													</p>
												)}
											<p className="mt-1 text-gray-500 text-sm">
												Total annual rent for this rental property
											</p>
										</div>
									);
								}}
							</form.Field>
						)}
					</>
				);
			case 2:
				return (
					<>
						{/* Property Details */}
						<div className="mb-4 border-gray-200 border-b pb-4">
							<h3 className="mb-3 font-medium text-lg">Property Details</h3>

							<form.Field name="propertyName">
								{(field: AnyFieldApi) => (
									<FormField label="Property Name/Address" field={field} />
								)}
							</form.Field>

							<form.Field name="propertyType">
								{(field: AnyFieldApi) => {
									// Static suggestions for demonstration; in production, fetch from backend or state
									const suggestions = [
										"Bungalow",
										"Semi-D",
										"Condo",
										"Double Storey Terrace",
										"Apartment",
										"Townhouse",
										"Serviced Residence",
									];
									const inputValue = field.state.value?.toLowerCase() || "";
									const filteredSuggestions = suggestions.filter(
										(s) => s.toLowerCase().includes(inputValue) && inputValue,
									);
									return (
										<div className="relative mb-4">
											<label
												className="mb-1 block font-medium"
												htmlFor="property-type-field"
											>
												Property Type
												<span className="ml-2 cursor-pointer">
													<span
														title="Recommended: e.g. Bungalow, Semi-D, Condo, Double Storey Terrace"
														className="text-gray-400"
													>
														&#9432;
													</span>
												</span>
											</label>
											<input
												id="property-type-field"
												type="text"
												autoComplete="off"
												className="block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
												placeholder="e.g. Bungalow, Semi-D, Condo, Double Storey Terrace"
												value={field.state.value}
												onChange={(e) => {
													field.handleChange(e.target.value);
													setShowPropertyTypeSuggestions(true);
												}}
												onFocus={() => setShowPropertyTypeSuggestions(true)}
												onBlur={() => {
													// Delay hiding suggestions to allow click to register
													setTimeout(
														() => setShowPropertyTypeSuggestions(false),
														200,
													);
													field.handleBlur();
												}}
											/>
											{/* Auto-suggestion dropdown */}
											{filteredSuggestions.length > 0 &&
												showPropertyTypeSuggestions && (
													<div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
														{filteredSuggestions.map((s: string) => (
															<div
																key={s}
																className="cursor-pointer px-3 py-2 hover:bg-blue-100"
																onMouseDown={() => {
																	field.handleChange(s);
																	setShowPropertyTypeSuggestions(false);
																}}
															>
																{s}
															</div>
														))}
													</div>
												)}
										</div>
									);
								}}
							</form.Field>
						</div>

						{/* Client Information - Primary Fields (Always Visible) */}
						<div className="mb-4 border-gray-200 border-b pb-4">
							<h3 className="mb-3 font-medium text-lg">Client Information</h3>

							<form.Field
								name="clientName"
								validators={{
									onChange: (value: string) =>
										!value ? "Client name is required" : undefined,
								}}
							>
								{(field: AnyFieldApi) => (
									<FormField label="Client Name" field={field} />
								)}
							</form.Field>

							<form.Field
								name="clientPhone"
								validators={{
									onChange: (value: string) => {
										if (!value) return "Client phone number is required";
										if (!/^\+?[0-9]{8,15}$/.test(value.replace(/[\s-]/g, ""))) {
											return "Please enter a valid phone number";
										}
										return undefined;
									},
								}}
							>
								{(field: AnyFieldApi) => (
									<FormField label="Client Phone Number" field={field} />
								)}
							</form.Field>

							<form.Field
								name="clientEmail"
								validators={{
									onChange: (value: string) => {
										if (!value) return "Client email is required";
										if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
											return "Please enter a valid email address";
										}
										return undefined;
									},
								}}
							>
								{(field: AnyFieldApi) => (
									<FormField label="Client Email" field={field} type="email" />
								)}
							</form.Field>

							{/* Toggle for secondary fields */}
							<div className="mb-4">
								<label className="flex cursor-pointer items-center gap-2">
									<input
										type="checkbox"
										checked={showClientSecondaryFields}
										onChange={(e) =>
											setShowClientSecondaryFields(e.target.checked)
										}
										className="accent-blue-500"
									/>
									<span className="text-sm">Show more client details</span>
								</label>
							</div>
							{showClientSecondaryFields && (
								<>
									<form.Field name="clientIdNumber">
										{(field: AnyFieldApi) => (
											<FormField label="Client ID Number" field={field} />
										)}
									</form.Field>
									<form.Field name="clientAcquisitionSource">
										{(field: AnyFieldApi) => (
											<div className="mb-4">
												<label
													className="mb-1 block font-medium"
													htmlFor="client-acquisition-source"
												>
													Client Acquisition Source
												</label>
												<select
													id="client-acquisition-source"
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													className="block w-full rounded border p-2"
												>
													<option value="">Select Source</option>
													<option value="Social Media">Social Media</option>
													<option value="Referral">Referral</option>
													<option value="Direct Inquiry">Direct Inquiry</option>
													<option value="Other">Other</option>
												</select>
											</div>
										)}
									</form.Field>
								</>
							)}
						</div>
						{/* Payment Method Section */}
						<div className="mb-4 border-gray-200 border-b pb-4">
							<h3 className="mb-3 font-medium text-lg">Payment Details</h3>
							<form.Field name="paymentMethod">
								{(field: AnyFieldApi) => (
									<div className="mb-4">
										<label
											className="mb-1 block font-medium"
											htmlFor="payment-method"
										>
											Payment Method
										</label>
										<select
											id="payment-method"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											className="block w-full rounded border p-2"
										>
											<option value="">Select Payment Method</option>
											<option value="Bank Financing">Bank Financing</option>
											<option value="Full Cash">Full Cash</option>
										</select>
									</div>
								)}
							</form.Field>
							{form.state.values.paymentMethod === "Bank Financing" && (
								<form.Field name="bankName">
									{(field: AnyFieldApi) => (
										<FormField label="Bank Name" field={field} />
									)}
								</form.Field>
							)}
						</div>
					</>
				);
			case 3:
				return (
					<>
						<div className="mb-4 border-gray-200 border-b pb-4">
							<h3 className="mb-3 font-medium text-lg">Property Ownership</h3>
							<form.Field
								name="ownerName"
								validators={{
									onChange: (v: string) =>
										!v ? "Owner Name is required" : undefined,
								}}
							>
								{(field: AnyFieldApi) => (
									<FormField label="Owner Name" field={field} />
								)}
							</form.Field>
						</div>

						<div className="mb-4 border-gray-200 border-b pb-4">
							<h3 className="mb-3 font-medium text-lg">
								Co-Broking Information
							</h3>
							{/* Co-Broking Toggle */}
							<div className="mb-4">
								<label className="flex cursor-pointer items-center gap-2">
									<input
										type="checkbox"
										checked={localCoBrokingEnabled}
										onChange={(e) => {
											// Update local state for immediate UI response
											const newValue = e.target.checked;
											setLocalCoBrokingEnabled(newValue);

											// Update form state
											form.setFieldValue("coBrokingEnabled", newValue);

											// Reset co-broking fields if disabling co-broking
											if (!newValue) {
												form.setFieldValue("coBrokingAgentName", "");
												form.setFieldValue("coBrokingAgentRen", "");
												form.setFieldValue("coBrokingAgencyName", "");
												form.setFieldValue("coBrokingAgentContact", "");
												form.setFieldValue("coBrokingDirection", "seller");
												setLocalCoBrokingDirection("seller"); // Reset local state too
											}
										}}
										className="accent-blue-500"
									/>
									<span className="text-sm">Co-Broking Transaction</span>
								</label>
							</div>

							{/* Co-Broking Fields (conditional) - Using local state for immediate rendering */}
							{localCoBrokingEnabled && (
								<div className="border-blue-100 border-l-2 pl-4">
									<form.Field name="coBrokingAgentName">
										{(field: AnyFieldApi) => (
											<FormField label="Co-Broking Agent Name" field={field} />
										)}
									</form.Field>
									<form.Field name="coBrokingAgentRen">
										{(field: AnyFieldApi) => (
											<FormField
												label="Co-Broking Agent REN Number"
												field={field}
											/>
										)}
									</form.Field>
									<form.Field name="coBrokingAgencyName">
										{(field: AnyFieldApi) => (
											<FormField label="Co-Broking Agency Name" field={field} />
										)}
									</form.Field>
									<form.Field
										name="coBrokingAgentContact"
										validators={{
											onChange: (value: any) => {
												// First check if value is a string to avoid the "value.replace is not a function" error
												if (value === null || value === undefined)
													return undefined;
												if (typeof value !== "string")
													return "Please enter a valid phone number";

												// Now we can safely use string methods
												if (value.trim() === "") return undefined; // Optional field
												if (
													!/^\+?[0-9]{8,15}$/.test(value.replace(/[\s-]/g, ""))
												) {
													return "Please enter a valid phone number";
												}
												return undefined;
											},
										}}
									>
										{(field: AnyFieldApi) => (
											<FormField
												label="Co-Broking Agent Contact Number"
												field={field}
											/>
										)}
									</form.Field>
									{/* Co-Broking Direction Radio */}
									<div className="mb-4">
										<label className="mb-1 block font-medium">
											Co-Broking Direction
										</label>
										<div className="flex gap-4">
											<label className="flex items-center gap-1">
												<input
													type="radio"
													name="coBrokingDirection"
													value="seller"
													checked={localCoBrokingDirection === "seller"}
													onChange={() => {
														// Update local state for immediate UI response
														setLocalCoBrokingDirection("seller");
														// Update form state
														form.setFieldValue("coBrokingDirection", "seller");
													}}
													className="accent-blue-500"
												/>
												I represent the Seller/Landlord
											</label>
											<label className="flex items-center gap-1">
												<input
													type="radio"
													name="coBrokingDirection"
													value="buyer"
													checked={localCoBrokingDirection === "buyer"}
													onChange={() => {
														// Update local state for immediate UI response
														setLocalCoBrokingDirection("buyer");
														// Update form state
														form.setFieldValue("coBrokingDirection", "buyer");
													}}
													className="accent-blue-500"
												/>
												I represent the Buyer/Tenant
											</label>
										</div>
									</div>
								</div>
							)}
						</div>
					</>
				);
			case 4:
				return (
					<>
						{/* Commission calculation section */}
						<div className="mb-6 text-muted-foreground italic">
							Commission summary will be shown here once commission logic is
							implemented.
						</div>
						<form.Field name="totalPrice">
							{(field: AnyFieldApi) => (
								<FormField label="Total Price" field={field} type="number" />
							)}
						</form.Field>
						<form.Field name="annualRent">
							{(field: AnyFieldApi) => (
								<FormField label="Annual Rent" field={field} type="number" />
							)}
						</form.Field>
						<form.Field name="commissionValue">
							{(field: AnyFieldApi) => (
								<FormField
									label="Commission Value"
									field={field}
									type="number"
								/>
							)}
						</form.Field>
						<form.Field name="commissionType">
							{(field: AnyFieldApi) => (
								<FormField label="Commission Type" field={field} />
							)}
						</form.Field>
						<form.Field name="commissionPercentage">
							{(field: AnyFieldApi) => (
								<FormField
									label="Commission Percentage"
									field={field}
									type="number"
								/>
							)}
						</form.Field>
					</>
				);
			case 5:
				return (
					<>
						<div className="mb-4">
							<label className="mb-1 block font-medium">
								Upload Documents (not yet implemented)
							</label>
							<Input type="file" multiple disabled />
							<p className="text-muted-foreground text-sm">
								Document upload coming soon.
							</p>
						</div>
					</>
				);
			case 6:
				return (
					<>
						<h3 className="mb-2 font-semibold">Review & Submit</h3>
						<pre className="mb-2 rounded bg-muted p-2 text-xs">
							{JSON.stringify(form.state.values, null, 2)}
						</pre>
						<form.Field name="notes">
							{(field: AnyFieldApi) => (
								<FormField label="Notes" field={field} />
							)}
						</form.Field>
					</>
				);
			default:
				return null;
		}
	}

	return (
		<form
			className="mx-auto max-w-xl rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
			onSubmit={form.handleSubmit}
		>
			<h2 className="mb-4 font-semibold text-xl">
				Transaction Form - Step {step + 1} of {STEPS.length}
			</h2>
			<div className="mb-2 font-medium text-lg">{STEPS[step]}</div>
			{renderStep()}
			<div className="mt-6 flex gap-2">
				{step > 0 && (
					<button
						type="button"
						className="rounded bg-gray-200 px-4 py-2"
						onClick={() => setStep((s) => s - 1)}
					>
						Back
					</button>
				)}
				{/* Next button for Step 1: only enabled if valid */}
				{step === 0 && (
					<button
						type="button"
						className={`rounded px-4 py-2 font-semibold ${form.state.values.marketType ? "bg-blue-600 text-white hover:bg-blue-700" : "cursor-not-allowed bg-gray-300 text-gray-500"}`}
						onClick={() => {
							// Validate market type selection
							if (!form.state.values.marketType) {
								// Set error for market type
								setFormErrors((prev) => ({ ...prev, marketType: true }));
								return;
							}

							// Validate the required fields based on market type
							if (
								form.state.values.marketType === "Primary" &&
								!form.state.values.developerProject
							) {
								// Set error for developer project
								setFormErrors((prev) => ({ ...prev, developerProject: true }));
								return;
							}

							if (
								form.state.values.marketType === "Secondary" &&
								!form.state.values.secondaryType
							) {
								// Set error for secondary type
								setFormErrors((prev) => ({ ...prev, secondaryType: true }));
								return;
							}
							setStep((s) => s + 1);
						}}
						disabled={
							!form.state.values.marketType ||
							(form.state.values.marketType === "Primary" &&
								!form.state.values.developerProject) ||
							(form.state.values.marketType === "Secondary" &&
								!form.state.values.secondaryType)
						}
						aria-disabled={
							!form.state.values.marketType ||
							(form.state.values.marketType === "Primary" &&
								!form.state.values.developerProject) ||
							(form.state.values.marketType === "Secondary" &&
								!form.state.values.secondaryType)
								? true
								: undefined
						}
					>
						Next
					</button>
				)}
				{/* Next button for other steps */}
				{step > 0 && step < STEPS.length - 1 && (
					<button
						type="button"
						className="rounded bg-blue-600 px-4 py-2 text-white"
						onClick={() => setStep((s) => s + 1)}
					>
						Next
					</button>
				)}
				{step === STEPS.length - 1 && (
					<button
						type="submit"
						className="rounded bg-green-600 px-4 py-2 text-white"
					>
						Submit
					</button>
				)}
			</div>
		</form>
	);
}
