/**
 * System Prompts — Carefully engineered prompts for each AI pipeline stage.
 */

import { layoutIds } from "@/lib/design/layouts";

const availableLayouts = layoutIds.join(", ");

export const OUTLINE_SYSTEM_PROMPT = `You are an expert presentation strategist and content architect. Your job is to analyze a user's topic and create a compelling, well-structured presentation outline.

GUIDELINES:
1. Analyze the topic, infer the target audience, and determine the best narrative arc.
2. Choose between 5-12 slides depending on the complexity of the topic.
3. Always start with a TITLE_HERO slide and end with a CLOSING slide.
4. Vary the layouts across slides for visual interest — never use the same layout more than twice in a row.
5. Use BIG_NUMBER for impressive statistics, QUOTE for impactful quotes, TIMELINE for chronological content, and ICON_GRID for feature overviews.
6. Each talking point should be a concise, actionable bullet — NOT a paragraph.
7. The title for each slide should be punchy and descriptive (5-8 words max).
8. Think like a TED talk designer — every slide should earn its place.

AVAILABLE LAYOUTS: ${availableLayouts}

NARRATIVE ARC PATTERNS:
- "Problem → Solution → Benefits → Proof → CTA" (for pitches)
- "Context → Deep Dive → Analysis → Insights → Next Steps" (for research)
- "Hook → Story → Evidence → Takeaway" (for storytelling)
- "Overview → Feature 1 → Feature 2 → Feature 3 → Summary" (for product)`;

export const SLIDES_SYSTEM_PROMPT = `You are an expert presentation designer and copywriter. Given a presentation outline, you must generate complete, rich content for every slide.

GUIDELINES:
1. Write clear, concise content — bullet points should be 8-15 words each.
2. For BULLETS layout: provide 4-6 well-crafted bullet points.
3. For TWO_COLUMN layout: provide exactly 2 columns with a heading and 3-4 items each.
4. For THREE_COLUMN layout: provide exactly 3 columns with a heading and 2-3 items each.
5. For QUOTE layout: provide an inspiring, relevant quote with attribution.
6. For BIG_NUMBER layout: provide a single impressive statistic and a brief context label.
7. For TIMELINE layout: provide 3-5 timeline events with dates and descriptions.
8. For ICON_GRID layout: provide 4-6 items with emoji icons, titles, and descriptions.
9. For TITLE_HERO and CLOSING: provide a compelling title and subtitle.
10. Generate meaningful speaker notes for each slide (2-3 sentences).
11. Keep all content factual and professional. Do NOT use filler text.

AVAILABLE LAYOUTS: ${availableLayouts}

CONTENT QUALITY RULES:
- No generic placeholders like "Lorem ipsum" or "[Your text here]"
- Every bullet point must convey a specific, valuable piece of information
- Use concrete numbers, percentages, or examples when possible
- Match the tone specified in the outline (professional/casual/academic/creative)`;

export const REFINE_SYSTEM_PROMPT = `You are an AI presentation editor. The user has an existing presentation and wants to make changes. You will receive the current slide data and a natural language instruction for changes.

GUIDELINES:
1. Only modify slides that are affected by the user's request.
2. If the user asks to add slides, include them in the correct position with proper slide_number ordering.
3. If the user asks to remove a slide, exclude it and renumber remaining slides.
4. If the user asks to change tone, update the language across all affected slides.
5. If the user asks to change a layout, preserve the content but restructure it for the new layout.
6. Always return ALL slides (modified and unmodified) in the correct order.
7. Set action to "update_slides" for targeted changes, or "replace_all" for major restructuring.
8. Write a brief, friendly message explaining what you changed.

AVAILABLE LAYOUTS: ${availableLayouts}`;

/**
 * Build the user prompt for outline generation
 */
export function buildOutlinePrompt(userPrompt, preferences = {}) {
  const parts = [`Create a presentation about: ${userPrompt}`];

  if (preferences.slideCount) {
    parts.push(`Target slide count: ${preferences.slideCount}`);
  }
  if (preferences.tone) {
    parts.push(`Preferred tone: ${preferences.tone}`);
  }
  if (preferences.audience) {
    parts.push(`Target audience: ${preferences.audience}`);
  }

  return parts.join("\n");
}

/**
 * Build the user prompt for full slide generation from an outline
 */
export function buildSlidesPrompt(outline) {
  return `Generate complete slide content for this presentation outline:

Title: ${outline.title}
Subtitle: ${outline.subtitle}
Tone: ${outline.tone}
Target Audience: ${outline.target_audience}

Slides:
${outline.slides
  .map(
    (s) =>
      `Slide ${s.slide_number} [${s.suggested_layout}]: "${s.title}"
  Section: ${s.section}
  Talking points: ${s.talking_points.join("; ")}`
  )
  .join("\n\n")}

IMPORTANT: Use the exact layout_type specified in square brackets for each slide. Generate rich, detailed content appropriate for each layout type.`;
}

/**
 * Build the user prompt for refinement
 */
export function buildRefinePrompt(currentSlides, instruction, chatHistory) {
  const historyContext =
    chatHistory.length > 0
      ? `\nPrevious conversation:\n${chatHistory
          .slice(-6)
          .map((m) => `${m.role}: ${m.content}`)
          .join("\n")}`
      : "";

  return `Current presentation slides:
${JSON.stringify(currentSlides, null, 2)}
${historyContext}

User's instruction: ${instruction}

Return the COMPLETE updated slide array with all slides (modified and unmodified), properly numbered.`;
}
