'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { StatCard } from '@/components/dashboard/stat-card'
import { RecentExecutions } from '@/components/dashboard/recent-executions'
import { Zap, Play, TrendingUp, Workflow } from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#fafafa] mb-2">Welcome back, John</h1>
          <p className="text-[#a1a1a1]">Here&apos;s what&apos;s happening with your workflows today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Workflows"
            value="24"
            icon={<Workflow size={24} />}
            trend={{ value: 12, isUp: true }}
          />
          <StatCard
            title="Executions Today"
            value="1,247"
            icon={<Zap size={24} />}
            trend={{ value: 8, isUp: true }}
          />
          <StatCard
            title="Success Rate"
            value="98.7%"
            icon={<TrendingUp size={24} />}
            trend={{ value: 2, isUp: false }}
          />
          <StatCard
            title="Active Workflows"
            value="18"
            icon={<Play size={24} />}
            trend={{ value: 5, isUp: true }}
          />
        </div>

        {/* Recent Executions */}
        <RecentExecutions />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-dark p-6">
            <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Get Started</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-sm text-[#6366f1] hover:text-[#4f46e5] transition-colors">
                  → Create your first workflow
                </button>
              </li>
              <li>
                <button className="text-sm text-[#6366f1] hover:text-[#4f46e5] transition-colors">
                  → Explore integrations
                </button>
              </li>
              <li>
                <button className="text-sm text-[#6366f1] hover:text-[#4f46e5] transition-colors">
                  → Read documentation
                </button>
              </li>
            </ul>
          </div>

          <div className="card-dark p-6">
            <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Recent Activity</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-[#a1a1a1]">
                <span className="text-[#fafafa]">Email Campaign</span> executed successfully
              </li>
              <li className="text-[#a1a1a1]">
                <span className="text-[#fafafa]">Data Sync</span> added 234 records
              </li>
              <li className="text-[#a1a1a1]">
                <span className="text-[#fafafa]">Slack Bot</span> sent 15 notifications
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
