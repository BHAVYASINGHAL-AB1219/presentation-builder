/**
 * API Route: POST /api/generate/slides
 * Takes an approved outline and generates full slide content.
 */

import { generateStructured } from "@/lib/ai/fireworks";
import { slidesSchema, verifySchema } from "@/lib/ai/schemas";
import {
  SLIDES_SYSTEM_PROMPT,
  buildSlidesPrompt,
  VERIFY_SYSTEM_PROMPT,
  buildVerifyPrompt,
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

    // Pass 1: Generate drafted slides
    const userPrompt = buildSlidesPrompt(outline);
    console.log("Drafting slides...");
    const draftResult = await generateStructured(
      SLIDES_SYSTEM_PROMPT,
      userPrompt,
      slidesSchema
    );

    // Pass 2: Auditor pass
    console.log("Auditing drafted slides for layout fit...");
    const verifyUserPrompt = buildVerifyPrompt(draftResult.slides);
    const verifyResult = await generateStructured(
      VERIFY_SYSTEM_PROMPT,
      verifyUserPrompt,
      verifySchema
    );

    console.log("Auditor Analysis:", verifyResult.analysis);
    if (verifyResult.requires_changes) {
      console.log("Auditor applied fixes to prevent overflow!");
    } else {
      console.log("Auditor approved slides as-is.");
    }

    return Response.json({ success: true, slides: verifyResult.slides });
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
