/**
 * Transaction Form Step Components
 *
 * This file exports all step components for the transaction form.
 * It serves as a central import point for step components.
 */

// Export all individual step components
export { TransactionTypeStep } from "./TransactionTypeStep";
export { PropertyDetailsStep } from "./PropertyDetailsStep";
export { ClientInformationStep } from "./ClientInformationStep";
export { CoBrokingStep } from "./CoBrokingStep";
export { CommissionCalculationStep } from "./CommissionCalculationStep";
export { DocumentUploadStep } from "./DocumentUploadStep";
export { ReviewStep } from "./ReviewStep";

// PrimaryMarketPropertySelection is specific to primary market flow
// We're using PropertyDetailsStep for both selection and details in primary market
export { PropertyDetailsStep as PropertySelectionStep } from "./PropertyDetailsStep";
