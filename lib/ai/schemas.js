/**
 * AI Response Schemas — Defines the structured output contracts for each pipeline stage.
 * These are used as standard JSON Schemas for OpenRouter and client-side validation.
 */

/**
 * Stage 1: Outline Schema
 * Model produces a structured outline from a user prompt.
 */
export const outlineSchema = {
  type: "object",
  properties: {
    title: { type: "string", description: "Presentation title" },
    subtitle: {
      type: "string",
      description: "Subtitle or tagline for the presentation",
    },
    target_audience: {
      type: "string",
      description: "Inferred target audience",
    },
    tone: {
      type: "string",
      description:
        "Tone of the presentation: professional, casual, academic, or creative",
      enum: ["professional", "casual", "academic", "creative"],
    },
    slide_count: {
      type: "integer",
      description: "Total number of slides",
    },
    slides: {
      type: "array",
      items: {
        type: "object",
        properties: {
          slide_number: { type: "integer" },
          section: {
            type: "string",
            description: "Section name (e.g. Introduction, Key Benefits)",
          },
          title: {
            type: "string",
            description: "Slide title",
          },
          talking_points: {
            type: "array",
            items: { type: "string" },
            description: "3-5 bullet point summaries of what this slide covers",
          },
          suggested_layout: {
            type: "string",
            description:
              "Suggested layout from: TITLE_HERO, TITLE_WITH_IMAGE, BULLETS, TWO_COLUMN, THREE_COLUMN, IMAGE_LEFT, IMAGE_RIGHT, QUOTE, BIG_NUMBER, TIMELINE, ICON_GRID, CLOSING",
          },
        },
        required: [
          "slide_number",
          "section",
          "title",
          "talking_points",
          "suggested_layout",
        ],
      },
    },
  },
  required: ["title", "subtitle", "target_audience", "tone", "slide_count", "slides"],
};

/**
 * Stage 2: Full Slide Data Schema
 * Model produces complete slide content, ready for rendering.
 */
export const slidesSchema = {
  type: "object",
  properties: {
    slides: {
      type: "array",
      items: {
        type: "object",
        properties: {
          slide_number: { type: "integer" },
          layout_type: {
            type: "string",
            description:
              "Layout type from: TITLE_HERO, TITLE_WITH_IMAGE, BULLETS, TWO_COLUMN, THREE_COLUMN, IMAGE_LEFT, IMAGE_RIGHT, QUOTE, BIG_NUMBER, TIMELINE, ICON_GRID, CLOSING",
          },
          title: { type: "string", description: "Slide title" },
          subtitle: {
            type: "string",
            description: "Slide subtitle",
          },
          image_prompt: {
            type: "string",
            description: "A highly detailed, photorealistic prompt for an AI image generator. ONLY include this if the layout type involves an image (e.g. IMAGE_LEFT, IMAGE_RIGHT, TITLE_WITH_IMAGE).",
          },
          bullets: {
            type: "array",
            items: { type: "string" },
            description: "Bullet points for the slide if applicable",
          },
          columns: {
            type: "array",
            items: {
              type: "object",
              properties: {
                heading: { type: "string" },
                items: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["heading", "items"],
            },
            description:
              "Columnar content if applicable",
          },
          quote_text: {
            type: "string",
            description: "A prominent quote if applicable",
          },
          quote_author: {
            type: "string",
            description: "Quote attribution",
          },
          stat_number: {
            type: "string",
            description: "Large statistic (e.g. '95%', '10M+') if applicable",
          },
          stat_label: {
            type: "string",
            description: "Context for the statistic",
          },
          timeline_items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string" },
                event: { type: "string" },
              },
              required: ["date", "event"],
            },
            description: "Timeline events if applicable",
          },
          icon_items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                icon: {
                  type: "string",
                  description: "Emoji icon representing this item",
                },
                title: { type: "string" },
                description: { type: "string" },
              },
              required: ["icon", "title", "description"],
            },
            description: "Grid items with icons if applicable",
          },
          speaker_notes: {
            type: "string",
            description: "Speaker notes for this slide",
          },
        },
        required: ["slide_number", "layout_type", "title"],
      },
    },
  },
  required: ["slides"],
};

/**
 * Stage 3: Refinement Schema
 * Model returns updated slides after a conversational refinement request.
 */
export const refineSchema = {
  type: "object",
  properties: {
    action: {
      type: "string",
      description:
        "What action to take: 'update_slides' to modify existing slides, 'replace_all' to regenerate all slides",
      enum: ["update_slides", "replace_all"],
    },
    message: {
      type: "string",
      description:
        "A brief message to the user explaining what changes were made",
    },
    slides: {
      type: "array",
      items: {
        type: "object",
        properties: {
          slide_number: { type: "integer" },
          layout_type: { type: "string" },
          title: { type: "string" },
          subtitle: { type: "string" },
          image_prompt: { type: "string" },
          bullets: {
            type: "array",
            items: { type: "string" },
          },
          columns: {
            type: "array",
            items: {
              type: "object",
              properties: {
                heading: { type: "string" },
                items: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["heading", "items"],
            },
          },
          quote_text: { type: "string", description: "The quote." },
          quote_author: { type: "string", description: "Author of the quote." },
          stat_number: { type: "string", description: "The big number." },
          stat_label: { type: "string", description: "Label for the big number." },
          timeline_items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string", description: "Date (e.g. 2024)." },
                event: { type: "string", description: "Event description." },
              },
              required: ["date", "event"],
            },
          },
          icon_items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                icon: { type: "string", description: "A single emoji" },
                title: { type: "string", description: "Icon title." },
                description: { type: "string", description: "Icon description." },
              },
              required: ["icon", "title", "description"],
            },
          },
          speaker_notes: { type: "string" },
        },
        required: ["slide_number", "layout_type", "title"],
      },
    },
  },
  required: ["action", "message", "slides"],
};

/**
 * Stage 4: Self-Reflection Verification Schema
 * Model audits its own slides and outputs a corrected array if necessary.
 */
export const verifySchema = {
  type: "object",
  properties: {
    analysis: {
      type: "string",
      description: "Briefly analyze the density of the slides.",
    },
    requires_changes: {
      type: "boolean",
      description: "True if you had to fix or split any slides.",
    },
    slides: slidesSchema.properties.slides,
  },
  required: ["analysis", "requires_changes", "slides"],
};
