/**
 * AI Agent 模拟面试 API
 * POST /api/ai-agent/interview
 * 根据用户选择的方向，由 AI 智能出题
 */

import { NextRequest, NextResponse } from 'next/server'
import { chatZhipuSync } from '@/lib/ai-provider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, difficulty = 'medium' } = body as {
      type: 'behavioral' | 'technical' | 'system-design' | 'coding'
      difficulty?: 'easy' | 'medium' | 'hard'
    }

    if (!type) {
      return NextResponse.json({ error: '缺少 type 参数' }, { status: 400 })
    }

    const prompts: Record<string, string> = {
      behavioral: `你是一个专业的前端工程师面试官。请出一道行为面试题，难度为${difficulty}。

要求：
- 不要出编程题，重点考察沟通表达、职业规划、团队协作
- 用中文
- 只返回 JSON，格式如下，不要有任何其他文字：
{"question":"题目","tips":["提示1","提示2"],"goodAnswer":"好的回答示例","badAnswer":"差的回答示例","category":"behavioral"}`,

      technical: `你是一个专业的前端工程师面试官。请出一道技术面试题，难度为${difficulty}。

要求：
- 重点考察：Vue3/React/TypeScript/JavaScript/CSS 中的一个
- 结合实际项目经验
- 用中文
- 只返回 JSON，格式如下，不要有任何其他文字：
{"question":"题目","tips":["提示1","提示2"],"goodAnswer":"好的回答示例","badAnswer":"差的回答示例","category":"technical","keywords":["关键词1"]}`,

      'system-design': `你是一个专业的前端架构师面试官。请出一道系统设计面试题，难度为${difficulty}。

要求：
- 设计一个实际的前端系统或架构问题
- 用中文
- 只返回 JSON，格式如下，不要有任何其他文字：
{"question":"题目","tips":["提示1","提示2"],"goodAnswer":"好的回答示例","badAnswer":"差的回答示例","category":"system-design"}`,

      coding: `你是一个专业的前端工程师面试官。请出一道代码面试题，难度为${difficulty}。

要求：
- 手写实现类题目：防抖、节流、深拷贝、数组扁平化、Promise.all 等
- 用中文
- 只返回 JSON，格式如下，不要有任何其他文字：
{"question":"题目（包含代码要求）","tips":["提示1"],"goodAnswer":"完整代码答案","badAnswer":"常见错误示例","category":"coding"}`,
    }

    const prompt = prompts[type]
    if (!prompt) {
      return NextResponse.json({ error: '无效的面试类型' }, { status: 400 })
    }

    const result = await chatZhipuSync({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 2048,
    })

    // 解析 JSON - 多种尝试
    let question: Record<string, unknown> | null = null

    // 方法1: 尝试直接解析
    try {
      question = JSON.parse(result)
    } catch {
      // 方法2: 从 markdown 代码块中提取
      const codeBlockMatch = result.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlockMatch) {
        try {
          question = JSON.parse(codeBlockMatch[1].trim())
        } catch {
          // 继续尝试方法3
        }
      }

      // 方法3: 找到第一个 { 和最后一个 }
      if (!question) {
        const firstBrace = result.indexOf('{')
        const lastBrace = result.lastIndexOf('}')
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const jsonCandidate = result.substring(firstBrace, lastBrace + 1)
          try {
            question = JSON.parse(jsonCandidate)
          } catch {
            // 继续
          }
        }
      }
    }

    if (!question) {
      console.error('[AI Interview] Parse failed. Raw response:', result.substring(0, 1000))
      return NextResponse.json({
        error: 'AI 返回格式解析失败',
        debug: {
          rawLength: result.length,
          rawPreview: result.substring(0, 300),
        }
      }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: question })
  } catch (error) {
    console.error('[AI Interview Error]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器内部错误' },
      { status: 500 }
    )
  }
}
