"use client";
import { Toaster } from "@/components/ui/sonner";
import type React from "react";
import { useEffect, useState } from "react";
import { TrpcProvider } from "./TrpcProvider"; // Import our new TrpcProvider
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
		<TrpcProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="light"
				enableSystem
				disableTransitionOnChange
			>
				{hasMounted && <Toaster richColors />}
				{children}
			</ThemeProvider>
		</TrpcProvider>
	);
}
