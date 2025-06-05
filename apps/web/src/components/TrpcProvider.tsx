"use client";

import { queryClient, trpc, trpcClient } from "@/lib/trpc"; // Assuming these are exported from your trpc setup file
import { QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";

interface TrpcProviderProps {
	children: React.ReactNode;
}

export function TrpcProvider({ children }: TrpcProviderProps) {
	// Ensure queryClient and trpcClient are stable across re-renders if created here
	// Or, ensure they are singletons if imported directly as done with queryClient and trpcClient from @/lib/trpc

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}
