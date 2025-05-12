"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { RiChatSmile3Line } from "@remixicon/react";
import * as React from "react";

export function FeedbackDialog({
	children,
	...props
}: React.ComponentProps<typeof Dialog>) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [feedbackType, setFeedbackType] = React.useState("bug");
	const [message, setMessage] = React.useState("");

	const handleSubmit = () => {
		// Handle feedback submission
		console.log("Feedback submitted:", { feedbackType, message });
		setIsOpen(false); // Close dialog on submit
		// Reset form (optional)
		setFeedbackType("bug");
		setMessage("");
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen} {...props}>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<RiChatSmile3Line
							className="text-muted-foreground/80"
							size={20}
							aria-hidden="true"
						/>
						Provide Feedback
					</DialogTitle>
					<DialogDescription>
						We value your input! Let us know what you think.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 py-2">
					<div className="space-y-3">
						<Label className="font-medium text-sm">
							What type of feedback do you have?
						</Label>
						<RadioGroup
							value={feedbackType}
							onValueChange={setFeedbackType}
							defaultValue="bug"
							className="flex gap-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="bug" id="r1" />
								<Label htmlFor="r1" className="font-normal">
									Bug / Issue
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="suggestion" id="r2" />
								<Label htmlFor="r2" className="font-normal">
									Suggestion
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="other" id="r3" />
								<Label htmlFor="r3" className="font-normal">
									Other
								</Label>
							</div>
						</RadioGroup>
					</div>
					<div className="space-y-3">
						<Label htmlFor="message" className="font-medium text-sm">
							Your message
						</Label>
						<Textarea
							id="message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Tell us more..."
							className="min-h-24"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={!message.trim()}>
						Submit Feedback
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
