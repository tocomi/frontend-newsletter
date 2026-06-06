import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import RssParser from 'rss-parser'

type CustomFeed = Record<string, never>
type CustomItem = {
  'hatena:bookmarkcount'?: string
  'dc:date'?: string
}

const HATENA_IT_HOTENTRY_URL = 'https://b.hatena.ne.jp/hotentry/it'
const HATENA_IT_HOTENTRY_RSS_URL = `${HATENA_IT_HOTENTRY_URL}.rss`

const parser = new RssParser<CustomFeed, CustomItem>({
  customFields: {
    item: ['hatena:bookmarkcount', 'dc:date'],
  },
})

function parseBookmarkCount(item: CustomItem & RssParser.Item): number {
  const bookmarkCount = Number(item['hatena:bookmarkcount'])
  if (Number.isFinite(bookmarkCount)) {
    return bookmarkCount
  }

  const snippet = item.contentSnippet ?? item.content ?? ''
  const matched = snippet.match(/(\d+)\s*(?:users?|ブックマーク)/i)
  return matched ? Number(matched[1]) : 0
}

export const fetchHatenaHotentryTool = createTool({
  id: 'fetch-hatena-hotentry',
  description: 'はてなブックマークのテクノロジー人気エントリー RSS から候補記事を取得する',
  inputSchema: z.object({
    limit: z.number().int().min(1).max(50).default(30).describe('取得する候補記事数。通常は30件'),
  }),
  outputSchema: z.object({
    sourceTitle: z.string().describe('取得元のタイトル'),
    sourceUrl: z.string().describe('取得元ページの URL'),
    feedUrl: z.string().describe('取得元 RSS の URL'),
    entries: z
      .array(
        z.object({
          title: z.string().describe('記事タイトル'),
          url: z.string().describe('元記事 URL'),
          entryUrl: z.string().describe('はてなブックマークのエントリー URL'),
          bookmarkCount: z.number().describe('ブックマーク数'),
          tags: z.array(z.string()).describe('RSS に含まれるカテゴリ/タグ'),
          postedAt: z.string().describe('RSS の公開日時'),
        }),
      )
      .describe('候補記事一覧'),
  }),
  execute: async ({ limit }) => {
    console.log(`[fetch-hatena-hotentry] RSS フェッチ開始: url=${HATENA_IT_HOTENTRY_RSS_URL}`)

    const feed = await parser.parseURL(HATENA_IT_HOTENTRY_RSS_URL)
    console.log(`[fetch-hatena-hotentry] RSS フェッチ完了: ${feed.items.length}件取得`)

    const entries = feed.items
      .filter((item) => item.title && item.link)
      .slice(0, limit)
      .map((item) => ({
        title: item.title ?? '',
        url: item.link ?? '',
        entryUrl: item.guid ?? '',
        bookmarkCount: parseBookmarkCount(item),
        tags: item.categories ?? [],
        postedAt: item.isoDate ?? item['dc:date'] ?? item.pubDate ?? '',
      }))

    return {
      sourceTitle: feed.title ?? 'はてなブックマーク テクノロジー人気エントリー',
      sourceUrl: HATENA_IT_HOTENTRY_URL,
      feedUrl: HATENA_IT_HOTENTRY_RSS_URL,
      entries,
    }
  },
})
