"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NewTransactionForm } from "./NewTransactionForm";
import { X } from "lucide-react";
import "./transaction-form.css";

interface TransactionFormModalProps {
  triggerButtonText?: string;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TransactionFormModal({
  triggerButtonText = "New Transaction",
  className = "",
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: TransactionFormModalProps): React.ReactElement {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;
  const setIsOpen = (open: boolean) => {
    setUncontrolledIsOpen(open);
    controlledOnOpenChange?.(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
<Button 
   variant="default" 
  className={`bg-[var(--form-primary-color)] hover:bg-[var(--form-primary-color)]/90 text-[var(--form-primary-text)] dark:bg-[var(--form-primary-color)] dark:hover:bg-[var(--form-primary-color)]/90 dark:text-[var(--form-primary-text)] ${className}`}
 >
   {triggerButtonText}
 </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-[95vw] p-0 h-[85vh] max-h-[900px] overflow-hidden border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(1_0_0_/_10%)] bg-[oklch(0.967_0.001_286.375)] dark:bg-[oklch(0.21_0.006_285.885)] text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">
        <div className="flex justify-end p-2 absolute top-2 right-2 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)} 
            className="form-close-button"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="h-full overflow-hidden bg-[oklch(0.967_0.001_286.375)] dark:bg-[oklch(0.141_0.005_285.823)]">
          <NewTransactionForm onComplete={() => setIsOpen(false)} agentTierKey="advisor" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
