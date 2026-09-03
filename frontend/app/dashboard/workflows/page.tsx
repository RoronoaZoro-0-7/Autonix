'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard/layout'
import { MoreVertical, Plus, CheckCircle, AlertCircle, Power } from 'lucide-react'
import Link from 'next/link'

interface Workflow {
  id: string
  name: string
  trigger: string
  status: 'active' | 'inactive'
  lastRun: string
  successRate: number
}

const workflows: Workflow[] = [
  {
    id: '1',
    name: 'Email Campaign Sender',
    trigger: 'Webhook',
    status: 'active',
    lastRun: '2 mins ago',
    successRate: 99,
  },
  {
    id: '2',
    name: 'Slack Daily Digest',
    trigger: 'Schedule',
    status: 'active',
    lastRun: '1 hour ago',
    successRate: 100,
  },
  {
    id: '3',
    name: 'CRM Data Sync',
    trigger: 'HTTP',
    status: 'active',
    lastRun: '5 mins ago',
    successRate: 98,
  },
  {
    id: '4',
    name: 'Inactive Workflow',
    trigger: 'Manual',
    status: 'inactive',
    lastRun: '3 days ago',
    successRate: 95,
  },
  {
    id: '5',
    name: 'PDF Report Generator',
    trigger: 'Schedule',
    status: 'active',
    lastRun: 'Just now',
    successRate: 97,
  },
]

export default function WorkflowsPage() {
  const [isEmptyState, setIsEmptyState] = useState(false)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#fafafa]">Workflows</h1>
            <p className="text-[#a1a1a1]">Manage and monitor your automated workflows</p>
          </div>
          <Link
            href="/dashboard/workflows/new"
            className="button-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            New Workflow
          </Link>
        </div>

        {/* Workflows Table */}
        {!isEmptyState ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-dark p-6"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#262626]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Trigger</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Last Run</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Success Rate</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#a1a1a1]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workflows.map((workflow, index) => (
                    <motion.tr
                      key={workflow.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-[#262626] hover:bg-[#1a1a1a] transition-colors"
                    >
                      <td className="py-4 px-4">
                        <Link
                          href={`/dashboard/workflows/${workflow.id}`}
                          className="text-sm text-[#6366f1] hover:text-[#4f46e5] transition-colors font-medium"
                        >
                          {workflow.name}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#a1a1a1]">
                        <span className="px-2 py-1 rounded bg-[#1a1a1a] text-xs">
                          {workflow.trigger}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            className={`p-1.5 rounded transition-colors ${
                              workflow.status === 'active'
                                ? 'bg-[#22c55e]/10 text-[#22c55e]'
                                : 'bg-[#525252]/10 text-[#525252]'
                            }`}
                          >
                            <Power size={16} />
                          </button>
                          <span className="text-sm text-[#a1a1a1] capitalize">
                            {workflow.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#a1a1a1]">
                        {workflow.lastRun}
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#6366f1] h-full transition-all rounded-full"
                            style={{ width: `${workflow.successRate}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#a1a1a1]">{workflow.successRate}%</span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="p-2 hover:bg-[#1a1a1a] rounded transition-colors text-[#a1a1a1] hover:text-[#fafafa]">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-dark p-12 text-center"
          >
            <Workflow size={48} className="text-[#525252] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#fafafa] mb-2">No workflows yet</h3>
            <p className="text-[#a1a1a1] mb-6">
              Create your first workflow to get started with automation
            </p>
            <Link
              href="/dashboard/workflows/new"
              className="button-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Workflow
            </Link>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
