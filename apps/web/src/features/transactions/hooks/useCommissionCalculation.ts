/**
 * useCommissionCalculation Hook
 *
 * Custom hook for managing commission calculations in the transaction form.
 */

import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { formatCurrency, parseCurrency } from "../utils/formatters";

interface AgentProfile {
	name: string;
	tier: string;
	baseSplit: number;
	leadershipBonus: number;
	overridePercentage: number;
}

interface CommissionCalculations {
	totalCommission: number;
	agentBaseCommission: number;
	leadershipBonus: number;
	overrideAmount: number;
	agentTotalCommission: number;
	companyCommission: number;
}

import type { FormApi } from "@tanstack/react-form";
import type { TransactionFormValues } from "../types";

export function useCommissionCalculation(
	form: any, // TODO: Replace unknown with TanStack Form instance typeFormApi
) {
	// Mock data for agent tier and commission structure - will be fetched from API in production
	const [agentProfile] = useState<AgentProfile>({
		name: "John Doe",
		tier: "Gold",
		baseSplit: 60, // Agent gets 60% of commission
		leadershipBonus: 5, // Additional 5% for Gold tier
		overridePercentage: 0, // Manager override, if applicable
	});

	// Form values with memoization to prevent unnecessary recalculations
	const formValues = form.state.values;
	const totalPrice = useMemo(
		() => parseCurrency(formValues.totalPrice),
		[formValues.totalPrice],
	);
	const commissionPercentage = useMemo(
		() => Number.parseFloat(formValues.commissionPercentage || "2"),
		[formValues.commissionPercentage],
	);
	const commissionType = formValues.commissionType || "percentage";
	const coBrokingEnabled = formValues.coBrokingEnabled || false;

	// Commission calculations with memoization for consistency
	const calculations = useMemo<CommissionCalculations>(() => {
		const totalCommission =
			commissionType === "percentage"
				? totalPrice * (commissionPercentage / 100)
				: parseCurrency(formValues.commissionValue || "0");

		const agentBaseCommission =
			totalCommission * (agentProfile.baseSplit / 100);
		const leadershipBonus =
			totalCommission * (agentProfile.leadershipBonus / 100);
		const overrideAmount =
			totalCommission * (agentProfile.overridePercentage / 100);
		const agentTotalCommission =
			agentBaseCommission + leadershipBonus - overrideAmount;
		const companyCommission = totalCommission - agentTotalCommission;

		return {
			totalCommission,
			agentBaseCommission,
			leadershipBonus,
			overrideAmount,
			agentTotalCommission,
			companyCommission,
		};
	}, [
		totalPrice,
		commissionPercentage,
		commissionType,
		formValues.commissionValue,
		agentProfile,
	]);

	// Set default commission type and percentage on component mount
	useLayoutEffect(() => {
		// Set default commission type to percentage if not already set
		if (!formValues.commissionType) {
			form.setFieldValue("commissionType", "percentage");
		}

		// Set default commission percentage to 2% if not already set
		if (!formValues.commissionPercentage) {
			form.setFieldValue("commissionPercentage", "2");
		}
	}, [form, formValues.commissionType, formValues.commissionPercentage]);

	// Effect to automatically update the commission value field when using percentage
	useLayoutEffect(() => {
		if (commissionType === "percentage" && totalPrice > 0) {
			// Use default 2% if no percentage is set
			const percentageToUse =
				commissionPercentage > 0 ? commissionPercentage : 2;
			const calculatedValue = formatCurrency(
				totalPrice * (percentageToUse / 100),
			);
			// Synchronous update before browser paint
			form.setFieldValue("commissionValue", calculatedValue);
		}
	}, [totalPrice, commissionPercentage, commissionType, form]);

	// Helper function to get tier badge styling
	const getTierBadgeStyle = useCallback((tier: string) => {
		switch (tier) {
			case "Platinum":
				return "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md";
			case "Gold":
				return "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md";
			case "Silver":
				return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md";
			default:
				return "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md";
		}
	}, []);

	const handleCommissionTypeChange = useCallback(
		(newType: string) => {
			form.setFieldValue("commissionType", newType);

			// If switching to percentage mode and we have the required values, calculate immediately
			if (
				newType === "percentage" &&
				totalPrice > 0 &&
				commissionPercentage > 0
			) {
				const calculatedValue = formatCurrency(
					totalPrice * (commissionPercentage / 100),
				);
				form.setFieldValue("commissionValue", calculatedValue);
			}
			// If switching to fixed mode, clear the auto-calculated value
			else if (newType === "fixed") {
				form.setFieldValue("commissionValue", "");
			}
		},
		[form, totalPrice, commissionPercentage],
	);

	const handlePercentageChange = useCallback(
		(newPercentage: string) => {
			form.setFieldValue("commissionPercentage", newPercentage);

			// If in percentage mode and we have total price, calculate immediately
			if (
				commissionType === "percentage" &&
				totalPrice > 0 &&
				Number.parseFloat(newPercentage) > 0
			) {
				const calculatedValue = formatCurrency(
					totalPrice * (Number.parseFloat(newPercentage) / 100),
				);
				form.setFieldValue("commissionValue", calculatedValue);
			}
		},
		[form, commissionType, totalPrice],
	);

	return {
		agentProfile,
		calculations,
		commissionType,
		commissionPercentage,
		totalPrice,
		coBrokingEnabled,
		getTierBadgeStyle,
		handleCommissionTypeChange,
		handlePercentageChange,
		formatCurrency,
	};
}
