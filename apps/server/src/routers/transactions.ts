import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import {
	clientTypeEnum,
	coBrokingTypeEnum,
	commissionTypeEnum,
	documentTypeEnum,
	marketTypeEnum,
	propertyTypeEnum,
	transactionDocuments,
	transactionStatusEnum,
	transactionStatusHistory,
	transactionTypeEnum,
	transactions,
} from "../db/schema/core";
import type { Context } from "../lib/context";
import { adminProcedure, protectedProcedure, router } from "../lib/trpc";

// Validation schemas

const transactionDisplayDataSchema = z.object({
	id: z.string().uuid(),
	propertyName: z.string(),
	clientName: z.string(),
	transactionDate: z.string().datetime(),
	status: z.enum(transactionStatusEnum.enumValues),
	totalPrice: z.string().optional(),
	commissionValue: z.string().optional(),
	marketType: z.enum(marketTypeEnum.enumValues),
	transactionType: z.enum(transactionTypeEnum.enumValues),
	propertyType: z.enum(propertyTypeEnum.enumValues).optional(),
	propertyAddress: z.string().optional(),
	clientEmail: z.string().email().optional(),
	clientPhone: z.string().optional(),
});
const createTransactionSchema = z.object({
	// Step 1: Transaction Type & Date
	marketType: z.enum(["primary", "secondary"]),
	transactionType: z.enum(["sale", "lease"]),
	transactionDate: z.string().datetime(),

	// Step 2: Property Details
	propertyDetails: z.object({
		name: z.string().min(1, "Property name is required"),
		type: z.enum([
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
		]),
		address: z.string().min(1, "Address is required"),
		developer: z.string().optional(),
		project: z.string().optional(),
	}),

	// Step 3: Client Information
	clientName: z.string().min(1, "Client name is required"),
	clientEmail: z.string().email("Valid email is required"),
	clientPhone: z.string().min(1, "Phone number is required"),
	clientType: z.enum(["buyer", "seller", "tenant", "landlord"]),
	clientIdNumber: z.string().min(1, "ID number is required"),

	// Step 4: Co-Broking Setup
	coBrokingType: z.enum(["direct", "co_broke"]),
	coBrokingAgentName: z.string().optional(),
	coBrokingAgencyName: z.string().optional(),
	coBrokingAgentRera: z.string().optional(),

	// Step 5: Commission Calculation
	totalPrice: z
		.string()
		.refine(
			(val) => {
				// Ensure value matches valid number format with optional single minus at start and single decimal point
				const isValidFormat = /^-?\d+(\.\d+)?$/.test(
					val.replace(/[^0-9.-]/g, ""),
				);
				return isValidFormat;
			},
			{
				message: "Total price must be a valid number format",
			},
		)
		.transform((val: string) => {
			// First clean non-numeric chars except single minus and decimal
			const cleaned = val.replace(/[^0-9.-]/g, "");
			// Then ensure it's in correct format by extracting the valid number
			const match = cleaned.match(/^(-?\d+)(\.\d+)?/);
			return match ? Number.parseFloat(match[0]) : 0;
		}),
	annualRent: z
		.string()
		.optional()
		.refine(
			(val) => {
				if (!val) return true;
				// Ensure value matches valid number format with optional single minus at start and single decimal point
				const isValidFormat = /^-?\d+(\.\d+)?$/.test(
					val.replace(/[^0-9.-]/g, ""),
				);
				return isValidFormat;
			},
			{
				message: "Annual rent must be a valid number format",
			},
		)
		.transform((val: string | undefined) => {
			if (!val) return undefined;
			// First clean non-numeric chars except single minus and decimal
			const cleaned = val.replace(/[^0-9.-]/g, "");
			// Then ensure it's in correct format by extracting the valid number
			const match = cleaned.match(/^(-?\d+)(\.\d+)?/);
			return match ? Number.parseFloat(match[0]) : undefined;
		}),
	commissionValue: z
		.string()
		.refine(
			(val) => {
				// Ensure value matches valid number format with optional single minus at start and single decimal point
				const isValidFormat = /^-?\d+(\.\d+)?$/.test(
					val.replace(/[^0-9.-]/g, ""),
				);
				return isValidFormat;
			},
			{
				message: "Commission value must be a valid number format",
			},
		)
		.transform((val: string) => {
			// First clean non-numeric chars except single minus and decimal
			const cleaned = val.replace(/[^0-9.-]/g, "");
			// Then ensure it's in correct format by extracting the valid number
			const match = cleaned.match(/^(-?\d+)(\.\d+)?/);
			return match ? Number.parseFloat(match[0]) : 0;
		}),
	commissionType: z.enum(["percentage", "fixed_amount"]),
	commissionPercentage: z
		.string()
		.optional()
		.refine(
			(val) => {
				if (!val) return true;
				// Ensure value matches valid number format with optional single minus at start and single decimal point
				const isValidFormat = /^-?\d+(\.\d+)?$/.test(
					val.replace(/[^0-9.-]/g, ""),
				);
				return isValidFormat;
			},
			{
				message: "Commission percentage must be a valid number format",
			},
		)
		.transform((val: string | undefined) => {
			if (!val) return undefined;
			// First clean non-numeric chars except single minus and decimal
			const cleaned = val.replace(/[^0-9.-]/g, "");
			// Then ensure it's in correct format by extracting the valid number
			const match = cleaned.match(/^(-?\d+)(\.\d+)?/);
			return match ? Number.parseFloat(match[0]) : undefined;
		}),

	// Step 6: Notes
	notes: z.string().optional(),
});

