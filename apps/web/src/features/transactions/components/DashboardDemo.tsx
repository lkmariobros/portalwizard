"use client";

import React from "react";
import { TransactionFormModal } from "./TransactionFormModal";
import { Card } from "@/components/ui/card";

/**
 * Demo dashboard component to demonstrate the TransactionFormModal integration
 */
export function DashboardDemo(): React.ReactNode {
  return (
    <div className="container mx-auto p-4 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold dark:text-white">Real Estate Dashboard</h1>
        <TransactionFormModal 
          triggerButtonText="+ New Transaction" 
          className=""
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-4 shadow-sm dark:bg-[var(--color-sidebar-accent)]/10 dark:border-[var(--color-sidebar-border)] dark:text-white">
          <h3 className="font-medium text-gray-700 dark:text-white mb-2">Active Transactions</h3>
          <p className="text-3xl font-bold dark:text-white">12</p>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">2 pending submission</p>
        </Card>
        
        <Card className="p-4 shadow-sm dark:bg-[var(--color-sidebar-accent)]/10 dark:border-[var(--color-sidebar-border)] dark:text-white">
          <h3 className="font-medium text-gray-700 dark:text-white mb-2">Completed This Month</h3>
          <p className="text-3xl font-bold dark:text-white">8</p>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">↑ 20% from last month</p>
        </Card>
        
        <Card className="p-4 shadow-sm dark:bg-[var(--color-sidebar-accent)]/10 dark:border-[var(--color-sidebar-border)] dark:text-white">
          <h3 className="font-medium text-gray-700 dark:text-white mb-2">Total Commission</h3>
          <p className="text-3xl font-bold dark:text-white">MYR 85,000</p>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">↑ 15% from last month</p>
        </Card>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Recent Transactions</h2>
        <div className="overflow-x-auto rounded-lg border dark:border-[var(--color-sidebar-border)]">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-[var(--color-sidebar-border)]">
            <thead className="bg-gray-50 dark:bg-[var(--color-sidebar)]/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[var(--color-sidebar)] divide-y divide-gray-200 dark:divide-[var(--color-sidebar-border)]">
              {[
                {
                  property: "Pavilion Residences",
                  client: "John Doe",
                  type: "Sale",
                  value: "MYR 1,250,000",
                  status: "Completed",
                  date: "2025-05-10"
                },
                {
                  property: "The Gardens Apartment",
                  client: "Jane Smith",
                  type: "Rental",
                  value: "MYR 4,500/mo",
                  status: "Active",
                  date: "2025-05-12"
                },
                {
                  property: "Bukit Jalil Condo",
                  client: "Michael Wong",
                  type: "Sale",
                  value: "MYR 850,000",
                  status: "Pending",
                  date: "2025-05-15"
                }
              ].map((transaction, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{transaction.property}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{transaction.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{transaction.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{transaction.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' :
                      transaction.status === 'Active' ? 'bg-[var(--color-sidebar-accent)]/20 text-[var(--color-sidebar-accent)] dark:bg-[var(--color-sidebar-accent)]/30 dark:text-[var(--color-sidebar-primary-foreground)]' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-sm text-gray-500 italic">
          Click the "New Transaction" button to experience the horizontal multi-step form in a modal overlay
        </p>
      </div>
    </div>
  );
}
