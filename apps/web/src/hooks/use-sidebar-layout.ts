"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";

export function useSidebarLayout() {
	const { state } = useSidebar();

	useEffect(() => {
		// Update CSS variables based on sidebar state
		const root = document.documentElement;
		if (state === "expanded") {
			root.style.setProperty("--sidebar-width", "16rem");
			root.style.setProperty("--sidebar-width-icon", "4.5rem");
		} else {
			root.style.setProperty("--sidebar-width", "4.5rem");
			root.style.setProperty("--sidebar-width-icon", "4.5rem");
		}
	}, [state]);

	return { state };
}
