import { Mastra } from '@mastra/core/mastra'
import { PinoLogger } from '@mastra/loggers'
import { LibSQLStore } from '@mastra/libsql'
import { Memory } from '@mastra/memory'
import {
  Observability,
  DefaultExporter,
  CloudExporter,
  SensitiveDataFilter,
} from '@mastra/observability'
import { weatherWorkflow } from './workflows/weather-workflow'
import { weatherAgent } from './agents/weather-agent'
import { javascriptWeeklyAgent } from './agents/javascript-weekly-agent'
import {
  toolCallAppropriatenessScorer,
  completenessScorer,
  translationScorer,
} from './scorers/weather-scorer'

const storage = new LibSQLStore({
  id: 'mastra-storage',
  url: 'file:./mastra.db',
})

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, javascriptWeeklyAgent },
  memory: {
    default: new Memory({ storage }),
  },
  scorers: {
    toolCallAppropriatenessScorer,
    completenessScorer,
    translationScorer,
  },
  storage,
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'mastra',
        exporters: [
          new DefaultExporter(),
          new CloudExporter(),
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(),
        ],
      },
    },
  }),
})
