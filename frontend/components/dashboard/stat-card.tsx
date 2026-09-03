'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isUp: boolean
  }
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-dark p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1a1a1a]">
          <div className="text-[#6366f1]">
            {icon}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.isUp ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
            {trend.isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <p className="text-[#a1a1a1] text-sm font-medium mb-2">
        {title}
      </p>
      <p className="text-3xl font-bold text-[#fafafa]">
        {value}
      </p>
    </motion.div>
  )
}
