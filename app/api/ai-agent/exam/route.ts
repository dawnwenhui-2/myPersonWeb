/**
 * AI Agent 在线笔试 API
 * POST /api/ai-agent/exam
 * 生成一套笔试题（选择题、简答题等）
 */

import { NextRequest, NextResponse } from 'next/server'
import { chatZhipuSync } from '@/lib/ai-provider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category = 'technical', count = 5 } = body as {
      category: 'technical' | 'behavioral'
      count?: number
    }

    const prompt = `你是一个专业的前端工程师笔试题生成器。请生成 ${count} 道笔试题，类型为${category === 'technical' ? '前端技术题（JS/Vue/React/CSS）' : '软技能题（沟通/协作/职业）'}。

要求：
- 难度适中，包含简单题和中等题
- 单选、多选、简答混合
- 用中文
- 返回 JSON 格式数组：
[
  {
    "id": "q1",
    "type": "single|multiple|open",
    "question": "题目内容",
    "options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],  // 仅单选/多选需要
    "correctAnswer": "正确答案",  // 简答题不需要
    "correctAnswers": ["A", "C"],  // 多选需要数组
    "explanation": "解析",
    "tip": "解题提示"
  }
]
直接返回 JSON 数组，不要有其他文字。`

    const result = await chatZhipuSync({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    })

    let questions
    try {
      questions = JSON.parse(result)
    } catch {
      const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)```/) || result.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        try {
          questions = JSON.parse(jsonMatch[1] || jsonMatch[0])
        } catch {
          return NextResponse.json({ error: 'AI 返回格式解析失败', raw: result }, { status: 500 })
        }
      } else {
        return NextResponse.json({ error: 'AI 返回格式解析失败', raw: result }, { status: 500 })
      }
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: 'AI 返回的不是数组格式', raw: result }, { status: 500 })
    }

    // 去除答案字段后返回（防止作弊）
    const safeQuestions = questions.map((q: Record<string, unknown>, index: number) => ({
      id: `exam-${index + 1}`,
      type: q.type,
      question: q.question,
      options: q.options,
      explanation: q.explanation,
      tip: q.tip,
      // 保存正确答案用于后续评分
      _correctAnswer: q.correctAnswer || q.correctAnswers,
    }))

    return NextResponse.json({ success: true, data: safeQuestions })
  } catch (error) {
    console.error('[AI Exam Error]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器内部错误' },
      { status: 500 }
    )
  }
}
