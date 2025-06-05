import { transactions } from "./db/schema/core";

// Test the schema structure
const testTransaction = {
	agentId: "test-id",
	marketType: "primary" as const,
	transactionType: "sale" as const,
	transactionDate: new Date(),
};

console.log("Schema test:", testTransaction);
