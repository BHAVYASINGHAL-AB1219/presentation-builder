/**
 * API Route: POST /api/refine
 * Handles conversational refinement of an existing presentation.
 */

import { generateStructured } from "@/lib/ai/fireworks";
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

    // Strip massive base64 image strings before sending to LLM to prevent context overflow
    const cleanSlides = slides.map(slide => {
      const { image, ...rest } = slide;
      return rest;
    });

    const userPrompt = buildRefinePrompt(
      cleanSlides,
      instruction.trim(),
      chatHistory || []
    );

    const result = await generateStructured(
      REFINE_SYSTEM_PROMPT,
      userPrompt,
      refineSchema
    );

    // Reattach images from the original slides to prevent them from disappearing
    // We map by slide_number as a best-effort approach.
    const finalSlides = result.slides.map(newSlide => {
      const originalSlide = slides.find(s => s.slide_number === newSlide.slide_number);
      if (originalSlide && originalSlide.image) {
        return { ...newSlide, image: originalSlide.image };
      }
      return newSlide;
    });

    return Response.json({
      success: true,
      action: result.action,
      message: result.message,
      slides: finalSlides,
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
