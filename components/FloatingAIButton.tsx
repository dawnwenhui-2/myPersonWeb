'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function FloatingAIButton() {
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname() || ''
  
  // Hide on admin and login pages
  const isExcluded = pathname.startsWith('/admin') || pathname.startsWith('/login')

  if (isExcluded) return null

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link href="/ai-agent">
        <motion.div
          className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)',
            boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4), 0 0 40px rgba(56, 189, 248, 0.2)',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(56, 189, 248, 0.4)',
                '0 0 40px rgba(56, 189, 248, 0.6)',
                '0 0 20px rgba(56, 189, 248, 0.4)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Ocean bubbles */}
          <motion.span
            className="absolute text-lg"
            style={{ top: '-8px', right: '2px' }}
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🫧
          </motion.span>
          
          {/* Wave */}
          <motion.span
            className="absolute text-sm"
            style={{ bottom: '-4px', left: '-4px' }}
            animate={{ x: [0, 3, 0], rotate: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌊
          </motion.span>
          
          {/* Main icon */}
          <motion.div
            animate={{ rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <MessageCircle size={28} className="text-white" />
          </motion.div>

          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-sky-300"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </Link>

      {/* Tooltip */}
      <motion.div
        className="absolute right-20 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-slate-800/90 backdrop-blur-sm border border-sky-500/30 whitespace-nowrap"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: 'none' }}
      >
        <span className="text-white text-sm font-medium">AI Assistant</span>
        <span className="text-sky-400 text-xs ml-2">🌊</span>
        <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-slate-800" />
      </motion.div>
    </motion.div>
  )
}