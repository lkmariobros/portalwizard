import { QueryClient } from "@tanstack/react-query";
// apps/web/src/lib/trpc.ts
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "../../../server/src/routers"; // Points to apps/server/src/routers/index.ts

function getBaseUrl() {
	// Priority 1: Explicitly set backend URL
	if (process.env.NEXT_PUBLIC_SERVER_URL) {
		return process.env.NEXT_PUBLIC_SERVER_URL;
	}

	// Priority 2: Vercel deployment URL (assumes API is on the same domain or routed)
	if (process.env.VERCEL_URL) {
		// For Vercel, if API is hosted on the same Vercel project (e.g. Next.js backend functions)
		// or if you have a custom domain pointing to your backend that Vercel knows.
		// If your backend is a *separate* Vercel project, NEXT_PUBLIC_SERVER_URL should be set.
		return `https://${process.env.VERCEL_URL}`;
	}

	// Priority 3: Local development fallback using port logic
	// This is useful if NEXT_PUBLIC_SERVER_URL is not set locally.
	const port =
		typeof window !== "undefined"
			? (process.env.NEXT_PUBLIC_API_PORT ?? process.env.PORT_SERVER ?? 3001)
			: (process.env.PORT_SERVER ?? 3001);
	return `http://localhost:${port}`;
}

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000, // 1 minute
		},
	},
});

export const trpcClient = trpc.createClient({
	links: [
		httpBatchLink({
			url: `${getBaseUrl()}/trpc`, // Corrected to match backend route apps/server/src/app/trpc/[trpc]/route.ts
			async fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
			// You can pass any HTTP headers you wish here
			// async headers() {
			//   return {
			//     authorization: getAuthCookie(),
			//   };
			// },
		}),
	],
});
