/**
 * API Route: POST /api/export
 * Generates a PPTX file from slide data and returns it as a downloadable binary.
 */

import { buildPptx } from "@/lib/export/pptxBuilder";

export async function POST(request) {
  try {
    const body = await request.json();
    const { slides, theme, title } = body;

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return Response.json(
        { error: "Slides data is required" },
        { status: 400 }
      );
    }

    const buffer = await buildPptx(
      slides,
      theme || "midnight",
      title || "DeckAI Presentation"
    );

    const fileName = `${(title || "DeckAI_Presentation")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .slice(0, 50)}.pptx`;

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("PPTX export failed:", error);
    return Response.json(
      {
        error: "Failed to generate PPTX",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
