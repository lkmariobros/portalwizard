/**
 * Transaction Form Formatters
 *
 * Utility functions for formatting and parsing values in the transaction form.
 */

/**
 * Formats a numeric value as a currency string (USD)
 *
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(value: string | number): string {
	if (value === undefined || value === null || value === "") return "";

	// Remove all non-numeric characters except decimal point
	let numericValue = String(value).replace(/[^0-9.]/g, "");

	// Handle case with multiple decimal points: keep only the first decimal point and the part after it.
	const parts = numericValue.split(".");
	if (parts.length > 1) {
		// Ensure there's at least one decimal point to form a valid number with parts[1]
		numericValue = `${parts[0]}.${parts.slice(1).join("")}`; // Keep only the first segment after the first decimal
	}
	// If parts.length is 1 (no decimal), numericValue remains as is (e.g., "123")
	// If parts.length is 0 (empty string input), numericValue remains empty, parseFloat will handle.

	// Parse as float and format as currency
	const numValue = Number.parseFloat(numericValue) || 0;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	}).format(numValue);
}

/**
 * Parses a currency string into a numeric value
 *
 * @param value - The currency string to parse
 * @returns Numeric value (e.g., 1234.56)
 */
export function parseCurrency(
	value: string | number | undefined | null,
): number {
	if (!value) return 0;
	// Convert to string and remove all characters that are not digits, a decimal point, or a leading hyphen.
	const numericString = String(value).replace(/[^\d.-]/g, "");
	// parseFloat will handle strings like "-123.45", "123.45", or even malformed ones like "--123" (NaN) or "1-23" (1).
	return Number.parseFloat(numericString) || 0;
}

/**
 * Formats a property type for display
 *
 * @param type - The property type code
 * @returns Human-readable property type
 */
export function formatPropertyType(type: string): string {
	const typeMap: Record<string, string> = {
		residential_apartment: "Apartment",
		residential_villa: "Villa",
		residential_townhouse: "Townhouse",
		commercial_office: "Office Space",
		commercial_retail: "Retail Space",
		commercial_warehouse: "Warehouse",
		land_residential: "Residential Land",
		land_commercial: "Commercial Land",
	};

	return typeMap[type] || type;
}
