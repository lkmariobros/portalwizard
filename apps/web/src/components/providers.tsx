"use client";
import { ThemeProvider } from "./theme-provider";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/trpc';
import React, { useState, useEffect } from "react"; 
import { Toaster } from '@/components/ui/sonner'; 

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