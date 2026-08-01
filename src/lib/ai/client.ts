import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { env } from "@/env";

export interface AIProvider {
  generateText(
    prompt: string,
    options?: { temperature?: number },
  ): Promise<string>;
  generateJson<T>(
    prompt: string,
    options?: { temperature?: number },
  ): Promise<T>;
}

export function extractJson(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "");
  cleaned = cleaned.replace(/^```\s*/, "");
  cleaned = cleaned.replace(/```$/, "");
  cleaned = cleaned.trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");

  let start = -1;
  let end = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace;
    end = lastBrace;
  } else if (firstBracket !== -1) {
    start = firstBracket;
    end = lastBracket;
  }

  if (start === -1 || end === -1 || end <= start) {
    return cleaned;
  }

  return cleaned.slice(start, end + 1);
}

export function sanitizeJsonString(jsonStr: string): string {
  let inString = false;
  let escaped = false;
  let result = "";

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];

    if (char === '"' && !escaped) {
      inString = !inString;
      result += char;
    } else if (char === "\\" && !escaped) {
      escaped = true;
      result += char;
    } else {
      if (inString) {
        if (char === "\n") {
          result += "\\n";
        } else if (char === "\r") {
          result += "\\r";
        } else if (char === "\t") {
          result += "\\t";
        } else {
          result += char;
        }
      } else {
        result += char;
      }
      escaped = false;
    }
  }

  return result;
}

export class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  async generateText(
    prompt: string,
    options?: { temperature?: number },
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
      },
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async generateJson<T>(
    prompt: string,
    options?: { temperature?: number },
  ): Promise<T> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        responseMimeType: "application/json",
      },
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = extractJson(text);
    const sanitized = sanitizeJsonString(cleaned);
    return JSON.parse(sanitized) as T;
  }
}

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private modelName: string;

  constructor(apiKey: string, modelName: string, baseURL?: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL,
    });
    this.modelName = modelName;
  }

  async generateText(
    prompt: string,
    options?: { temperature?: number },
  ): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [{ role: "user", content: prompt }],
      temperature: options?.temperature ?? 0.7,
    });
    return response.choices[0]?.message?.content || "";
  }

  async generateJson<T>(
    prompt: string,
    options?: { temperature?: number },
  ): Promise<T> {
    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [{ role: "user", content: prompt }],
      temperature: options?.temperature ?? 0.7,
      response_format: { type: "json_object" },
    });
    const text = response.choices[0]?.message?.content || "";
    const cleaned = extractJson(text);
    const sanitized = sanitizeJsonString(cleaned);
    return JSON.parse(sanitized) as T;
  }
}

export function getAIProvider(): AIProvider {
  const providerType = (env.AI_PROVIDER || "gemini").toLowerCase();

  // If the provider is explicitly gemini, or if there is no provider set and gemini api key is present, use Gemini
  if (providerType === "gemini") {
    const apiKey = env.GEMINI_API_KEY || "";
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY must be provided when using Gemini provider",
      );
    }
    const model = env.AI_MODEL || "gemini-3.5-flash";
    return new GeminiProvider(apiKey, model);
  }

  // If the provider is explicitly openai (without custom URL), use OpenAI official client
  if (providerType === "openai" && !env.AI_BASE_URL) {
    const apiKey = env.AI_API_KEY || "";
    if (!apiKey) {
      throw new Error("AI_API_KEY must be provided when using OpenAI provider");
    }
    const model = env.AI_MODEL || "gpt-4o-mini";
    return new OpenAIProvider(apiKey, model);
  }

  // For any other provider (e.g. "opencode-zen", "custom", "deepseek", etc.) or if AI_BASE_URL is set,
  // we assume it is an OpenAI-compatible endpoint.
  const apiKey = env.AI_API_KEY || env.GEMINI_API_KEY || "";
  const baseURL = env.AI_BASE_URL;
  if (!baseURL) {
    throw new Error(
      `AI_BASE_URL must be provided when using custom/OpenAI-compatible provider "${env.AI_PROVIDER}"`,
    );
  }
  const model = env.AI_MODEL || "custom-model";
  return new OpenAIProvider(apiKey, model, baseURL);
}
