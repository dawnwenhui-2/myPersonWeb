/**
 * AI Agent 通用对话 API（流式 SSE）
 * POST /api/ai-agent/chat
 */

import { NextRequest, NextResponse } from 'next/server'
import { chatZhipu, Message } from '@/lib/ai-provider'

// 系统提示词
const SYSTEM_PROMPT = `你是任文辉的 AI 面试助手，名字叫"小蓝鱼" 🐙，性格友好、专业、有点幽默。

你可以帮助用户：
1. 💬 回答前端技术问题（Vue/React/TypeScript/JavaScript/CSS/Node.js）
2. 🎯 模拟面试问答
3. 📝 代码review和优化建议
4. 📖 解释技术概念和原理
5. 💡 提供职业发展建议

回答风格：
- 专业技术准确
- 举例子、画图解（用文字）
- 代码块要完整可运行
- 适当用 emoji 增加趣味
- 遇到不确定的问题，诚实说不知道

当前时间：2026年4月16日`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, temperature = 0.7 } = body as {
      messages: Message[]
      temperature?: number
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages 不能为空' }, { status: 400 })
    }

    // 构建完整消息列表（插入系统提示）
    const allMessages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ]

    // 创建流式响应
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await chatZhipu({
            messages: allMessages,
            temperature,
            stream: true,
            onChunk: (text) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: text })}\n\n`))
            },
            onComplete: () => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
              controller.close()
            },
            onError: (error) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`))
              controller.close()
            },
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : '未知错误'
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('[AI Chat Error]', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
