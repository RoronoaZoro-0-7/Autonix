'use client'

import { motion } from 'framer-motion'
import {
  Zap,
  Layers,
  Bolt,
  Link2,
  Brain,
  Shield,
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Execute workflows in milliseconds with our optimized engine',
    color: '#6366F1',
  },
  {
    icon: Layers,
    title: 'Visual Builder',
    description: 'Drag-and-drop interface to create complex automation flows',
    color: '#10B981',
  },
  {
    icon: Bolt,
    title: 'Instant Triggers',
    description: 'Webhooks, schedules, and real-time event-based triggers',
    color: '#F59E0B',
  },
  {
    icon: Link2,
    title: 'API Integrations',
    description: 'Connect to 100+ services and tools seamlessly',
    color: '#3B82F6',
  },
  {
    icon: Brain,
    title: 'AI-Powered',
    description: 'Leverage Groq LLM for intelligent workflow automation',
    color: '#8B5CF6',
  },
  {
    icon: Shield,
    title: 'Enterprise Grade',
    description: 'Bank-level security with full audit logs and compliance',
    color: '#EC4899',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-[#0D0D0D]" style={{ borderTop: '1px solid #1F1F1F' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span 
            style={{
              background: 'rgba(99,102,241,0.12)',
              color: '#818CF8',
              border: '1px solid rgba(99,102,241,0.2)',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '16px',
            }}
          >
            FEATURES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#fafafa] mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-[#a1a1a1]">
            Everything you need to automate and scale your workflows
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
              style={{
                background: '#111111',
                border: '1px solid #1F1F1F',
                borderRadius: '8px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `rgba(99,102,241,0.3)`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1F1F1F';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div 
                  style={{
                    width: '36px',
                    height: '36px',
                    background: '#1A1A1A',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: feature.color,
                  }}
                >
                  <feature.icon size={20} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#fafafa] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#a1a1a1] text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
