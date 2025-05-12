"use client";

import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { RiCloseCircleLine, RiSearch2Line } from "@remixicon/react";
import * as React from "react";

export function SearchForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const { state: sidebarState } = useSidebar();
	const isCollapsed = sidebarState === "collapsed";

	const id = React.useId();
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [value, setValue] = React.useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Handle form submission
		console.log("Search submitted:", value);
	};

	const handleClear = () => {
		setValue("");
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	if (isCollapsed) {
		return null;
	}

	return (
		<form
			onSubmit={handleSubmit}
			className={cn("relative", className)}
			{...props}
		>
			<Input
				id={`${id}-input`}
				ref={inputRef}
				className={cn(
					"peer min-w-40 bg-background bg-gradient-to-br from-accent/60 to-accent ps-9",
					Boolean(value) && "pe-9",
				)}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Search"
				type="search"
				aria-label="Search"
			/>
			<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
				<RiSearch2Line size={20} aria-hidden="true" />
			</div>
			{Boolean(value) && (
				<button
					type="button"
					className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="Clear filter"
					onClick={handleClear}
				>
					<RiCloseCircleLine size={16} aria-hidden="true" />
				</button>
			)}
		</form>
	);
}
