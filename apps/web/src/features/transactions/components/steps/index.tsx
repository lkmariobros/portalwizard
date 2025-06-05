/**
 * Transaction Form Step Components
 *
 * This file exports all step components for the transaction form.
 * It serves as a central import point for step components.
 */

// Export all individual step components from their respective files
export { TransactionTypeStep } from "./TransactionTypeStep";
export { PropertyDetailsStep } from "./PropertyDetailsStep";
export { ClientInformationStep } from "./ClientInformationStep";
export { CoBrokingStep } from "./CoBrokingStep";
export { CommissionCalculationStep } from "./CommissionCalculationStep";
export { DocumentUploadStep } from "./DocumentUploadStep";
export { ReviewStep } from "./ReviewStep";

// Alias PropertyDetailsStep as PropertySelectionStep for primary market flow
// This assumes PropertyDetailsStep.tsx contains the component used for both.
export { PropertyDetailsStep as PropertySelectionStep } from "./PropertyDetailsStep";
