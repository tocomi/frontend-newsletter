import { javascriptWeeklyAgent } from './mastra/agents/javascript-weekly-agent'

const TRIGGER_MESSAGE =
  'ニュースレターの最新号を取得して、記事を分析・要約し、Slack に投稿してください。'

javascriptWeeklyAgent.generate(TRIGGER_MESSAGE).catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
