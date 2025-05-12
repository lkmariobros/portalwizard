import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "@/index.css"; // Corrected path to global styles
import Providers from "@/components/providers"; // Import the Providers component
import { cn } from "@/lib/utils";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "PortalWizard Dashboard",
	description: "Your amazing dashboard application",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable,
				)}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
