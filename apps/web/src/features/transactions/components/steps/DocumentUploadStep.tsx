/**
 * DocumentUploadStep Component
 *
 * Handles the document upload step of the transaction form.
 * This step allows users to upload relevant transaction documents.
 */

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, File, Upload, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { StepProps } from "../../types";
import { useTransactionFormContext } from "../TransactionFormProvider";

export function DocumentUploadStep({ form, onNext, onPrevious }: StepProps) {
	const [dragActive, setDragActive] = useState(false);

	// Get form values
	const formValues = form.state.values;
	const documents = formValues.documents || [];

	// Handle file upload
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		// Add new files to existing documents
		const newDocuments = [...documents, ...Array.from(files)];
		form.setFieldValue("documents", newDocuments);

		// Reset the input value to allow uploading the same file again
		e.target.value = "";
	};

	// Handle drag events
	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	// Handle drop event
	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		const files = e.dataTransfer.files;
		if (!files || files.length === 0) return;

		// Add new files to existing documents
		const newDocuments = [...documents, ...Array.from(files)];
		form.setFieldValue("documents", newDocuments);
	};

	// Handle file removal
	const handleRemoveFile = (index: number) => {
		const newDocuments = [...documents];
		newDocuments.splice(index, 1);
		form.setFieldValue("documents", newDocuments);
	};

	// Handle notes change
	const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		form.setFieldValue("notes", e.target.value);
	};

	// Format file size
	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";

		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	return (
		<div className="space-y-6">
			<h3 className="font-semibold text-lg">Document Upload</h3>

			{/* File Upload Area */}
			<div
				className={`rounded-lg border-2 border-dashed p-6 text-center ${
					dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
				}`}
				onDragEnter={handleDrag}
				onDragOver={handleDrag}
				onDragLeave={handleDrag}
				onDrop={handleDrop}
			>
				<div className="flex flex-col items-center justify-center space-y-2">
					<Upload className="h-10 w-10 text-gray-400" />
					<h4 className="font-medium">Drag and drop files here</h4>
					<p className="text-gray-500 text-sm">
						or click to browse from your computer
					</p>

					<label htmlFor="file-upload" className="mt-2 cursor-pointer">
						<div className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
							Browse Files
						</div>
						<Input
							id="file-upload"
							type="file"
							multiple
							onChange={handleFileUpload}
							className="hidden"
						/>
					</label>

					<p className="mt-2 text-gray-500 text-xs">
						Supported file types: PDF, JPG, PNG, DOCX (Max 10MB per file)
					</p>
				</div>
			</div>

			{/* Uploaded Files List */}
			{documents.length > 0 && (
				<div className="space-y-3">
					<h4 className="font-medium">
						Uploaded Documents ({documents.length})
					</h4>

					<div className="space-y-2">
						{documents.map((file: File, index: number) => (
							<div
								key={file.name}
								className="flex items-center justify-between rounded-md border bg-gray-50 p-3"
							>
								<div className="flex items-center space-x-3">
									<File className="h-5 w-5 text-blue-500" />
									<div>
										<p className="max-w-xs truncate font-medium text-sm">
											{file.name}
										</p>
										<p className="text-gray-500 text-xs">
											{formatFileSize(file.size)}
										</p>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<CheckCircle className="h-5 w-5 text-green-500" />
									<button
										type="button"
										onClick={() => handleRemoveFile(index)}
										className="rounded-full p-1 hover:bg-gray-200"
									>
										<X className="h-4 w-4 text-gray-500" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Notes Section */}
			<div className="space-y-2">
				<Label htmlFor="notes" className="font-medium text-sm">
					Additional Notes
				</Label>
				<Textarea
					id="notes"
					value={formValues.notes || ""}
					onChange={handleNotesChange}
					className="min-h-[100px] w-full"
					placeholder="Add any additional notes or comments about this transaction..."
				/>
			</div>

			{/* Navigation buttons */}
			<div className="mt-6 flex justify-between">
				<button
					type="button"
					className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
					onClick={onPrevious}
				>
					Previous
				</button>
				<button
					type="button"
					className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					onClick={onNext}
				>
					Next
				</button>
			</div>
		</div>
	);
}
