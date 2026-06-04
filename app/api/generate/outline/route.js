/**
 * API Route: POST /api/generate/outline
 * Accepts a user prompt and generates a structured presentation outline.
 */

import { generateStructured } from "@/lib/ai/openrouter";
import { outlineSchema } from "@/lib/ai/schemas";
import {
  OUTLINE_SYSTEM_PROMPT,
  buildOutlinePrompt,
} from "@/lib/ai/prompts";

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, preferences } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return Response.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const userPrompt = buildOutlinePrompt(prompt.trim(), preferences || {});

    const outline = await generateStructured(
      OUTLINE_SYSTEM_PROMPT,
      userPrompt,
      outlineSchema
    );

    console.log("Gemini returned outline:", JSON.stringify(outline, null, 2));

    return Response.json({ success: true, outline });
  } catch (error) {
    console.error("Outline generation failed:", error);
    return Response.json(
      {
        error: "Failed to generate outline",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
