import {
	boolean,
	jsonb,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth"; // Assumes users table is exported from auth.ts

// Enums
export const marketTypeEnum = pgEnum("market_type", ["primary", "secondary"]);
export const transactionTypeEnum = pgEnum("transaction_type", [
	"sale",
	"lease",
]);
export const propertyTypeEnum = pgEnum("property_type", [
	"residential_villa",
	"residential_apartment",
	"residential_townhouse",
	"commercial_office",
	"commercial_retail",
	"commercial_warehouse",
	"land_residential",
	"land_commercial",
	"industrial_factory",
	"other",
]);
export const clientTypeEnum = pgEnum("client_type", [
	"buyer",
	"seller",
	"tenant",
	"landlord",
]);
export const coBrokingTypeEnum = pgEnum("co_broking_type", [
	"direct",
	"co_broke",
]);
export const commissionTypeEnum = pgEnum("commission_type", [
	"percentage",
	"fixed_amount",
]);
export const documentTypeEnum = pgEnum("document_type", [
	"agreement",
	"kyc",
	"payment_proof",
	"title_deed",
	"spa",
	"moi",
	"other",
]);
export const transactionStatusEnum = pgEnum("transaction_status", [
	"draft",
	"pending_review",
	"pending_approval",
	"approved",
	"rejected",
	"closed",
	"cancelled",
]);

// Tables
export const transactions = pgTable("transactions", {
	id: uuid("id").defaultRandom().primaryKey(),
	agentId: text("agent_id")
		.references(() => user.id)
		.notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),

	// Step 1: Transaction Type & Date
	marketType: marketTypeEnum("market_type"),
	transactionType: transactionTypeEnum("transaction_type"),
	transactionDate: timestamp("transaction_date", { withTimezone: true }),

	// Step 2: Property Selection
	propertyDetails: jsonb("property_details"),
	// Example structure for propertyDetails:
	// {
	//   name: "Azure Heights Tower 1, Apartment 101",
	//   type: "residential_apartment",
	//   address: "123 Marina Drive, Dubai",
	//   developer: "Emaar",
	//   project: "Azure Heights",
	//   building: "Tower 1",
	//   unitNumber: "101",
	//   sizeSqft: 1200,
	//   bedrooms: 2,
	//   bathrooms: 2,
	//   parkingSpaces: 1
	// }

	// Step 3: Client Information
	clientName: varchar("client_name", { length: 255 }),
	clientEmail: varchar("client_email", { length: 255 }),
	clientPhone: varchar("client_phone", { length: 50 }),
	clientType: clientTypeEnum("client_type"),
	clientIdNumber: varchar("client_id_number", { length: 100 }),

	// Step 4: Co-Broking Setup
	coBrokingType: coBrokingTypeEnum("co_broking_type"),
	coBrokingAgentName: varchar("co_broking_agent_name", { length: 255 }),
	coBrokingAgencyName: varchar("co_broking_agency_name", { length: 255 }),
	coBrokingAgentRera: varchar("co_broking_agent_rera", { length: 100 }),

	// Step 5: Commission Calculation
	totalPrice: numeric("total_price", { precision: 15, scale: 2 }),
	annualRent: numeric("annual_rent", { precision: 15, scale: 2 }),
	commissionValue: numeric("commission_value", { precision: 15, scale: 2 }),
	commissionType: commissionTypeEnum("commission_type"),
	commissionPercentage: numeric("commission_percentage", {
		precision: 5,
		scale: 2,
	}),

	// Step 7: Review
	status: transactionStatusEnum("status").default("draft").notNull(),
	notes: text("notes"),
});

export const transactionDocuments = pgTable("transaction_documents", {
	id: uuid("id").defaultRandom().primaryKey(),
	transactionId: uuid("transaction_id")
		.references(() => transactions.id, { onDelete: "cascade" })
		.notNull(),
	documentName: varchar("document_name", { length: 255 }).notNull(),
	documentUrl: text("document_url").notNull(),
	documentType: documentTypeEnum("document_type"),
	uploadedAt: timestamp("uploaded_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	uploadedBy: text("uploaded_by").references(() => user.id),
});

export const transactionStatusHistory = pgTable("transaction_status_history", {
	id: uuid("id").defaultRandom().primaryKey(),
	transactionId: uuid("transaction_id")
		.references(() => transactions.id, { onDelete: "cascade" })
		.notNull(),
	status: transactionStatusEnum("status").notNull(),
	changedAt: timestamp("changed_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	changedBy: text("changed_by").references(() => user.id),
	notes: text("notes"),
});
