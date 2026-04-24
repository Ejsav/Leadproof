import OpenAI from "openai";

export const hasOpenAi = Boolean(process.env.OPENAI_API_KEY);

export const openai = hasOpenAi
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;
