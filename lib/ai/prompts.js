/**
 * System Prompts — Carefully engineered prompts for each AI pipeline stage.
 */

import { layoutIds } from "@/lib/design/layouts";

const availableLayouts = layoutIds.join(", ");

export const OUTLINE_SYSTEM_PROMPT = `You are an expert presentation strategist and content architect. Your job is to analyze a user's topic and create a compelling, well-structured presentation outline.

GUIDELINES:
1. Analyze the topic and determine the optimal narrative arc organically. DO NOT use a fixed pattern.
2. The presentation length should be completely variable. A simple topic might need 3 slides; a complex one might need 15 slides. Decide the slide count organically based strictly on the depth of the topic!
3. You have complete structural freewill. You can start with any layout, end with any layout, and use any combination of layouts.
4. Vary the layouts across slides to keep it visually engaging. Use image-based layouts when visual context makes sense.
5. The title for each slide should be punchy and descriptive.

AVAILABLE LAYOUTS: ${availableLayouts}`;

export const SLIDES_SYSTEM_PROMPT = `You are an expert presentation designer and copywriter.Given a presentation outline, you must generate complete, rich content for every slide.

  GUIDELINES:
  1. Write compelling, rich content. You have complete freedom over the length of the text.
  2. If a topic requires a massive amount of text or many points, DO NOT cram it into a single slide. Instead, split the content across multiple consecutive slides (e.g., 'Topic - Part 1', 'Topic - Part 2').
  3. For BULLETS, TWO_COLUMN, THREE_COLUMN, and ICON_GRID layouts: Organically choose the number of items and their length based on what best fits the message. You are not artificially constrained.
  4. For IMAGE_LEFT, IMAGE_RIGHT, and TITLE_WITH_IMAGE: You MUST write a highly detailed, photorealistic 'image_prompt' that describes the visual you want generated for that slide.
  5. Generate meaningful speaker notes for each slide.
  6. Keep all content factual and professional. Do NOT use filler text.

AVAILABLE LAYOUTS: ${ availableLayouts }

CONTENT QUALITY RULES:
- No generic placeholders like "Lorem ipsum" or "[Your text here]"
  - Every bullet point must convey a specific, valuable piece of information
    - Use concrete numbers, percentages, or examples when possible
      - Match the tone specified in the outline(professional / casual / academic / creative)`;

export const REFINE_SYSTEM_PROMPT = `You are an AI presentation editor.The user has an existing presentation and wants to make changes.You will receive the current slide data and a natural language instruction for changes.

  GUIDELINES:
  1. Only modify slides that are affected by the user's request.
2. If the user asks to add slides, include them in the correct position with proper slide_number ordering.
3. If the user asks to remove a slide, exclude it and renumber remaining slides.
4. If the user asks to change tone, update the language across all affected slides.
5. If the user asks to change a layout, preserve the content but restructure it for the new layout.
6. Always return ALL slides(modified and unmodified) in the correct order.
7. Set action to "update_slides" for targeted changes, or "replace_all" for major restructuring.
8. Write a brief, friendly message explaining what you changed.

AVAILABLE LAYOUTS: ${ availableLayouts } `;

/**
 * Build the user prompt for outline generation
 */
export function buildOutlinePrompt(userPrompt, preferences = {}) {
  const parts = [`Create a presentation about: ${ userPrompt } `];

  if (preferences.slideCount) {
    parts.push(`Target slide count: ${ preferences.slideCount } `);
  }
  if (preferences.tone) {
    parts.push(`Preferred tone: ${ preferences.tone } `);
  }
  if (preferences.audience) {
    parts.push(`Target audience: ${ preferences.audience } `);
  }

  return parts.join("\n");
}

/**
 * Build the user prompt for full slide generation from an outline
 */
export function buildSlidesPrompt(outline) {
  return `Generate complete slide content for this presentation outline:

  Title: ${ outline.title }
Subtitle: ${ outline.subtitle }
Tone: ${ outline.tone }
Target Audience: ${ outline.target_audience }

Slides:
${
  outline.slides
  .map(
    (s) =>
      `Slide ${s.slide_number} [${s.suggested_layout}]: "${s.title}"
  Section: ${s.section}
  Talking points: ${s.talking_points.join("; ")}`
  )
  .join("\n\n")
}

IMPORTANT: Use the exact layout_type specified in square brackets for each slide.Generate rich, detailed content appropriate for each layout type.`;
}

/**
 * Build the user prompt for refinement
 */
export function buildRefinePrompt(currentSlides, instruction, chatHistory) {
  const historyContext =
    chatHistory.length > 0
      ? `\nPrevious conversation: \n${
  chatHistory
    .slice(-6)
  .map((m) => `${m.role}: ${m.content}`)
  .join("\n")
} `
      : "";

  return `Current presentation slides:
${ JSON.stringify(currentSlides, null, 2) }
${ historyContext }

User's instruction: ${instruction}

Return the COMPLETE updated slide array with all slides(modified and unmodified), properly numbered.`;
}

/**
 * System Prompt for the Self-Reflection Verification Layer
 */
export const VERIFY_SYSTEM_PROMPT = `You are an expert presentation layout auditor. The user will provide you with drafted slide content.
Your job is to read the content and identify if any slide has TOO MUCH text for its layout, causing a dense, visually overwhelming, or overflowing slide.

GUIDELINES:
1. Identify any slides that are too dense.
2. If a slide is too dense, you MUST fix it by either summarizing the text to be concise, OR splitting the content across multiple new consecutive slides.
3. If you add slides, ensure slide_number is sequentially re-ordered.
4. Set requires_changes to true if you made any edits, and explain why in the analysis string.
5. Return the FINAL COMPLETE array of all slides (including ones you did not change).

AVAILABLE LAYOUTS: ${availableLayouts}`;

/**
 * Build the prompt for the verification pass
 */
export function buildVerifyPrompt(draftedSlides) {
  return `Please audit the following drafted presentation slides. Analyze them for extreme text density or visual overflow.
If they are perfect, return requires_changes = false and the original slides.
If any are too dense, fix them, set requires_changes = true, and return the updated complete slide array.

Drafted Slides:
${JSON.stringify(draftedSlides, null, 2)}`;
}
