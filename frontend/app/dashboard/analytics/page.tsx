'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard/layout'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar } from 'lucide-react'

const executionsData = [
  { date: 'Mon', executions: 240, successful: 220 },
  { date: 'Tue', executions: 350, successful: 310 },
  { date: 'Wed', executions: 280, successful: 250 },
  { date: 'Thu', executions: 420, successful: 410 },
  { date: 'Fri', executions: 510, successful: 480 },
  { date: 'Sat', executions: 380, successful: 360 },
  { date: 'Sun', executions: 290, successful: 270 },
]

const topWorkflows = [
  { name: 'Email Campaign Sender', executions: 1247, success: 98.7 },
  { name: 'Slack Notifications', executions: 890, success: 99.2 },
  { name: 'CRM Data Sync', executions: 756, success: 97.5 },
  { name: 'Report Generation', executions: 542, success: 96.8 },
  { name: 'Webhook Handler', executions: 423, success: 99.0 },
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#fafafa] mb-2">Analytics</h1>
          <p className="text-[#a1a1a1]">Track your workflow performance and usage</p>
        </div>

        {/* Date Range Picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card-dark p-4 inline-flex items-center gap-2"
        >
          <Calendar size={18} className="text-[#a1a1a1]" />
          <select className="bg-transparent text-[#fafafa] text-sm outline-none cursor-pointer">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Executions Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-dark p-6"
          >
            <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Executions Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={executionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis stroke="#a1a1a1" />
                <YAxis stroke="#a1a1a1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fafafa' }}
                />
                <Legend />
                <Line type="monotone" dataKey="executions" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="successful" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Success vs Failure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-dark p-6"
          >
            <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Success vs Failure</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={executionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis stroke="#a1a1a1" />
                <YAxis stroke="#a1a1a1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fafafa' }}
                />
                <Legend />
                <Bar dataKey="successful" fill="#22c55e" />
                <Bar dataKey="executions" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Top Workflows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card-dark p-6"
        >
          <h3 className="text-lg font-semibold text-[#fafafa] mb-6">Most Used Workflows</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#262626]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Workflow</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Executions</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {topWorkflows.map((workflow, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-[#262626] hover:bg-[#1a1a1a] transition-colors"
                  >
                    <td className="py-4 px-4 text-sm text-[#fafafa]">
                      {workflow.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#a1a1a1]">
                      {workflow.executions.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#6366f1] h-full transition-all rounded-full"
                            style={{ width: `${workflow.success}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-[#fafafa] w-12 text-right">
                          {workflow.success}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Usage vs Plan Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card-dark p-6"
        >
          <h3 className="text-lg font-semibold text-[#fafafa] mb-6">Usage vs Plan Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-[#a1a1a1] mb-3">API Requests</p>
              <div className="mb-2">
                <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
                  <div className="bg-[#6366f1] h-full rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
              <p className="text-sm text-[#fafafa] font-medium">
                650,000 / 1,000,000
              </p>
            </div>
            <div>
              <p className="text-sm text-[#a1a1a1] mb-3">Workflows</p>
              <div className="mb-2">
                <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
                  <div className="bg-[#6366f1] h-full rounded-full" style={{ width: '48%' }} />
                </div>
              </div>
              <p className="text-sm text-[#fafafa] font-medium">
                24 / 50
              </p>
            </div>
            <div>
              <p className="text-sm text-[#a1a1a1] mb-3">Storage</p>
              <div className="mb-2">
                <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
                  <div className="bg-[#6366f1] h-full rounded-full" style={{ width: '32%' }} />
                </div>
              </div>
              <p className="text-sm text-[#fafafa] font-medium">
                32 GB / 100 GB
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
