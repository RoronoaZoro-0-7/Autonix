'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[#262626] bg-[#0d0d0d] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 pb-12 border-b border-[#262626]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={24} className="text-[#6366f1]" />
              <span className="text-lg font-bold text-[#fafafa]">Autonix</span>
            </div>
            <p className="text-[#a1a1a1] text-sm leading-relaxed">
              Enterprise workflow automation platform for modern teams
            </p>
          </div>

          <div>
            <h5 className="text-[#fafafa] font-semibold mb-4 text-sm uppercase tracking-wide">Product</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[#fafafa] font-semibold mb-4 text-sm uppercase tracking-wide">Company</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[#fafafa] font-semibold mb-4 text-sm uppercase tracking-wide">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8">
          <p className="text-[#525252] text-sm">&copy; 2024 Autonix. All rights reserved.</p>
          <p className="text-[#525252] text-sm mt-4 md:mt-0">Made with care for teams that build</p>
        </div>
      </div>
    </footer>
  )
}
