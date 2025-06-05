import { createContext } from "@/lib/context";
import { appRouter } from "@/routers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

function setCorsHeaders(response: NextResponse | Response) {
	response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
	response.headers.set(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, DELETE",
	);
	response.headers.set(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization",
	); // Add any other headers your client might send
	response.headers.set("Access-Control-Allow-Credentials", "true");
	return response;
}

async function handler(req: NextRequest) {
	if (req.method === "OPTIONS") {
		const response = new NextResponse(null, { status: 204 });
		return setCorsHeaders(response);
	}

	const response = await fetchRequestHandler({
		endpoint: "/trpc",
		req,
		router: appRouter,
		createContext: () => createContext(req),
		onError: ({ error, path }) => {
			console.error(`tRPC Error on path ${path}:`, error);
		},
	});

	return setCorsHeaders(response);
}

export { handler as GET, handler as POST, handler as OPTIONS }; // Ensure OPTIONS is handled
