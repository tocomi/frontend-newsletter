import { Agent } from '@mastra/core/agent'
import { fetchHatenaHotentryTool } from '../tools/fetch-hatena-hotentry'
import { fetchArticleTool } from '../tools/fetch-article'
import { postSlackTool } from '../tools/post-slack'
import { waitTool } from '../tools/wait'
import { HATENA_BOOKMARK_INSTRUCTIONS } from './instructions'

export const hatenaBookmarkAgent = new Agent({
  id: 'hatena-bookmark-agent',
  name: 'Hatena Bookmark Agent',
  instructions: HATENA_BOOKMARK_INSTRUCTIONS,
  model: 'openai/gpt-5-mini',
  tools: { fetchHatenaHotentryTool, fetchArticleTool, postSlackTool, waitTool },
  defaultOptions: {
    maxSteps: 80,
  },
})
