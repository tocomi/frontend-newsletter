import { Agent } from "@mastra/core/agent";
import { fetchNewsletterTool } from "../tools/fetch-newsletter";
import { fetchArticleTool } from "../tools/fetch-article";
import { postSlackTool } from "../tools/post-slack";
import { waitTool } from "../tools/wait";
import { THIS_WEEK_IN_REACT_INSTRUCTIONS } from "./instructions";

export const thisWeekInReactAgent = new Agent({
  id: "this-week-in-react-agent",
  name: "This Week in React Agent",
  instructions: THIS_WEEK_IN_REACT_INSTRUCTIONS,
  model: "openai/gpt-5-mini",
  tools: { fetchNewsletterTool, fetchArticleTool, postSlackTool, waitTool },
  defaultOptions: {
    maxSteps: 50,
  },
});
