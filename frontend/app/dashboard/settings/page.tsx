'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Copy, Trash2, Eye, EyeOff, Plus, Check } from 'lucide-react'

interface TabContent {
  id: string
  label: string
}

const tabs: TabContent[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'organization', label: 'Organization' },
  { id: 'members', label: 'Members' },
  { id: 'apikeys', label: 'API Keys' },
  { id: 'billing', label: 'Billing' },
]

const apiKeys = [
  {
    id: 1,
    name: 'Production API Key',
    key: 'sk_live_************************************XyZ1',
    created: '2024-01-10',
    lastUsed: '2024-01-15',
  },
  {
    id: 2,
    name: 'Development API Key',
    key: 'sk_test_************************************qwE2',
    created: '2024-01-05',
    lastUsed: '2024-01-14',
  },
]

const members = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Owner' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [visibleKeys, setVisibleKeys] = useState<number[]>([])

  const toggleKeyVisibility = (keyId: number) => {
    setVisibleKeys(prev =>
      prev.includes(keyId) ? prev.filter(k => k !== keyId) : [...prev, keyId]
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#fafafa] mb-2">Settings</h1>
          <p className="text-[#a1a1a1]">Manage your account and workspace settings</p>
        </div>

        {/* Tabs */}
        <div className="card-dark mb-6">
          <div className="flex border-b border-[#262626] overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#6366f1] border-b-2 border-[#6366f1]'
                    : 'text-[#a1a1a1] hover:text-[#fafafa]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="card-dark p-6">
                <h3 className="text-lg font-semibold text-[#fafafa] mb-6">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#fafafa] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="input-dark w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#fafafa] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="input-dark w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#fafafa] mb-2">
                      Avatar
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#6366f1] flex items-center justify-center text-[#fafafa] font-bold">
                        JD
                      </div>
                      <button className="button-ghost text-sm">
                        Change Avatar
                      </button>
                    </div>
                  </div>
                  <button className="button-primary">
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="card-dark p-6">
                <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Password & Security</h3>
                <button className="button-ghost">
                  Change Password
                </button>
              </div>
            </div>
          )}

          {/* Organization Tab */}
          {activeTab === 'organization' && (
            <div className="card-dark p-6">
              <h3 className="text-lg font-semibold text-[#fafafa] mb-6">Organization Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#fafafa] mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Acme Corp"
                    className="input-dark w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#fafafa] mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    defaultValue="https://acmecorp.com"
                    className="input-dark w-full"
                  />
                </div>
                <button className="button-primary">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="card-dark p-6">
                <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Invite Members</h3>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="member@example.com"
                    className="input-dark flex-1"
                  />
                  <select className="input-dark px-4">
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                  <button className="button-primary inline-flex items-center gap-2">
                    <Plus size={18} />
                    Invite
                  </button>
                </div>
              </div>

              <div className="card-dark overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#262626] bg-[#0d0d0d]">
                      <th className="text-left py-3 px-6 text-sm font-medium text-[#a1a1a1]">Name</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-[#a1a1a1]">Email</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-[#a1a1a1]">Role</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-[#a1a1a1]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr key={member.id} className="border-b border-[#262626] hover:bg-[#1a1a1a]">
                        <td className="py-4 px-6 text-sm text-[#fafafa]">{member.name}</td>
                        <td className="py-4 px-6 text-sm text-[#a1a1a1]">{member.email}</td>
                        <td className="py-4 px-6">
                          <select
                            disabled={member.role === 'Owner'}
                            className="bg-[#1a1a1a] border border-[#262626] text-[#fafafa] text-sm px-2 py-1 rounded disabled:opacity-50"
                          >
                            <option>{member.role}</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <button className="text-[#ef4444] hover:text-[#c53030] transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'apikeys' && (
            <div className="space-y-6">
              <div className="card-dark p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#fafafa]">API Keys</h3>
                  <button className="button-primary inline-flex items-center gap-2 text-sm">
                    <Plus size={18} />
                    Create Key
                  </button>
                </div>

                <div className="space-y-4">
                  {apiKeys.map(apiKey => (
                    <div key={apiKey.id} className="bg-[#0d0d0d] border border-[#262626] rounded p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-[#fafafa]">{apiKey.name}</p>
                          <p className="text-xs text-[#a1a1a1]">Created {apiKey.created}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-[#1a1a1a] text-[#a1a1a1]">
                          Active
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <code className="flex-1 bg-[#111111] px-3 py-2 rounded text-sm text-[#a1a1a1] font-mono">
                          {visibleKeys.includes(apiKey.id)
                            ? apiKey.key.replace(/\*/g, 'x')
                            : apiKey.key}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="p-2 hover:bg-[#1a1a1a] rounded transition-colors text-[#a1a1a1]"
                        >
                          {visibleKeys.includes(apiKey.id) ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                        <button className="p-2 hover:bg-[#1a1a1a] rounded transition-colors text-[#a1a1a1]">
                          <Copy size={18} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#a1a1a1]">
                          Last used: {apiKey.lastUsed}
                        </span>
                        <button className="text-[#ef4444] hover:text-[#c53030] transition-colors">
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="card-dark p-6">
                <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Current Plan</h3>
                <div className="mb-6">
                  <p className="text-2xl font-bold text-[#fafafa]">Pro Plan</p>
                  <p className="text-[#a1a1a1]">$49/month</p>
                </div>
                <button className="button-ghost">
                  Manage Plan
                </button>
              </div>

              <div className="card-dark p-6">
                <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Billing History</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-[#262626]">
                      <div>
                        <p className="text-sm font-medium text-[#fafafa]">Pro Plan - Monthly Subscription</p>
                        <p className="text-xs text-[#a1a1a1]">January {i}, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#fafafa]">$49.00</p>
                        <button className="text-xs text-[#6366f1] hover:text-[#4f46e5]">
                          Download Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
