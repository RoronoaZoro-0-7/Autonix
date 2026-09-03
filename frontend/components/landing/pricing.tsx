'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      'Up to 100 executions/month',
      '5 active workflows',
      'Basic integrations',
      'Community support',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For growing teams',
    features: [
      'Unlimited executions',
      'Unlimited workflows',
      '100+ integrations',
      'Priority support',
      'Advanced analytics',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale operations',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'Advanced security',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    href: '/contact',
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 bg-[#080808]" style={{ borderTop: '1px solid #1F1F1F' }}>
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
            PRICING
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#fafafa] mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-[#a1a1a1]">
            Choose the plan that fits your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="bg-[#6366f1] text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}
              <div
                className={`p-8 flex flex-col border transition-all ${
                  plan.highlighted
                    ? 'shadow-lg shadow-[#6366f1]/20 transform md:scale-105'
                    : ''
                }`}
                style={{
                  background: '#111111',
                  borderColor: '#1F1F1F',
                  borderRadius: '8px',
                }}
              >
                <h3 className="text-2xl font-bold text-[#fafafa] mb-2">
                  {plan.name}
                </h3>
                <p className="text-[#a1a1a1] text-sm mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-[#fafafa]">
                    {plan.price}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className="text-[#a1a1a1] ml-2">/month</span>
                  )}
                </div>

                <Link
                  href={plan.href}
                  className={`w-full py-2 px-4 rounded font-medium mb-8 transition-colors text-center ${
                    plan.highlighted
                      ? 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
                      : 'border border-[#262626] text-[#fafafa] hover:bg-[#1a1a1a]'
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check size={20} className="text-[#22c55e] flex-shrink-0 mt-0.5" />
                      <span className="text-[#a1a1a1]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
