import { generateDesign } from "@/lib/ai/fireworks";

export const maxDuration = 60; // Allow more time for generation

export async function POST(req) {
  try {
    const { slides } = await req.json();

    if (!slides || !Array.isArray(slides)) {
      return Response.json(
        { error: "Invalid slides data provided" },
        { status: 400 }
      );
    }

    const design = await generateDesign(slides);

    console.log("Fireworks returned design:", JSON.stringify(design, null, 2));

    return Response.json({ success: true, design });
  } catch (error) {
    console.error("Design generation failed:", error);
    return Response.json(
      { error: "Failed to generate design. " + error.message },
      { status: 500 }
    );
  }
}
