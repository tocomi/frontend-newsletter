import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import RssParser from 'rss-parser'

type CustomFeed = Record<string, never>
type CustomItem = { 'content:encoded': string }

const parser = new RssParser<CustomFeed, CustomItem>({
  customFields: {
    item: ['content:encoded'],
  },
})

const RSS_FEEDS = {
  'javascript-weekly': 'https://javascriptweekly.com/rss/',
  'this-week-in-react': 'https://thisweekinreact.com/newsletter/rss.xml',
} as const

export const fetchNewsletterTool = createTool({
  id: 'fetch-newsletter',
  description:
    'ニュースレターの最新号を RSS フィードから取得し、タイトル・URL・本文を返す',
  inputSchema: z.object({
    source: z
      .enum(['javascript-weekly', 'this-week-in-react'])
      .describe('取得するニュースレターのソース'),
  }),
  outputSchema: z.object({
    title: z.string().describe('最新号のタイトル'),
    issueUrl: z.string().describe('最新号の URL'),
    content: z.string().describe('最新号の本文 HTML'),
  }),
  execute: async ({ source }) => {
    const feedUrl = RSS_FEEDS[source]
    const feed = await parser.parseURL(feedUrl)

    const latest = feed.items[0]
    if (!latest) {
      throw new Error(`${source} の RSS に記事が見つかりませんでした`)
    }

    return {
      title: latest.title ?? '',
      issueUrl: latest.link ?? feedUrl,
      content: latest['content:encoded'] ?? latest.content ?? '',
    }
  },
})
