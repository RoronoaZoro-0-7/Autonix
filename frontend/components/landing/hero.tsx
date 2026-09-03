'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#262626]" style={{
        backgroundColor: 'rgba(8, 8, 8, 0.8)',
        backdropFilter: 'blur(12px)',
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={24} className="text-[#6366f1]" />
            <span className="text-xl font-bold text-[#fafafa]">Autonix</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">Features</a>
            <a href="#pricing" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">Pricing</a>
            <a href="#docs" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">
              Login
            </Link>
            <Link href="/auth/signup" className="button-primary inline-flex items-center gap-2 px-4 py-2">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section 
        className="relative min-h-screen overflow-hidden flex items-center justify-center pt-32 pb-20"
        style={{
          background: 
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 70%), linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
          backgroundSize: 'auto, 32px 32px, 32px 32px',
          backgroundColor: '#080808',
        }}
      >
        
        {/* Animated light rays effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
            animate={{
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
            animate={{
              y: [0, 50, 0],
            }}
            transition={{
              duration: 8,
              delay: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-[#fafafa] mb-6 leading-tight tracking-tight">
              Ship Automations That Scale
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xl md:text-2xl text-[#a1a1a1] mb-8 leading-relaxed max-w-2xl mx-auto">
              Connect any API, trigger any action, monitor every execution — built for engineering teams that move fast.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 justify-center flex-wrap mb-12"
          >
            <Link
              href="/auth/signup"
              className="button-primary inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={20} />
            </Link>
            <Link
              href="#features"
              className="button-ghost inline-flex items-center gap-2"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Integration pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
            <span style={{ color: '#525252', fontSize: '13px' }}>Works with</span>
            {['Slack', 'Gmail', 'Notion', 'GitHub', 'HTTP', 'MCP'].map((name) => (
              <span 
                key={name}
                style={{ 
                  background: '#161616', 
                  border: '1px solid #262626', 
                  color: '#A1A1A1', 
                  padding: '3px 10px', 
                  borderRadius: '999px', 
                  fontSize: '12px' 
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
