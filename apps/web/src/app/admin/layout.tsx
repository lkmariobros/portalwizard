"use client"

import React from 'react'
import Header from '@/components/header'
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RiHomeLine, RiFileList2Line, RiUserSettingsLine, RiSettingsLine } from '@remixicon/react' // Example icons

// Navigation items for Admin
const adminNavItems = [
  {
    title: 'Admin Portal',
    items: [
      { title: 'Overview', href: '/admin', icon: RiHomeLine },
      { title: 'All Transactions', href: '/admin/transactions', icon: RiFileList2Line },
      { title: 'User Management', href: '/admin/users', icon: RiUserSettingsLine }, 
    ],
  },
  {
    title: 'System',
    items: [
      { title: 'Settings', href: '/admin/settings', icon: RiSettingsLine },
    ]
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider className="flex h-screen overflow-hidden bg-background">
      <AppSidebar navItems={adminNavItems} className="fixed" />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden pl-[var(--sidebar-width)] data-[sidebar-collapsed=true]:pl-[var(--sidebar-width-icon)]">
        <Header />
        <main className="flex-1 p-4 pt-[calc(4rem+3.5px+1rem)] sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
