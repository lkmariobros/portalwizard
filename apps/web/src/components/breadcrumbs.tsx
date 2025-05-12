"use client";

import { RiArrowRightSLine } from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

// Helper function to capitalize segment
function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function Breadcrumbs() {
	const pathname = usePathname();
	const segments = pathname ? pathname.split("/").filter(Boolean) : []; // Handle potential null pathname defensively

	console.log("[Breadcrumbs] Pathname:", pathname);
	console.log("[Breadcrumbs] Segments:", segments);

	// If on the root of the site (e.g. '/'), or no segments after filtering (e.g. path was only '/'),
	// and it's not specifically '/dashboard' (which will be handled by the default 'Dashboard' link below),
	// then don't render anything. Or, if you want a 'Home' breadcrumb for '/', add it here.
	if (segments.length === 0 && pathname !== "/dashboard") {
		console.log(
			"[Breadcrumbs] Condition: (segments.length === 0 && pathname !== '/dashboard'). Returning null.",
		);
		return null;
	}

	// If the only segment is 'dashboard', segments.map will correctly skip it
	// and only the hardcoded 'Dashboard' link below will show, which is desired.
	console.log("[Breadcrumbs] Proceeding to render breadcrumbs structure.");

	return (
		// REMOVE DEBUG BORDER AND TEXT COLOR
		<nav
			aria-label="Breadcrumb"
			className="font-medium text-muted-foreground text-sm"
		>
			<ol className="flex items-center space-x-1.5">
				<li>
					{pathname === "/dashboard" ? (
						// REVERT TEXT COLOR
						<span className="text-foreground">Dashboard</span>
					) : (
						// REVERT TEXT COLOR
						<Link href="/dashboard" className="hover:text-primary">
							Dashboard
						</Link>
					)}
				</li>
				{segments.map((segment, index) => {
					// Skip 'dashboard' segment if it's the first one after splitting the path,
					// as we've manually added the 'Dashboard' link above.
					if (index === 0 && segment.toLowerCase() === "dashboard") {
						return null;
					}

					const href = `/${segments.slice(0, index + 1).join("/")}`;
					const isLast = index === segments.length - 1;
					const isCurrentPage = href === pathname;

					return (
						<Fragment key={segment}>
							<li className="flex items-center">
								{/* REVERT ICON COLOR */}
								<RiArrowRightSLine className="h-4 w-4" />
							</li>
							<li>
								{isLast || isCurrentPage ? (
									// REVERT TEXT COLOR
									<span className="text-foreground">{capitalize(segment)}</span>
								) : (
									// REVERT TEXT COLOR
									<Link href={href} className="hover:text-primary">
										{capitalize(segment)}
									</Link>
								)}
							</li>
						</Fragment>
					);
				})}
			</ol>
		</nav>
	);
}
