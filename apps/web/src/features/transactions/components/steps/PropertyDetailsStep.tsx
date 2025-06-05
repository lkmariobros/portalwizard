"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import type { StepProps } from "../../types";

/**
 * PropertyDetailsStep Component
 *
 * Handles property details entry for both primary and secondary market transactions.
 * For primary market, this comes after property selection.
 * For secondary market, this is the first step after transaction type.
 */
export function PropertyDetailsStep({ form, onNext, onPrevious }: StepProps) {
	const formValues = form.state.values;

	const handleChange = (field: keyof typeof formValues, value: string) => {
		form.setFieldValue(field, value);
	};

	const handleSelectChange = (
		field: keyof typeof formValues,
		value: string,
	) => {
		form.setFieldValue(field, value);
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="font-semibold text-lg">Property Details</h3>
				<p className="mt-1 text-gray-600 text-sm">
					Enter the details of the property for this transaction.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{/* Property Name */}
				<div className="md:col-span-2">
					<Label htmlFor="propertyName">
						Property Name <span className="text-red-500">*</span>
					</Label>
					<Input
						id="propertyName"
						value={formValues.propertyName || ""}
						onChange={(e) => handleChange("propertyName", e.target.value)}
						placeholder="e.g., Azure Heights Tower 1, Unit 101"
					/>
					{form.state.errors?.propertyName && (
						<p className="mt-1 text-red-500 text-sm">
							{form.state.errors.propertyName}
						</p>
					)}
				</div>

				{/* Property Type */}
				<div>
					<Label htmlFor="propertyType">
						Property Type <span className="text-red-500">*</span>
					</Label>
					<Select
						value={formValues.propertyType || ""}
						onValueChange={(value) => handleSelectChange("propertyType", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select property type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="condominium">Condominium</SelectItem>
							<SelectItem value="apartment">Apartment</SelectItem>
							<SelectItem value="landed_house">Landed House</SelectItem>
							<SelectItem value="townhouse">Townhouse</SelectItem>
							<SelectItem value="bungalow">Bungalow</SelectItem>
							<SelectItem value="commercial">Commercial</SelectItem>
							<SelectItem value="office">Office</SelectItem>
							<SelectItem value="retail">Retail</SelectItem>
							<SelectItem value="industrial">Industrial</SelectItem>
							<SelectItem value="other">Other</SelectItem>
						</SelectContent>
					</Select>
					{form.state.errors?.propertyType && (
						<p className="mt-1 text-red-500 text-sm">
							{form.state.errors.propertyType}
						</p>
					)}
				</div>

				{/* Built-up Area */}
				<div>
					<Label htmlFor="builtUpArea">Built-up Area (sq ft)</Label>
					<Input
						id="builtUpArea"
						type="number"
						value={formValues.builtUpArea || ""}
						onChange={(e) => handleChange("builtUpArea", e.target.value)}
						placeholder="e.g., 1200"
					/>
				</div>

				{/* Land Area (for landed properties) */}
				<div>
					<Label htmlFor="landArea">Land Area (sq ft)</Label>
					<Input
						id="landArea"
						type="number"
						value={formValues.landArea || ""}
						onChange={(e) => handleChange("landArea", e.target.value)}
						placeholder="e.g., 2400"
					/>
				</div>

				{/* Bedrooms */}
				<div>
					<Label htmlFor="bedrooms">Bedrooms</Label>
					<Select
						value={formValues.bedrooms || ""}
						onValueChange={(value) => handleSelectChange("bedrooms", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select bedrooms" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="studio">Studio</SelectItem>
							<SelectItem value="1">1</SelectItem>
							<SelectItem value="2">2</SelectItem>
							<SelectItem value="3">3</SelectItem>
							<SelectItem value="4">4</SelectItem>
							<SelectItem value="5">5</SelectItem>
							<SelectItem value="6+">6+</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Bathrooms */}
				<div>
					<Label htmlFor="bathrooms">Bathrooms</Label>
					<Select
						value={formValues.bathrooms || ""}
						onValueChange={(value) => handleSelectChange("bathrooms", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select bathrooms" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">1</SelectItem>
							<SelectItem value="2">2</SelectItem>
							<SelectItem value="3">3</SelectItem>
							<SelectItem value="4">4</SelectItem>
							<SelectItem value="5">5</SelectItem>
							<SelectItem value="6+">6+</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Car Parks */}
				<div>
					<Label htmlFor="carParks">Car Parks</Label>
					<Select
						value={formValues.carParks || ""}
						onValueChange={(value) => handleSelectChange("carParks", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select car parks" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="0">0</SelectItem>
							<SelectItem value="1">1</SelectItem>
							<SelectItem value="2">2</SelectItem>
							<SelectItem value="3">3</SelectItem>
							<SelectItem value="4">4</SelectItem>
							<SelectItem value="5+">5+</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Full Address */}
				<div className="md:col-span-2">
					<Label htmlFor="address">
						Full Address <span className="text-red-500">*</span>
					</Label>
					<Textarea
						id="address"
						value={formValues.address || ""}
						onChange={(e) => handleChange("address", e.target.value)}
						placeholder="Enter full property address including postcode"
						className="min-h-[80px]"
					/>
					{form.state.errors?.address && (
						<p className="mt-1 text-red-500 text-sm">
							{form.state.errors.address}
						</p>
					)}
				</div>

				{/* Transaction Price/Rent */}
				{formValues.transactionType === "sale" ? (
					<div>
						<Label htmlFor="totalPrice">Sale Price (MYR)</Label>
						<Input
							id="totalPrice"
							type="number"
							value={formValues.totalPrice || ""}
							onChange={(e) => handleChange("totalPrice", e.target.value)}
							placeholder="e.g., 1200000"
						/>
					</div>
				) : (
					<div>
						<Label htmlFor="monthlyRent">Monthly Rent (MYR)</Label>
						<Input
							id="monthlyRent"
							type="number"
							value={formValues.monthlyRent || ""}
							onChange={(e) => handleChange("monthlyRent", e.target.value)}
							placeholder="e.g., 3500"
						/>
					</div>
				)}

				{/* Furnishing */}
				<div>
					<Label htmlFor="furnishing">Furnishing</Label>
					<Select
						value={formValues.furnishing || ""}
						onValueChange={(value) => handleSelectChange("furnishing", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select furnishing" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="unfurnished">Unfurnished</SelectItem>
							<SelectItem value="partially_furnished">
								Partially Furnished
							</SelectItem>
							<SelectItem value="fully_furnished">Fully Furnished</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Property Features */}
			<div>
				<Label htmlFor="propertyFeatures">Property Features & Amenities</Label>
				<Textarea
					id="propertyFeatures"
					value={formValues.propertyFeatures || ""}
					onChange={(e) => handleChange("propertyFeatures", e.target.value)}
					placeholder="e.g., Swimming pool, Gym, Security, Near LRT, etc."
					className="min-h-[80px]"
				/>
			</div>
		</div>
	);
}
