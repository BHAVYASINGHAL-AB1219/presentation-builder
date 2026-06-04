import { generateImage } from "@/lib/ai/flux";

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

    // Filter slides that have an image_prompt
    const slidesToProcess = slides.filter(
      (slide) => slide.image_prompt && slide.image_prompt.trim().length > 0
    );

    console.log(`Generating images for ${slidesToProcess.length} slides using Flux.1...`);

    // Generate images concurrently
    const imagePromises = slidesToProcess.map(async (slide) => {
      try {
        const base64Image = await generateImage(slide.image_prompt);
        return { slide_number: slide.slide_number, base64: base64Image };
      } catch (err) {
        console.error(`Failed to generate image for slide ${slide.slide_number}:`, err);
        return { slide_number: slide.slide_number, error: err.message };
      }
    });

    const results = await Promise.all(imagePromises);
    
    // Create a map for easy lookup: slide_number -> base64
    const imagesMap = {};
    results.forEach((res) => {
      if (res.base64) {
        imagesMap[res.slide_number] = res.base64;
      }
    });

    return Response.json({ success: true, images: imagesMap });
  } catch (error) {
    console.error("Image generation failed:", error);
    return Response.json(
      { error: "Failed to generate images. " + error.message },
      { status: 500 }
    );
  }
}
