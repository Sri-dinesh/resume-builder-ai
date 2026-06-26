import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";

const apiKey = env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export function createAIChatSession() {
  return model.startChat({
    generationConfig,
    history: [],
  });
}