const updateTransactionStatusSchema = z.object({
	transactionId: z.string().uuid(),
	status: z.enum([
		"draft",
		"pending_review",
		"pending_approval",
		"approved",
		"rejected",
		"closed",
		"cancelled",
	]),
	notes: z.string().optional(),
});

const adminUpdateTransactionSchema = z.object({
	transactionId: z.string().uuid(),
	status: z.enum([
		"draft",
		"pending_review",
		"pending_approval",
		"approved",
		"rejected",
		"closed",
		"cancelled",
	]),
	notes: z.string().min(1, "Admin notes are required"),
	reviewNotes: z.string().optional(),
});

// Helper function to check if user is admin
const requireAdmin = (ctx: Context) => {
	if (!ctx.session?.user?.role || ctx.session.user.role !== "admin") {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Admin access required",
		});
	}
};

// Helper function to check transaction ownership or admin access
const checkTransactionAccess = async (
	transactionId: string,
	userId: string,
	userRole: string,
) => {
	const result = await db
		.select()
		.from(transactions)
		.where(eq(transactions.id, transactionId))
		.limit(1);
	const transaction: typeof transactions.$inferSelect | undefined = result[0];

	if (!transaction) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Transaction not found",
		});
	}

	// Admins can access all transactions, agents can only access their own
	if (userRole !== "admin" && transaction.agentId !== userId) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Access denied",
		});
	}

	return transaction;
};

