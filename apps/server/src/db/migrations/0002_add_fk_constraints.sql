DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'transaction_documents_uploaded_by_user_id_fk' AND table_name = 'transaction_documents' AND table_schema = 'public') THEN
        ALTER TABLE "transaction_documents" ADD CONSTRAINT "transaction_documents_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
    END IF;
END$$;
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'transaction_status_history_changed_by_user_id_fk' AND table_name = 'transaction_status_history' AND table_schema = 'public') THEN
        ALTER TABLE "transaction_status_history" ADD CONSTRAINT "transaction_status_history_changed_by_user_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
    END IF;
END$$;
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'transactions_agent_id_user_id_fk' AND table_name = 'transactions' AND table_schema = 'public') THEN
        ALTER TABLE "transactions" ADD CONSTRAINT "transactions_agent_id_user_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
    END IF;
END$$;
