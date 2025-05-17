"use client";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./theme-provider";

export default function Providers({
	children,
}: {
	children: React.ReactNode;
}) {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{hasMounted && <Toaster richColors />}
				{children}
			</ThemeProvider>
		</QueryClientProvider>
	);
}
