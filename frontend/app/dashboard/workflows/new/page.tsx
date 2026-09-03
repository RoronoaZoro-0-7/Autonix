'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Plus, Save, Rocket } from 'lucide-react'

const nodeCategories = [
  {
    name: 'Triggers',
    nodes: ['Webhook', 'Schedule', 'Manual'],
  },
  {
    name: 'Actions',
    nodes: ['HTTP Request', 'Slack Message', 'Send Email', 'Gmail'],
  },
  {
    name: 'Logic',
    nodes: ['Conditional', 'Loop', 'Delay'],
  },
  {
    name: 'AI',
    nodes: ['Groq LLM', 'Text Analysis'],
  },
  {
    name: 'Data',
    nodes: ['Transform', 'Filter', 'Sort'],
  },
]

export default function WorkflowBuilderPage() {
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [isEditing, setIsEditing] = useState(false)
  const [nodes, setNodes] = useState(['Webhook'])

  const addNode = (nodeName: string) => {
    setNodes([...nodes, nodeName])
  }

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top Bar */}
      <div className="h-16 border-b border-[#262626] bg-[#0a0a0a] flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4 flex-1">
          {/* Breadcrumb */}
          <div className="text-sm text-[#a1a1a1]">
            Workflows / {' '}
            {isEditing ? (
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="input-dark inline-block w-48"
              />
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[#6366f1] hover:text-[#4f46e5] transition-colors"
              >
                {workflowName}
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="button-ghost inline-flex items-center gap-2">
            <Save size={18} />
            Save
          </button>
          <button className="button-primary inline-flex items-center gap-2">
            <Rocket size={18} />
            Publish
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-64 border-r border-[#262626] bg-[#0d0d0d] overflow-y-auto flex flex-col"
        >
          <div className="p-4 border-b border-[#262626]">
            <h3 className="font-semibold text-[#fafafa] text-sm">Nodes</h3>
            <p className="text-xs text-[#a1a1a1]">Drag to canvas or click to add</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {nodeCategories.map((category, idx) => (
              <div key={idx} className="border-b border-[#262626]">
                <details className="p-4 group">
                  <summary className="cursor-pointer font-medium text-sm text-[#fafafa] flex items-center justify-between">
                    {category.name}
                    <ChevronDown size={16} className="group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="mt-3 space-y-2">
                    {category.nodes.map((node) => (
                      <button
                        key={node}
                        onClick={() => addNode(node)}
                        className="w-full text-left px-3 py-2 rounded text-sm text-[#a1a1a1] hover:bg-[#1a1a1a] hover:text-[#fafafa] transition-colors"
                      >
                        <Plus size={14} className="inline mr-2" />
                        {node}
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Center - Canvas */}
        <div className="flex-1 bg-[#0a0a0a] dot-grid relative overflow-auto flex flex-col items-center justify-start py-8 px-8">
          <div className="max-w-2xl w-full space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              <p className="text-[#a1a1a1] text-sm">Workflow nodes added: {nodes.length}</p>
            </motion.div>

            {/* Node Flow Visualization */}
            {nodes.map((node, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="card-dark px-6 py-4 w-full text-center">
                  <p className="text-sm font-medium text-[#fafafa]">{node}</p>
                  <p className="text-xs text-[#a1a1a1] mt-1">Node {idx + 1}</p>
                </div>
                {idx < nodes.length - 1 && (
                  <div className="h-6 w-1 bg-[#6366f1] my-2" />
                )}
              </motion.div>
            ))}

            {nodes.length < 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center py-8"
              >
                <p className="text-[#a1a1a1] text-sm mb-4">
                  Add nodes from the left panel to build your workflow
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Node Config */}
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-72 border-l border-[#262626] bg-[#0d0d0d] overflow-y-auto flex flex-col"
        >
          <div className="p-4 border-b border-[#262626]">
            <h3 className="font-semibold text-[#fafafa] text-sm">Configuration</h3>
            <p className="text-xs text-[#a1a1a1]">Select a node to configure</p>
          </div>

          <div className="flex-1 p-4">
            <div className="card-dark p-4 text-center">
              <p className="text-sm text-[#a1a1a1]">
                No node selected
              </p>
              <p className="text-xs text-[#525252] mt-2">
                Click on a node in the canvas to configure it
              </p>
            </div>

            {nodes.length > 0 && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#fafafa] mb-2">
                    Node Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter node name"
                    className="input-dark w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#fafafa] mb-2">
                    Configuration
                  </label>
                  <textarea
                    placeholder="Node configuration..."
                    className="input-dark w-full text-sm h-32 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