export const transactionsRouter = router({
	// Create a new transaction (Agents only)
	create: protectedProcedure
		.input(createTransactionSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const transactionData = {
					agentId: ctx.session.user.id,
					marketType: input.marketType,
					transactionType: input.transactionType,
					transactionDate: new Date(input.transactionDate),
					propertyDetails: input.propertyDetails,
					clientName: input.clientName,
					clientEmail: input.clientEmail,
					clientPhone: input.clientPhone,
					clientType: input.clientType,
					clientIdNumber: input.clientIdNumber,
					coBrokingType: input.coBrokingType,
					coBrokingAgentName: input.coBrokingAgentName,
					coBrokingAgencyName: input.coBrokingAgencyName,
					coBrokingAgentRera: input.coBrokingAgentRera,
					totalPrice: input.totalPrice.toString(),
					annualRent: input.annualRent?.toString(),
					commissionValue: input.commissionValue.toString(),
					commissionType: input.commissionType,
					commissionPercentage: input.commissionPercentage?.toString(),
					notes: input.notes,
					status: "draft" as const,
				};

				// Use database transaction to ensure atomicity of both operations
				const transaction = await db.transaction(async (tx) => {
					// Insert the transaction record
					const [newTransactionRecord] = await tx
						.insert(transactions)
						.values(transactionData)
						.returning();

					if (!newTransactionRecord) {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message:
								"Failed to create transaction record during DB transaction.",
						});
					}

					// Create initial status history entry
					await tx.insert(transactionStatusHistory).values({
						transactionId: newTransactionRecord.id,
						status: "draft",
						changedBy: ctx.session.user.id,
						notes: "Transaction created",
					});
					return newTransactionRecord;
				});

				return transaction;
			} catch (error) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create transaction",
					cause: error,
				});
			}
		}),

	// Get transactions for the current agent
	getMyTransactions: protectedProcedure
		.input(
			z.object({
				status: z
					.enum([
						"draft",
						"pending_review",
						"pending_approval",
						"approved",
						"rejected",
						"closed",
						"cancelled",
					])
					.optional(),
				limit: z.number().min(1).max(100).default(10),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ ctx, input }) => {
			try {
				const whereConditions = [eq(transactions.agentId, ctx.session.user.id)];

				if (input.status) {
					whereConditions.push(eq(transactions.status, input.status));
				}

				const results = await db
					.select()
					.from(transactions)
					.where(and(...whereConditions))
					.orderBy(desc(transactions.createdAt))
					.limit(input.limit)
					.offset(input.offset);

				// Get total count for pagination
				const [{ totalCount }] = await db
					.select({ totalCount: count() })
					.from(transactions)
					.where(and(...whereConditions));

				return {
					transactions: results,
					totalCount,
					hasMore: input.offset + input.limit < totalCount,
				};
			} catch (error) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch transactions",
					cause: error,
				});
			}
		}),

	// Get recent transactions for the current agent (for dashboard)
	getRecentList: protectedProcedure
		.output(z.array(transactionDisplayDataSchema))
		.query(async ({ ctx }) => {
			try {
				const recentTransactions = await db
					.select({
						id: transactions.id,
						// Assuming propertyDetails is a JSONB field with a 'name' key
						propertyName: sql<string>`${transactions.propertyDetails}->>'name'`,
						clientName: transactions.clientName,
						transactionDate: transactions.transactionDate,
						status: transactions.status,
						totalPrice: transactions.totalPrice,
						commissionValue: transactions.commissionValue,
						marketType: transactions.marketType,
						transactionType: transactions.transactionType,
						propertyType:
							sql<string>`${transactions.propertyDetails}->>'type'`.as(
								"propertyType",
							),
						propertyAddress:
							sql<string>`${transactions.propertyDetails}->>'address'`.as(
								"propertyAddress",
							),
						clientEmail: transactions.clientEmail,
						clientPhone: transactions.clientPhone,
					})
					.from(transactions)
					.where(eq(transactions.agentId, ctx.session.user.id))
					.orderBy(desc(transactions.transactionDate))
					.limit(10);

				// Ensure transactionDate is formatted as ISO string and handle potential nulls for schema compliance
				return recentTransactions.map((t) => ({
					// Required fields (provide defaults if nullable in DB and not handled by SQL COALESCE or similar)
					id: t.id,
					propertyName: t.propertyName ?? "",
					clientName: t.clientName ?? "",
					transactionDate:
						t.transactionDate instanceof Date
							? t.transactionDate.toISOString()
							: (t.transactionDate ?? new Date(0).toISOString()),
					status: t.status ?? transactionStatusEnum.enumValues[0],
					marketType: t.marketType ?? marketTypeEnum.enumValues[0],
					transactionType:
						t.transactionType ?? transactionTypeEnum.enumValues[0],

					// Optional fields (convert null from DB to undefined for Zod .optional() schema)
					totalPrice: t.totalPrice === null ? undefined : t.totalPrice,
					commissionValue:
						t.commissionValue === null ? undefined : t.commissionValue,
					propertyType:
						transactionDisplayDataSchema.shape.propertyType.safeParse(
							t.propertyType,
						).success
							? (t.propertyType as (typeof propertyTypeEnum.enumValues)[number])
							: undefined,
					propertyAddress:
						t.propertyAddress === null ? undefined : t.propertyAddress,
					clientEmail: t.clientEmail === null ? undefined : t.clientEmail,
					clientPhone: t.clientPhone === null ? undefined : t.clientPhone,
				}));
			} catch (error) {
				console.error("Failed to fetch recent transactions:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch recent transactions",
					cause: error,
				});
			}
		}),

	// Get all transactions (Admin only)
	getAllTransactions: adminProcedure
		.input(
			z.object({
				status: z
					.enum([
						"draft",
						"pending_review",
						"pending_approval",
						"approved",
						"rejected",
						"closed",
						"cancelled",
					])
					.optional(),
				agentId: z.string().uuid().optional(),
				limit: z.number().min(1).max(100).default(20),
				offset: z.number().min(0).default(0),
				search: z.string().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			try {
				const whereConditions = [];

				if (input.status) {
					whereConditions.push(eq(transactions.status, input.status));
				}

				if (input.agentId) {
					whereConditions.push(eq(transactions.agentId, input.agentId));
				}

				if (input.search) {
					whereConditions.push(
						or(
							sql`${transactions.clientName} ILIKE ${`%${input.search}%`}`,
							sql`${transactions.clientEmail} ILIKE ${`%${input.search}%`}`,
							sql`${transactions.propertyDetails}->>'name' ILIKE ${`%${input.search}%`}`,
							sql`${transactions.propertyDetails}->>'address' ILIKE ${`%${input.search}%`}`,
						),
					);
				}

				const results = await db
					.select()
					.from(transactions)
					.where(
						whereConditions.length > 0 ? and(...whereConditions) : undefined,
					)
					.orderBy(desc(transactions.createdAt))
					.limit(input.limit)
					.offset(input.offset);

				const [{ totalCount }] = await db
					.select({ totalCount: count() })
					.from(transactions)
					.where(
						whereConditions.length > 0 ? and(...whereConditions) : undefined,
					);

				return {
					transactions: results,
					totalCount,
					hasMore: input.offset + input.limit < totalCount,
				};
			} catch (error) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch transactions",
					cause: error,
				});
			}
		}),

	// Get a specific transaction by ID
	getById: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			try {
				const transaction = await checkTransactionAccess(
					input.id,
					ctx.session.user.id,
					ctx.session.user.role,
				);

				// Get transaction history
				const history = await db
					.select()
					.from(transactionStatusHistory)
					.where(eq(transactionStatusHistory.transactionId, input.id))
					.orderBy(desc(transactionStatusHistory.changedAt));

				// Get documents
				const documents = await db
					.select()
					.from(transactionDocuments)
					.where(eq(transactionDocuments.transactionId, input.id));

				return {
					...transaction,
					history,
					documents,
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch transaction",
					cause: error,
				});
			}
		}),

	// Update transaction status (Agent - limited statuses)
	updateStatus: protectedProcedure
		.input(updateTransactionStatusSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				// Agents can only update their own transactions and limited status changes
				const allowedStatuses = ["draft", "pending_review"];
				if (!allowedStatuses.includes(input.status)) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Status change not allowed",
					});
				}

				const resolvedTransaction:
					| typeof transactions.$inferSelect
					| undefined = await checkTransactionAccess(
					input.transactionId,
					ctx.session.user.id,
					ctx.session.user.role ?? "", // Handle potentially undefined role
				);

				// checkTransactionAccess throws if not found. Adding robust check for type safety.
				if (!resolvedTransaction) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Transaction not found or access denied after check.",
					});
				}

				// Skip the update if status isn't actually changing
				if (resolvedTransaction.status === input.status) {
					return resolvedTransaction; // Return existing transaction if no change needed
				}

				// Verify current status allows this change
				if (
					resolvedTransaction.status !== "draft" &&
					input.status === "pending_review"
				) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Transaction cannot be submitted for review",
					});
				}

				// Use database transaction to ensure atomicity of both operations
				const updatedTransaction = await db.transaction(async (tx) => {
					// Update transaction status
					const [updatedRecord] = await tx
						.update(transactions)
						.set({
							status: input.status,
							updatedAt: new Date(),
						})
						.where(eq(transactions.id, input.transactionId))
						.returning();

					if (!updatedRecord) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message:
								"Failed to find transaction to update during DB transaction.",
						});
					}

					// Add status history entry
					await tx.insert(transactionStatusHistory).values({
						transactionId: updatedRecord.id,
						status: input.status,
						changedBy: ctx.session.user.id,
						notes: input.notes || `Status changed to ${input.status}`,
					});
					return updatedRecord;
				});

				return updatedTransaction;
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update transaction status",
					cause: error,
				});
			}
		}),

	// Admin update transaction status
	adminUpdateStatus: adminProcedure
		.input(adminUpdateTransactionSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const resolvedTransaction:
					| typeof transactions.$inferSelect
					| undefined = await checkTransactionAccess(
					input.transactionId,
					ctx.session.user.id,
					ctx.session.user.role ?? "", // Handle potentially undefined role
				);

				// checkTransactionAccess throws if not found. Adding robust check for type safety.
				if (!resolvedTransaction) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Transaction not found or access denied after check.",
					});
				}

				// Skip the update if status isn't actually changing
				if (resolvedTransaction.status === input.status) {
					return resolvedTransaction;
				}

				// Use database transaction to ensure atomicity of both operations
				const updatedTransaction = await db.transaction(async (tx) => {
					// Update transaction status
					const [updatedRecord] = await tx
						.update(transactions)
						.set({
							status: input.status,
							reviewNotes: input.reviewNotes || input.notes, // Use reviewNotes if provided, otherwise use notes
							updatedAt: new Date(),
						})
						.where(eq(transactions.id, input.transactionId))
						.returning();

					if (!updatedRecord) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message:
								"Failed to find transaction to update during DB transaction (admin).",
						});
					}

					// Add status history entry
					await tx.insert(transactionStatusHistory).values({
						transactionId: updatedRecord.id,
						status: input.status,
						changedBy: ctx.session.user.id,
						notes: input.notes,
					});
					return updatedRecord;
				});

				return updatedTransaction;
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update transaction status",
					cause: error,
				});
			}
		}),

	// Get transaction statistics for the agent
	getStats: protectedProcedure.query(async ({ ctx }) => {
		try {
			const agentTransactions = await db
				.select()
				.from(transactions)
				.where(eq(transactions.agentId, ctx.session.user.id));

			const stats = {
				total: agentTransactions.length,
				draft: agentTransactions.filter((t) => t.status === "draft").length,
				pending: agentTransactions.filter(
					(t) =>
						t.status === "pending_review" || t.status === "pending_approval",
				).length,
				approved: agentTransactions.filter((t) => t.status === "approved")
					.length,
				rejected: agentTransactions.filter((t) => t.status === "rejected")
					.length,
				totalCommission: agentTransactions
					.filter((t) => t.status === "approved")
					.reduce(
						(sum, t) => sum + Number.parseFloat(t.commissionValue || "0"),
						0,
					),
			};

			return stats;
		} catch (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch statistics",
				cause: error,
			});
		}
	}),

	// Get admin dashboard statistics
	getAdminStats: adminProcedure.query(async ({ ctx }) => {
		try {
			const allTransactions = await db.select().from(transactions);

			const stats = {
				total: allTransactions.length,
				pendingReview: allTransactions.filter(
					(t) => t.status === "pending_review",
				).length,
				pendingApproval: allTransactions.filter(
					(t) => t.status === "pending_approval",
				).length,
				approved: allTransactions.filter((t) => t.status === "approved").length,
				rejected: allTransactions.filter((t) => t.status === "rejected").length,
				totalValue: allTransactions
					.filter((t) => t.status === "approved")
					.reduce((sum, t) => sum + Number.parseFloat(t.totalPrice || "0"), 0),
				totalCommission: allTransactions
					.filter((t) => t.status === "approved")
					.reduce(
						(sum, t) => sum + Number.parseFloat(t.commissionValue || "0"),
						0,
					),
			};

			return stats;
		} catch (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch admin statistics",
				cause: error,
			});
		}
	}),

	// Submit transaction for review
	submitForReview: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			try {
				return await db.transaction(async (tx) => {
					// Verify the transaction belongs to the current agent and is in draft status
					const [existingTransaction] = await tx
						.select()
						.from(transactions)
						.where(
							and(
								eq(transactions.id, input.id),
								eq(transactions.agentId, ctx.session.user.id),
								eq(transactions.status, "draft"),
							),
						);

					if (!existingTransaction) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "Transaction not found or cannot be submitted",
						});
					}

					// Update status to pending_review
					const [updatedTransaction] = await tx
						.update(transactions)
						.set({
							status: "pending_review",
							updatedAt: new Date(),
						})
						.where(eq(transactions.id, input.id))
						.returning();

					// Add status history entry
					await tx.insert(transactionStatusHistory).values({
						transactionId: input.id,
						status: "pending_review",
						changedBy: ctx.session.user.id,
						notes: "Submitted for review",
					});

					return updatedTransaction;
				});
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to submit transaction for review",
					cause: error,
				});
			}
		}),

	// Delete transaction (Admin for any status, Agent only for draft transactions)
	delete: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			try {
				const transaction = await checkTransactionAccess(
					input.id,
					ctx.session.user.id,
					ctx.session.user.role,
				);

				// Only allow deletion of draft transactions by agents, or any transaction by admin
				if (
					ctx.session.user.role !== "admin" &&
					transaction.status !== "draft"
				) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Can only delete draft transactions",
					});
				}

				await db.transaction(async (tx) => {
					// Delete related records first
					await tx
						.delete(transactionStatusHistory)
						.where(eq(transactionStatusHistory.transactionId, input.id));

					await tx
						.delete(transactionDocuments)
						.where(eq(transactionDocuments.transactionId, input.id));

					// Delete the transaction
					await tx.delete(transactions).where(eq(transactions.id, input.id));
				});

				return { success: true };
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete transaction",
					cause: error,
				});
			}
		}),
});
