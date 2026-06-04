/**
 * API Route: POST /api/generate/slides
 * Takes an approved outline and generates full slide content.
 */

import { generateStructured } from "@/lib/ai/fireworks";
import { slidesSchema } from "@/lib/ai/schemas";
import {
  SLIDES_SYSTEM_PROMPT,
  buildSlidesPrompt,
} from "@/lib/ai/prompts";

export async function POST(request) {
  try {
    const body = await request.json();
    const { outline } = body;

    if (!outline || !outline.slides || outline.slides.length === 0) {
      return Response.json(
        { error: "Valid outline with slides is required" },
        { status: 400 }
      );
    }

    const userPrompt = buildSlidesPrompt(outline);

    const result = await generateStructured(
      SLIDES_SYSTEM_PROMPT,
      userPrompt,
      slidesSchema
    );

    return Response.json({ success: true, slides: result.slides });
  } catch (error) {
    console.error("Slide generation failed:", error);
    return Response.json(
      {
        error: "Failed to generate slides",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
