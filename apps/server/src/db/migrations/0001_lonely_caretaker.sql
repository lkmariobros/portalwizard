ALTER TABLE "transaction_documents" ALTER COLUMN "uploaded_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "transaction_status_history" ALTER COLUMN "changed_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "agent_id" SET DATA TYPE text;