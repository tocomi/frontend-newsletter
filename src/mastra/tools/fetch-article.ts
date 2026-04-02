import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { parse } from 'node-html-parser'

export const fetchArticleTool = createTool({
  id: 'fetch-article',
  description: '記事の URL にアクセスして本文テキストを取得する',
  inputSchema: z.object({
    url: z.string().describe('取得する記事の URL'),
  }),
  outputSchema: z.object({
    title: z.string().describe('記事のタイトル'),
    content: z.string().describe('記事の本文テキスト'),
    url: z.string().describe('記事の URL'),
  }),
  execute: async ({ url }) => {
    console.log(`[fetch-article] 記事フェッチ開始: url=${url}`)
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; NewsletterBot/1.0; +https://github.com)',
      },
    })

    if (!response.ok) {
      console.error(`[fetch-article] フェッチ失敗: status=${response.status}, url=${url}`)
      throw new Error(`Failed to fetch ${url}: ${response.status}`)
    }

    console.log(`[fetch-article] フェッチ成功: status=${response.status}, url=${url}`)
    const html = await response.text()
    const root = parse(html)

    // script / style / nav / footer を除去
    for (const tag of ['script', 'style', 'nav', 'footer', 'header', 'aside']) {
      root.querySelectorAll(tag).forEach((el) => el.remove())
    }

    const title =
      root.querySelector('title')?.text.trim() ??
      root.querySelector('h1')?.text.trim() ??
      ''

    // main > article > body の順で本文を探す
    const bodyEl =
      root.querySelector('main') ??
      root.querySelector('article') ??
      root.querySelector('body') ??
      root

    const content = bodyEl.text
      .replace(/\n{3,}/g, '\n\n') // 連続する空行を整理
      .trim()

    console.log(`[fetch-article] パース完了: title="${title}", contentLength=${content.length}文字`)
    return { title, content, url }
  },
})
