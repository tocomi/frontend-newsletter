import { hatenaBookmarkAgent } from './mastra/agents/hatena-bookmark-agent'

const TRIGGER_MESSAGE =
  'はてなブックマークのテクノロジー人気エントリーを取得して、有益な記事を5件選び、分析・要約して Slack に投稿してください。'

hatenaBookmarkAgent.generate(TRIGGER_MESSAGE).catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
