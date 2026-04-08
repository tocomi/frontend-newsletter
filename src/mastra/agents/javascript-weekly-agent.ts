import { Agent } from "@mastra/core/agent";
import { fetchNewsletterTool } from "../tools/fetch-newsletter";
import { fetchArticleTool } from "../tools/fetch-article";
import { postSlackTool } from "../tools/post-slack";
import { waitTool } from "../tools/wait";
import { JAVASCRIPT_WEEKLY_INSTRUCTIONS } from "./instructions";

export const javascriptWeeklyAgent = new Agent({
  id: "javascript-weekly-agent",
  name: "JavaScript Weekly Agent",
  instructions: JAVASCRIPT_WEEKLY_INSTRUCTIONS,
  model: "openai/gpt-5-mini",
  tools: { fetchNewsletterTool, fetchArticleTool, postSlackTool, waitTool },
  defaultOptions: {
    maxSteps: 50,
  },
});
