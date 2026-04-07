import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const waitTool = createTool({
  id: 'wait',
  description: 'API レートリミットを避けるために指定した秒数だけ待機する',
  inputSchema: z.object({
    seconds: z.number().describe('待機する秒数'),
  }),
  outputSchema: z.object({
    waited: z.number().describe('実際に待機した秒数'),
  }),
  execute: async ({ seconds }) => {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
    return { waited: seconds }
  },
})
