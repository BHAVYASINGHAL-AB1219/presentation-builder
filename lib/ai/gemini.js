/**
 * Gemini Client Wrapper
 * Server-side only — handles Gemini API calls with structured output and streaming.
 */

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is required. Set it in .env.local"
    );
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Generate structured JSON from Gemini with a given system prompt and schema.
 * @param {string} systemPrompt - The system instruction
 * @param {string} userPrompt - The user's message
 * @param {object} responseSchema - Gemini-compatible JSON schema
 * @returns {object} Parsed JSON response
 */
export async function generateStructured(
  systemPrompt,
  userPrompt,
  responseSchema
) {
  const genAI = getClient();

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();
  return JSON.parse(text);
}

/**
 * Stream structured JSON from Gemini.
 * Yields raw text chunks as they arrive.
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {object} responseSchema
 * @yields {string} Text chunks
 */
export async function* streamStructured(
  systemPrompt,
  userPrompt,
  responseSchema
) {
  const genAI = getClient();

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const result = await model.generateContentStream(userPrompt);

  let accumulated = "";
  for await (const chunk of result.stream) {
    const text = chunk.text();
    accumulated += text;
    yield { chunk: text, accumulated };
  }
}
