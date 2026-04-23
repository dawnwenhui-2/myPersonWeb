/**
 * 智谱 GLM AI Provider
 * 支持流式输出 (SSE)
 */

const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatOptions {
  messages: Message[]
  model?: string
  temperature?: number
  max_tokens?: number
  stream?: boolean
  onChunk?: (text: string) => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

/**
 * 流式调用智谱 GLM
 */
export async function chatZhipu(options: ChatOptions): Promise<string> {
  const {
    messages,
    model = process.env.ZHIPU_MODEL || 'glm-4-flash',
    temperature = 0.7,
    max_tokens = 2048,
    stream = true,
    onChunk,
    onComplete,
    onError,
  } = options

  const apiKey = process.env.ZHIPU_API_KEY
  if (!apiKey) {
    throw new Error('ZHIPU_API_KEY 未配置')
  }

  // 构建请求体
  const requestBody: Record<string, unknown> = {
    model,
    messages,
    temperature,
    max_tokens,
    stream,
  }

  try {
    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`智谱 API 错误: ${response.status} - ${errorText}`)
    }

    if (stream && response.body) {
      // 流式读取
      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let fullContent = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data:')) continue
          if (trimmed === 'data: [DONE]') continue

          const data = trimmed.slice(5).trim()
          if (!data) continue

          try {
            const json = JSON.parse(data)
            const delta = json.choices?.[0]?.delta?.content
            if (delta) {
              fullContent += delta
              onChunk?.(delta)
            }
          } catch {
            // 忽略解析错误
          }
        }
      }

      onComplete?.()
      return fullContent
    } else {
      // 非流式
      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || ''
      onComplete?.()
      return content
    }
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error(String(err)))
    throw err
  }
}

/**
 * 非流式调用（用于面试出题等简单场景）
 */
export async function chatZhipuSync(options: Omit<ChatOptions, 'stream' | 'onChunk'>): Promise<string> {
  return chatZhipu({ ...options, stream: false })
}
