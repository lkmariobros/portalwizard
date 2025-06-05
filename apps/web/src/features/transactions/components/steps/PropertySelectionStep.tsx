/**
 * PropertySelectionStep Component (Primary Market)
 *
 * Handles the property selection or manual entry for primary market transactions.
 */

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import type { StepProps } from "../../types";

export function PropertySelectionStep({ form, onNext, onPrevious }: StepProps) {
	const formValues = form.state.values;

	const handleChange = (field: keyof typeof formValues, value: string) => {
		form.setFieldValue(field, value);
	};

	// TODO: Implement actual property selection/search functionality in the future.
	// For now, this step focuses on manual entry for primary market properties.

	return (
		<div className="space-y-6">
			<h3 className="font-semibold text-lg">
				Property Details (Primary Market)
			</h3>

			<p className="text-gray-600 text-sm">
				Please enter the details of the primary market property. A property
				search/selection feature will be added in the future.
			</p>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<Label htmlFor="propertyName">Property Name*</Label>
					<Input
						id="propertyName"
						value={formValues.propertyName || ""}
						onChange={(e) => handleChange("propertyName", e.target.value)}
						placeholder="e.g., Azure Heights Tower 1, Unit 101"
					/>
					{form.state.errors?.propertyName && (
						<p className="text-red-500 text-sm">
							{form.state.errors.propertyName}
						</p>
					)}
				</div>
				<div>
					<Label htmlFor="propertyType">Property Type*</Label>
					<Input
						id="propertyType"
						value={formValues.propertyType || ""}
						onChange={(e) => handleChange("propertyType", e.target.value)}
						placeholder="e.g., Condominium, Apartment"
					/>
					{form.state.errors?.propertyType && (
						<p className="text-red-500 text-sm">
							{form.state.errors.propertyType}
						</p>
					)}
				</div>
				<div>
					<Label htmlFor="propertyDeveloper">Developer*</Label>
					<Input
						id="propertyDeveloper"
						value={formValues.propertyDeveloper || ""}
						onChange={(e) => handleChange("propertyDeveloper", e.target.value)}
						placeholder="e.g., Elite Properties Inc."
					/>
					{form.state.errors?.propertyDeveloper && (
						<p className="text-red-500 text-sm">
							{form.state.errors.propertyDeveloper}
						</p>
					)}
				</div>
				<div>
					<Label htmlFor="propertyProject">Project Name*</Label>
					<Input
						id="propertyProject"
						value={formValues.propertyProject || ""}
						onChange={(e) => handleChange("propertyProject", e.target.value)}
						placeholder="e.g., The Azure Residences"
					/>
					{form.state.errors?.propertyProject && (
						<p className="text-red-500 text-sm">
							{form.state.errors.propertyProject}
						</p>
					)}
				</div>
				<div className="md:col-span-2">
					<Label htmlFor="address">Full Address*</Label>
					<Textarea
						id="address"
						value={formValues.address || ""}
						onChange={(e) => handleChange("address", e.target.value)}
						placeholder="Enter full property address"
						className="min-h-[80px]"
					/>
					{form.state.errors?.address && (
						<p className="text-red-500 text-sm">{form.state.errors.address}</p>
					)}
				</div>
				<div>
					<Label htmlFor="totalPrice">Total Price (MYR)</Label>
					<Input
						id="totalPrice"
						type="number"
						value={formValues.totalPrice || ""}
						onChange={(e) => handleChange("totalPrice", e.target.value)}
						placeholder="e.g., 1200000"
					/>
					{form.state.errors?.totalPrice && (
						<p className="text-red-500 text-sm">
							{form.state.errors.totalPrice}
						</p>
					)}
				</div>
			</div>

			{/* Navigation buttons */}
			<div className="mt-6 flex justify-between">
				<button
					type="button"
					className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
					onClick={onPrevious}
				>
					Previous
				</button>
				<button
					type="button"
					className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					onClick={onNext}
					// disabled={!form.state.canNext} // Assuming canNext is managed by the form hook based on validation
				>
					Next
				</button>
			</div>
		</div>
	);
}
