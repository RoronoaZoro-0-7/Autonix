'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Menu,
  X,
  Home,
  Workflow,
  BarChart3,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Workflows', href: '/dashboard/workflows', icon: Workflow },
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 60 }}
        transition={{ duration: 0.3 }}
        className="border-r border-[#262626] bg-[#0d0d0d] flex flex-col"
      >
        {/* Logo/Brand */}
        <div className="h-16 border-b border-[#262626] flex items-center justify-between px-4">
          {sidebarOpen && (
            <div className="font-bold text-[#6366f1] text-lg">Autonix</div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-[#a1a1a1] hover:text-[#fafafa] hover:bg-[#1a1a1a] transition-colors group relative"
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.label}
                  </span>
                )}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity rounded-r" />
              </Link>
            )
          })}
        </nav>

        {/* Sign Out */}
        <div className="border-t border-[#262626] p-4">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-[#a1a1a1] hover:text-[#fafafa] hover:bg-[#1a1a1a] transition-colors rounded text-sm">
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[#262626] bg-[#0a0a0a] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-[#fafafa]">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* User Menu */}
            <div className="flex items-center gap-3 px-4 py-2 rounded card-dark">
              <div className="w-8 h-8 rounded-full bg-[#6366f1] flex items-center justify-center text-[#fafafa] font-bold">
                J
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#fafafa]">John Doe</span>
                <span className="text-xs text-[#a1a1a1]">Premium</span>
              </div>
              <ChevronRight size={16} className="text-[#a1a1a1]" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
