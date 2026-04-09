import type { Metadata } from 'next'
import './globals.css'
import FloatingAIButton from '@/components/FloatingAIButton'

export const metadata: Metadata = {
  title: 'dawnwenhui - AI前端架构师',
  description: '专注于 Vue/React/TypeScript/AI大模型 的前端开发者个人网站',
  keywords: '前端开发, Vue, React, TypeScript, AI, 大模型, 面试, 性能优化',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased">
        {children}
        <FloatingAIButton />
      </body>
    </html>
  )
}
