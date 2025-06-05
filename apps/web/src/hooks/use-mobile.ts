import { useEffect, useState } from "react";

// Align with Tailwind's default breakpoint for 'md'
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		// Ensure window is defined (for SSR/SSG)
		if (typeof window === "undefined") return;

		const checkIfMobile = () => {
			// Use the same breakpoint as Tailwind's 'md' (768px)
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};

		// Initial check
		checkIfMobile();

		// Add event listener
		window.addEventListener("resize", checkIfMobile);

		// Cleanup
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	return isMobile;
}

// Additional hook for more granular breakpoints if needed in the future
export function useBreakpoint() {
	const [breakpoint, setBreakpoint] = useState<string>("sm");

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleResize = () => {
			const width = window.innerWidth;
			if (width < 640) setBreakpoint("sm");
			else if (width < 768) setBreakpoint("md");
			else if (width < 1024) setBreakpoint("lg");
			else if (width < 1280) setBreakpoint("xl");
			else setBreakpoint("2xl");
		};

		window.addEventListener("resize", handleResize);
		handleResize();
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return breakpoint;
}
