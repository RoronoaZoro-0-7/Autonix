'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface Execution {
  id: string
  workflowName: string
  status: 'success' | 'failed' | 'running'
  duration: string
  timestamp: string
}

const executions: Execution[] = [
  {
    id: '1',
    workflowName: 'Email Campaign Sender',
    status: 'success',
    duration: '2.3s',
    timestamp: '5 mins ago',
  },
  {
    id: '2',
    workflowName: 'Slack Notifications',
    status: 'success',
    duration: '0.8s',
    timestamp: '12 mins ago',
  },
  {
    id: '3',
    workflowName: 'Data Sync to CRM',
    status: 'failed',
    duration: '5.2s',
    timestamp: '23 mins ago',
  },
  {
    id: '4',
    workflowName: 'Report Generation',
    status: 'running',
    duration: '-',
    timestamp: 'Just now',
  },
  {
    id: '5',
    workflowName: 'Webhook Handler',
    status: 'success',
    duration: '1.1s',
    timestamp: '1 hour ago',
  },
]

const statusConfig = {
  success: { icon: CheckCircle, color: 'text-[#22c55e]', bg: 'bg-[#22c55e]/10' },
  failed: { icon: XCircle, color: 'text-[#ef4444]', bg: 'bg-[#ef4444]/10' },
  running: { icon: Clock, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
}

export function RecentExecutions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-dark p-6"
    >
      <h3 className="text-lg font-semibold text-[#fafafa] mb-6">Recent Executions</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626]">
              <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Workflow</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Duration</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Time</th>
            </tr>
          </thead>
          <tbody>
            {executions.map((execution, index) => {
              const statusInfo = statusConfig[execution.status]
              const Icon = statusInfo.icon
              return (
                <motion.tr
                  key={execution.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-[#262626] hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-[#fafafa]">
                    {execution.workflowName}
                  </td>
                  <td className="py-4 px-4">
                    <div className={`flex items-center gap-2 w-fit px-3 py-1 rounded ${statusInfo.bg}`}>
                      <Icon size={16} className={statusInfo.color} />
                      <span className={`text-sm font-medium ${statusInfo.color} capitalize`}>
                        {execution.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-[#a1a1a1]">
                    {execution.duration}
                  </td>
                  <td className="py-4 px-4 text-sm text-[#a1a1a1]">
                    {execution.timestamp}
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center">
        <a href="/dashboard/executions" className="text-sm text-[#6366f1] hover:text-[#4f46e5] transition-colors">
          View all executions →
        </a>
      </div>
    </motion.div>
  )
}
