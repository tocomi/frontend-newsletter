import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { fetchNewsletterTool } from "../tools/fetch-newsletter";
import { fetchArticleTool } from "../tools/fetch-article";
import { postSlackTool } from "../tools/post-slack";
import { JAVASCRIPT_WEEKLY_INSTRUCTIONS } from "./instructions";

export const javascriptWeeklyAgent = new Agent({
  id: "javascript-weekly-agent",
  name: "JavaScript Weekly Agent",
  instructions: JAVASCRIPT_WEEKLY_INSTRUCTIONS,
  model: "openai/gpt-5-mini",
  tools: { fetchNewsletterTool, fetchArticleTool, postSlackTool },
  defaultOptions: {
    maxSteps: 50,
  },
});
