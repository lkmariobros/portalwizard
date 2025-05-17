import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";

// *********************************************************************
// ***** ADD THE DIAGNOSTIC LOG HERE *****
console.log(
  "VERCEL RUNTIME DIAGNOSTIC (lib/auth.ts): Initializing Auth. DATABASE_URL =",
  process.env.DATABASE_URL,
  "CORS_ORIGIN =", process.env.CORS_ORIGIN // Also logging CORS_ORIGIN as it's used here
);
// *********************************************************************

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",

		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
});
