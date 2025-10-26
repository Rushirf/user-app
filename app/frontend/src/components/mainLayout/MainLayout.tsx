"use client"

import React from "react"
import { useSidebar } from "../context/SidebarContext"
import AppSidebar from "../layout/AppSidebar"
import AppHeader from "../layout/AppHeader"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isExpanded, isMobileOpen } = useSidebar()

  // Dynamic margin for main content
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded
      ? "lg:ml-[240px]"
      : "lg:ml-[80px]"

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      {/* <Backdrop /> */}

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
    
        <div className="sticky top-0 z-50">
         
          {/* Header */}
          <AppHeader />
        </div>
        {/* Page Content */}
        <div className="p-1.5 lg:p-4 mx-auto max-w-[--breakpoint-2xl] mt-16 lg:mt-0  ">
          <div className="min-h-screen border rounded-2xl dark:border-gray-700   bg-white dark:bg-[#191919] p-2 lg:px-5 sm:py-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
