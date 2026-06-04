/**
 * API Route: POST /api/refine
 * Handles conversational refinement of an existing presentation.
 */

import { generateStructured } from "@/lib/ai/openrouter";
import { refineSchema } from "@/lib/ai/schemas";
import {
  REFINE_SYSTEM_PROMPT,
  buildRefinePrompt,
} from "@/lib/ai/prompts";

export async function POST(request) {
  try {
    const body = await request.json();
    const { slides, instruction, chatHistory } = body;

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return Response.json(
        { error: "Current slides data is required" },
        { status: 400 }
      );
    }

    if (
      !instruction ||
      typeof instruction !== "string" ||
      instruction.trim().length === 0
    ) {
      return Response.json(
        { error: "Refinement instruction is required" },
        { status: 400 }
      );
    }

    const userPrompt = buildRefinePrompt(
      slides,
      instruction.trim(),
      chatHistory || []
    );

    const result = await generateStructured(
      REFINE_SYSTEM_PROMPT,
      userPrompt,
      refineSchema
    );

    return Response.json({
      success: true,
      action: result.action,
      message: result.message,
      slides: result.slides,
    });
  } catch (error) {
    console.error("Refinement failed:", error);
    return Response.json(
      {
        error: "Failed to refine presentation",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
