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
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FormApi, useForm } from "@tanstack/react-form";
import type { AnyFieldApi, AnyFormApi } from "@tanstack/react-form";
import React, { useState, useEffect } from "react";

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
}

export function NewTransactionForm({ onComplete }: NewTransactionFormProps) {
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
						<h2 className="mb-4 font-semibold text-xl text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">Transaction Type</h2>
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
													<div className="absolute z-20 max-h-60 w-full overflow-auto rounded border border-[var(--color-sidebar-primary)]/20 dark:border-[var(--color-sidebar-primary)]/30 dark:border-gray-600 bg-white dark:bg-[var(--color-sidebar)] shadow">
														{Object.entries(grouped).map(([loc, projs]) => (
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
													<div className="absolute z-20 w-full rounded border border-[var(--color-sidebar-primary)]/20 dark:border-[var(--color-sidebar-primary)]/30 dark:border-gray-600 p-2 text-muted-foreground text-sm shadow-lg">
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
														? "rounded bg-[oklch(0.723_0.219_149.579)] dark:bg-[oklch(0.696_0.17_162.48)] px-4 py-2 font-semibold text-[oklch(0.982_0.018_155.826)] dark:text-[oklch(0.266_0.065_152.934)] shadow focus:outline-none focus:ring-2 focus:ring-[oklch(0.723_0.219_149.579)]/70 dark:focus:ring-[oklch(0.696_0.17_162.48)]/70"
														: "rounded bg-[oklch(0.967_0.001_286.375)] dark:bg-[oklch(0.21_0.006_285.885)] px-4 py-2 text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:bg-[oklch(0.967_0.001_286.375)]/70 dark:hover:bg-[oklch(0.274_0.006_286.033)]/30 focus:outline-none focus:ring-2 focus:ring-[oklch(0.723_0.219_149.579)]/70 dark:focus:ring-[oklch(0.696_0.17_162.48)]/70"
												}
												aria-pressed={field.state.value === "Sale"}
											>
												Sale
											</ToggleGroupItem>
											<ToggleGroupItem
												value="Rental"
												className={
													field.state.value === "Rental"
														? "rounded bg-[oklch(0.723_0.219_149.579)] dark:bg-[oklch(0.696_0.17_162.48)] px-4 py-2 font-semibold text-[oklch(0.982_0.018_155.826)] dark:text-[oklch(0.266_0.065_152.934)] shadow focus:outline-none focus:ring-2 focus:ring-[oklch(0.723_0.219_149.579)]/70 dark:focus:ring-[oklch(0.696_0.17_162.48)]/70"
														: "rounded bg-[oklch(0.967_0.001_286.375)] dark:bg-[oklch(0.21_0.006_285.885)] px-4 py-2 text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:bg-[oklch(0.967_0.001_286.375)]/70 dark:hover:bg-[oklch(0.274_0.006_286.033)]/30 focus:outline-none focus:ring-2 focus:ring-[oklch(0.723_0.219_149.579)]/70 dark:focus:ring-[oklch(0.696_0.17_162.48)]/70"
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
					<React.Fragment>
						<h2 className="mb-4 font-semibold text-xl text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">Property Details</h2>
						{/* Transaction Price/Rent based on market type */}
						{/* For Sale transactions (either Primary or Secondary with Sale type) */}
						{(form.state.values.marketType === "Primary" ||
							(form.state.values.marketType === "Secondary" &&
								form.state.values.secondaryType === "Sale")) && (
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
												className="block font-medium text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] text-sm"
												htmlFor="primary-price"
											>
												{form.state.values.marketType === "Primary"
													? <span className="font-medium text-[oklch(0.723_0.219_149.579)] dark:text-[oklch(0.696_0.17_162.48)]">Transaction Price</span>
													: <span className="font-medium text-[oklch(0.723_0.219_149.579)] dark:text-[oklch(0.696_0.17_162.48)]">Total Price</span>}{" "}
												<span className="text-red-500">*</span>
											</label>
											<div className="pre-wrap break-words rounded bg-[oklch(0.967_0.001_286.375)] dark:bg-[oklch(0.21_0.006_285.885)] p-4 text-sm text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
													<span className="text-[oklch(0.552_0.016_285.938)] dark:text-[oklch(0.705_0.015_286.067)] sm:text-sm">MYR</span>
												</div>
												<input
													id="primary-price"
{{ ... }}
												className="block font-medium text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] text-sm"
												htmlFor="secondary-rent"
											>
												<span className="font-medium text-[oklch(0.723_0.219_149.579)] dark:text-[oklch(0.696_0.17_162.48)]">Annual Rent</span> <span className="text-red-500">*</span>
											</label>
											<div className="pre-wrap break-words rounded bg-[oklch(0.967_0.001_286.375)] dark:bg-[oklch(0.21_0.006_285.885)] p-4 text-sm text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
													<span className="text-[oklch(0.552_0.016_285.938)] dark:text-[oklch(0.705_0.015_286.067)] sm:text-sm">MYR</span>
												</div>
												<input
													id="secondary-annual-rent"
{{ ... }}
												className="block font-medium text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] text-sm"
												htmlFor="commission-value"
											>
												<span className="font-medium text-[oklch(0.723_0.219_149.579)] dark:text-[oklch(0.696_0.17_162.48)]">Commission Value</span> <span className="text-red-500">*</span>
											</label>
											<div className="pre-wrap break-words rounded bg-[oklch(0.967_0.001_286.375)] dark:bg-[oklch(0.21_0.006_285.885)] p-4 text-sm text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
													<span className="text-[oklch(0.552_0.016_285.938)] dark:text-[oklch(0.705_0.015_286.067)] sm:text-sm">MYR</span>
												</div>
												<input
													id="commission-value"
{{ ... }}
													type="text"
													className="block w-full rounded-md border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(1_0_0_/_15%)] bg-white dark:bg-[oklch(0.21_0.006_285.885)] text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] p-2 pr-12 pl-14 focus:border-[oklch(0.723_0.219_149.579)] focus:ring-[oklch(0.723_0.219_149.579)] dark:focus:border-[oklch(0.696_0.17_162.48)] dark:focus:ring-[oklch(0.696_0.17_162.48)] sm:text-sm"
													placeholder={suggestedCommission ? formatCurrency(suggestedCommission) : "0"}
													value={formatCurrency(fieldValue)}
													onChange={(e) => {
														const rawValue = e.target.value.replace(/[^0-9]/g, "");
														field.handleChange(rawValue);
													}}
													onBlur={field.handleBlur}
												/>
											</div>
											{field.state.meta.isTouched &&
												field.state.meta.errors && (
													<span className="text-red-600 text-sm">
														{Array.isArray(field.state.meta.errors)
															? field.state.meta.errors[0]
															: field.state.meta.errors}
													</span>
												)}
											<p className="mt-1 text-[oklch(0.552_0.016_285.938)] dark:text-[oklch(0.705_0.015_286.067)] text-sm">
												{isSaleTransaction 
													? `Suggested: ${defaultCommissionPercent}% of property price` 
													: `Suggested: ${defaultCommissionPercent}% of annual rent`}
											</p>
										</div>
									);
								}}
							</form.Field>

							<div className="mt-6 bg-gray-50 dark:bg-[var(--color-sidebar-accent)]/10 p-4 rounded border dark:border-[var(--color-sidebar-border)]">
								<h4 className="font-medium mb-2">Commission Breakdown</h4>
								<p className="mb-2 text-sm">
									Base Commission ({currentAgentTier.overridingPercentage}%): {formatCurrency(baseCommission.toString())}
								</p>
								<p className="mb-2 text-sm">
									Leadership Bonus ({currentAgentTier.leadershipBonus}%): {formatCurrency(leadershipBonus.toString())}
								</p>
								<p className="mb-2 text-sm">
									Total Agent Commission: {formatCurrency(totalCommission.toString())}
								</p>
								<p className="mb-2 text-sm">
									Agency Share: {formatCurrency(agencyShare.toString())}
								</p>
								{isCommissionOverage && (
									<p className="mb-2 text-sm text-red-500">
										Warning: Total commission exceeds commission value.
									</p>
								)}
							</div>
						</div>
					</>
				);
			case 5:
				return (
					<>
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
					</>
				);
			case 6:
				return (
					<>
						<h2 className="mb-4 font-semibold text-xl text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">Review & Submit</h2>
						<h3 className="mb-2 font-semibold">Review & Submit</h3>
						<pre className="mb-2 rounded bg-[oklch(0.967_0.001_286.375)] dark:bg-[oklch(0.21_0.006_285.885)] p-2 text-xs text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">
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
						void form.handleSubmit();
						if (onComplete && step === STEPS.length - 1) {
							onComplete();
						}
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
								<button
									type="button"
									className="rounded-md border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(1_0_0_/_15%)] bg-white dark:bg-[oklch(0.21_0.006_285.885)] px-4 py-2 text-sm font-medium text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:bg-[oklch(0.967_0.001_286.375)] dark:hover:bg-[oklch(0.274_0.006_286.033)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.723_0.219_149.579)]/70 dark:focus:ring-[oklch(0.696_0.17_162.48)]/70"
									onClick={() => setStep((s) => s - 1)}
								>
									Back
								</button>
							)}
						</div>
						<div className="flex space-x-3">
							{/* Next button for Step 1: only enabled if valid */}
							{step === 0 && (() => {
								// Helper constant for validation to avoid repetition
								const isStep0Valid = form.state.values.marketType && 
									((form.state.values.marketType === "Primary" && form.state.values.developerProject) ||
									(form.state.values.marketType === "Secondary" && form.state.values.secondaryType));

								return (
									<button
										type="button"
										className={`rounded-md px-4 py-2 text-sm font-medium ${
											isStep0Valid
												? "bg-[oklch(0.723_0.219_149.579)] text-[oklch(0.982_0.018_155.826)] hover:bg-[oklch(0.723_0.219_149.579)]/90 dark:bg-[oklch(0.696_0.17_162.48)] dark:text-[oklch(0.266_0.065_152.934)] dark:hover:bg-[oklch(0.696_0.17_162.48)]/90 focus:outline-none focus:ring-2 focus:ring-[oklch(0.723_0.219_149.579)] dark:focus:ring-[oklch(0.696_0.17_162.48)] focus:ring-offset-2"
												: "bg-gray-300 text-gray-500 dark:text-gray-300 cursor-not-allowed"
										}`}
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
										disabled={!isStep0Valid}
										aria-disabled={!isStep0Valid ? true : undefined}
									>
										Next
									</button>
								);
							})()}
							{/* Next button for other steps */}
							{step > 0 && step < STEPS.length - 1 && (
								<button
									type="button"
									className="rounded-md bg-[oklch(0.723_0.219_149.579)] px-4 py-2 text-sm font-medium text-[oklch(0.982_0.018_155.826)] hover:bg-[oklch(0.723_0.219_149.579)]/90 dark:bg-[oklch(0.696_0.17_162.48)] dark:text-[oklch(0.266_0.065_152.934)] dark:hover:bg-[oklch(0.696_0.17_162.48)]/90 focus:outline-none focus:ring-2 focus:ring-[oklch(0.723_0.219_149.579)] dark:focus:ring-[oklch(0.696_0.17_162.48)] focus:ring-offset-2"
									onClick={() => setStep((s) => s + 1)}
								>
									Next
								</button>
							)}
							{step === STEPS.length - 1 && (
								<button
									type="submit"
									className="rounded-md bg-[oklch(0.723_0.219_149.579)] px-4 py-2 text-sm font-medium text-[oklch(0.982_0.018_155.826)] hover:bg-[oklch(0.723_0.219_149.579)]/90 dark:bg-[oklch(0.696_0.17_162.48)] dark:text-[oklch(0.266_0.065_152.934)] dark:hover:bg-[oklch(0.696_0.17_162.48)]/90 focus:outline-none focus:ring-2 focus:ring-[oklch(0.723_0.219_149.579)] dark:focus:ring-[oklch(0.696_0.17_162.48)] focus:ring-offset-2"
								>
									Submit
								</button>
							)}
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
