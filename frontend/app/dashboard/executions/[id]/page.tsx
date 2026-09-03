'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard/layout'
import { CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react'
import { useParams } from 'next/navigation'

const executionData = {
  id: 'exec-123',
  workflowName: 'Email Campaign Sender',
  status: 'success',
  duration: '5.2s',
  startTime: '2024-01-15 14:32:45',
  endTime: '2024-01-15 14:32:50',
  nodes: [
    {
      id: 1,
      name: 'Webhook Trigger',
      type: 'trigger',
      status: 'completed',
      duration: '0.1s',
      logs: ['✓ Webhook received', '✓ Payload validated'],
    },
    {
      id: 2,
      name: 'Transform Data',
      type: 'transform',
      status: 'completed',
      duration: '0.3s',
      logs: ['✓ Data transformation applied', '✓ Mapped 15 fields'],
    },
    {
      id: 3,
      name: 'Send Email',
      type: 'action',
      status: 'completed',
      duration: '3.8s',
      logs: ['✓ Email queued', '✓ Recipients: 250', '✓ Sent successfully'],
    },
    {
      id: 4,
      name: 'Log Result',
      type: 'action',
      status: 'completed',
      duration: '1.0s',
      logs: ['✓ Result logged to database', '✓ Analytics updated'],
    },
  ],
}

const statusConfig = {
  success: { icon: CheckCircle, color: 'text-[#22c55e]', bg: 'bg-[#22c55e]/10' },
  failed: { icon: XCircle, color: 'text-[#ef4444]', bg: 'bg-[#ef4444]/10' },
  running: { icon: Clock, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
}

export default function ExecutionDetailsPage() {
  const params = useParams()
  const [expandedNode, setExpandedNode] = useState<number | null>(0)
  const [showLogs, setShowLogs] = useState(true)

  const statusInfo = statusConfig[executionData.status as keyof typeof statusConfig]
  const Icon = statusInfo.icon

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card-dark p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#fafafa]">
                {executionData.workflowName}
              </h1>
              <p className="text-[#a1a1a1] text-sm mt-1">
                Execution ID: {executionData.id}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusInfo.bg}`}>
              <Icon size={20} className={statusInfo.color} />
              <span className={`font-medium capitalize ${statusInfo.color}`}>
                {executionData.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#262626]">
            <div>
              <p className="text-xs text-[#a1a1a1] mb-1">Duration</p>
              <p className="text-lg font-semibold text-[#fafafa]">{executionData.duration}</p>
            </div>
            <div>
              <p className="text-xs text-[#a1a1a1] mb-1">Started</p>
              <p className="text-sm font-semibold text-[#fafafa]">{executionData.startTime}</p>
            </div>
            <div>
              <p className="text-xs text-[#a1a1a1] mb-1">Ended</p>
              <p className="text-sm font-semibold text-[#fafafa]">{executionData.endTime}</p>
            </div>
          </div>
        </motion.div>

        {/* Execution Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-dark p-6"
        >
          <h2 className="text-lg font-semibold text-[#fafafa] mb-6">Execution Timeline</h2>

          <div className="space-y-4">
            {executionData.nodes.map((node, index) => {
              const nodeStatusInfo = statusConfig[node.status as keyof typeof statusConfig]
              const NodeIcon = nodeStatusInfo.icon
              const isExpanded = expandedNode === index

              return (
                <motion.div key={node.id} layout>
                  <button
                    onClick={() => setExpandedNode(isExpanded ? null : index)}
                    className="w-full"
                  >
                    <div className={`card-dark p-4 flex items-center justify-between hover:border-[#4f46e5] transition-colors`}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${nodeStatusInfo.bg} flex items-center justify-center`}>
                          <NodeIcon size={20} className={nodeStatusInfo.color} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-[#fafafa]">{node.name}</p>
                          <p className="text-sm text-[#a1a1a1]">
                            {node.type} • {node.duration}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-[#a1a1a1] transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#111111] border border-t-0 border-[#262626] p-4 space-y-2 mt-0"
                    >
                      {node.logs.map((log, logIdx) => (
                        <div key={logIdx} className="flex items-start gap-3 font-mono text-sm">
                          <span className="text-[#6366f1] flex-shrink-0">›</span>
                          <span className="text-[#a1a1a1]">{log}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Logs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-dark p-6"
        >
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center justify-between w-full mb-4"
          >
            <h2 className="text-lg font-semibold text-[#fafafa]">Full Logs</h2>
            <ChevronDown
              size={20}
              className={`text-[#a1a1a1] transition-transform ${
                showLogs ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showLogs && (
            <div className="bg-[#0a0a0a] border border-[#262626] rounded p-4 max-h-96 overflow-y-auto font-mono text-sm space-y-1">
              <div className="text-[#22c55e]">[14:32:45.000] INFO: Workflow execution started</div>
              <div className="text-[#a1a1a1]">[14:32:45.100] DEBUG: Webhook payload received</div>
              <div className="text-[#a1a1a1]">[14:32:45.200] DEBUG: Validating payload schema</div>
              <div className="text-[#22c55e]">[14:32:45.300] SUCCESS: Payload validation passed</div>
              <div className="text-[#a1a1a1]">[14:32:45.400] DEBUG: Starting data transformation</div>
              <div className="text-[#22c55e]">[14:32:45.700] SUCCESS: Data transformation completed</div>
              <div className="text-[#a1a1a1]">[14:32:45.800] DEBUG: Preparing email payload</div>
              <div className="text-[#a1a1a1]">[14:32:46.000] DEBUG: Connecting to email service</div>
              <div className="text-[#22c55e]">[14:32:49.800] SUCCESS: Email sent to 250 recipients</div>
              <div className="text-[#a1a1a1]">[14:32:49.900] DEBUG: Logging execution result</div>
              <div className="text-[#22c55e]">[14:32:50.000] SUCCESS: Workflow execution completed</div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
