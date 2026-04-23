'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import dynamic from 'next/dynamic'
const OceanEffects = dynamic(() => import('@/components/OceanEffects'), { ssr: false })
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise(resolve => setTimeout(resolve, 800))

    const storedCreds = localStorage.getItem('admin_credentials')
    const defaultCreds = { username: 'admin', password: 'dawnwenhui2026' }
    const creds = storedCreds ? JSON.parse(storedCreds) : defaultCreds

    if (username === creds.username && password === creds.password) {
      sessionStorage.setItem('admin_logged_in', 'true')
      sessionStorage.setItem('admin_user', username)
      router.push('/admin')
    } else {
      setError('Invalid username or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: 'linear-gradient(180deg, #0a1929 0%, #0d2137 100%)' }}>
      <OceanEffects />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <svg width="48" height="48" viewBox="0 0 36 36">
              <path d="M4,20 Q10,12 18,18 Q26,24 32,16" stroke="#38bdf8" strokeWidth="3" fill="none"/>
              <path d="M4,26 Q12,18 18,24 Q28,32 32,24" stroke="#0ea5e9" strokeWidth="2.5" fill="none"/>
              <path d="M6,30 Q14,24 20,28 Q28,34 30,28" stroke="#7dd3fc" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-sky-500/20">
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          <a href="/" className="text-sky-400 hover:text-sky-300">Back to Home</a>
        </p>

        <p className="text-center text-gray-600 text-xs mt-4">
          Default: admin / dawnwenhui2026
        </p>
      </motion.div>
    </div>
  )
}
