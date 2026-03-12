import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

interface SlackPostMessageResponse {
  ok: boolean
  ts?: string
  error?: string
}

export const postSlackTool = createTool({
  id: 'post-slack',
  description: 'Slack にメッセージを投稿する。threadTs を指定するとスレッド返信になる',
  inputSchema: z.object({
    text: z.string().describe('投稿するメッセージ本文'),
    threadTs: z
      .string()
      .optional()
      .describe('スレッド返信にする場合、親メッセージのタイムスタンプ'),
  }),
  outputSchema: z.object({
    ts: z.string().describe('投稿したメッセージのタイムスタンプ'),
  }),
  execute: async ({ text, threadTs }) => {
    const token = process.env.SLACK_BOT_TOKEN
    const channel = process.env.SLACK_CHANNEL_ID

    if (!token || !channel) {
      throw new Error('SLACK_BOT_TOKEN または SLACK_CHANNEL_ID が設定されていません')
    }

    const body: Record<string, string | boolean> = {
      channel,
      text,
      unfurl_links: false,
      unfurl_media: false,
    }
    if (threadTs) {
      body['thread_ts'] = threadTs
    }

    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = (await response.json()) as SlackPostMessageResponse

    if (!data.ok) {
      throw new Error(`Slack API エラー: ${data.error}`)
    }

    return { ts: data.ts! }
  },
})
