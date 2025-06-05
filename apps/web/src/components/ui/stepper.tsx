import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const StepperContext = React.createContext<{
	value: number;
	onValueChange: (value: number) => void;
	orientation: "horizontal" | "vertical";
} | null>(null);

function useStepper() {
	const context = React.useContext(StepperContext);
	if (!context) {
		throw new Error("useStepper must be used within a <Stepper />");
	}
	return context;
}

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
	value: number;
	onValueChange: (value: number) => void;
	orientation?: "horizontal" | "vertical";
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
	(
		{ className, value, onValueChange, orientation = "horizontal", ...props },
		ref,
	) => {
		return (
			<StepperContext.Provider value={{ value, onValueChange, orientation }}>
				<div
					ref={ref}
					className={cn(
						"flex w-full",
						orientation === "vertical"
							? "flex-col"
							: "items-stretch overflow-x-auto",
						className,
					)}
					{...props}
				/>
			</StepperContext.Provider>
		);
	},
);
Stepper.displayName = "Stepper";

const stepperItemVariants = cva(
	"relative flex min-w-0 flex-col items-center px-1 transition-all",
	{
		variants: {
			orientation: {
				horizontal: "flex-1",
				vertical: "flex-1 flex-col",
			},
			isLast: {
				true: "flex-none",
			},
		},
		defaultVariants: {
			orientation: "horizontal",
		},
	},
);

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
	step: number;
	className?: string;
	children?: React.ReactNode;
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
	({ className, step, children, ...props }, ref) => {
		const { value, orientation, onValueChange } = useStepper();
		const isActive = value === step;
		const isCompleted = value > step;

		return (
			<div
				ref={ref}
				className={cn(
					stepperItemVariants({ orientation }),
					isCompleted ? "cursor-pointer" : "",
					className,
				)}
				onClick={() => isCompleted && onValueChange(step)}
				{...props}
			>
				<div className="flex w-full flex-col items-center">{children}</div>
			</div>
		);
	},
);
StepperItem.displayName = "StepperItem";

const stepperTriggerVariants = cva(
	"flex flex-shrink-0 items-center justify-center rounded-full border-2 font-medium transition-all",
	{
		variants: {
			variant: {
				default: "h-8 w-8 text-sm",
				sm: "h-6 w-6 text-xs",
			},
			active: {
				true: "scale-110 border-primary bg-primary text-primary-foreground shadow-md",
			},
			completed: {
				true: "border-primary/20 bg-primary/10 text-primary",
			},
			inactive: {
				true: "border-muted-foreground/20 bg-muted text-muted-foreground/50",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

interface StepperTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof stepperTriggerVariants> {
	asChild?: boolean;
	active?: boolean;
	completed?: boolean;
	inactive?: boolean;
}

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
	({ className, variant, active, completed, inactive, ...props }, ref) => {
		return (
			<button
				className={cn(
					stepperTriggerVariants({
						variant,
						active,
						completed,
						inactive,
					}),
					className,
				)}
				ref={ref}
				type="button"
				{...props}
			/>
		);
	},
);
StepperTrigger.displayName = "StepperTrigger";

const StepperSeparator = () => null;

const StepperLabel = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement> & {
		active?: boolean;
	}
>(({ className, active, ...props }, ref) => {
	return (
		<span
			ref={ref}
			className={cn(
				"mt-2 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center font-medium text-xs",
				active ? "font-semibold text-foreground" : "text-muted-foreground/70",
				className,
			)}
			{...props}
		/>
	);
});
StepperLabel.displayName = "StepperLabel";

export { Stepper, StepperItem, StepperTrigger, StepperSeparator, StepperLabel };
