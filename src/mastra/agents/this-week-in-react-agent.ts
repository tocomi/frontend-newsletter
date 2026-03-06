import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { fetchNewsletterTool } from "../tools/fetch-newsletter";
import { fetchArticleTool } from "../tools/fetch-article";
import { postSlackTool } from "../tools/post-slack";
import { THIS_WEEK_IN_REACT_INSTRUCTIONS } from "./instructions";

export const thisWeekInReactAgent = new Agent({
  id: "this-week-in-react-agent",
  name: "This Week in React Agent",
  instructions: THIS_WEEK_IN_REACT_INSTRUCTIONS,
  model: "openai/gpt-5-mini",
  tools: { fetchNewsletterTool, fetchArticleTool, postSlackTool },
  memory: new Memory(),
  defaultOptions: {
    maxSteps: 50,
  },
});
