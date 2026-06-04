/**
 * AI Response Schemas — Defines the structured output contracts for each pipeline stage.
 * These are used both as Gemini responseSchema and for client-side validation.
 */

import { SchemaType } from "@google/generative-ai";

/**
 * Stage 1: Outline Schema
 * Gemini produces a structured outline from a user prompt.
 */
export const outlineSchema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING, description: "Presentation title" },
    subtitle: {
      type: SchemaType.STRING,
      description: "Subtitle or tagline for the presentation",
    },
    target_audience: {
      type: SchemaType.STRING,
      description: "Inferred target audience",
    },
    tone: {
      type: SchemaType.STRING,
      description:
        "Tone of the presentation: professional, casual, academic, or creative",
      enum: ["professional", "casual", "academic", "creative"],
    },
    slide_count: {
      type: SchemaType.INTEGER,
      description: "Total number of slides",
    },
    slides: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          slide_number: { type: SchemaType.INTEGER },
          section: {
            type: SchemaType.STRING,
            description: "Section name (e.g. Introduction, Key Benefits)",
          },
          title: {
            type: SchemaType.STRING,
            description: "Slide title",
          },
          talking_points: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "3-5 bullet point summaries of what this slide covers",
          },
          suggested_layout: {
            type: SchemaType.STRING,
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
  required: ["title", "subtitle", "target_audience", "tone", "slides"],
};

/**
 * Stage 2: Full Slide Data Schema
 * Gemini produces complete slide content, ready for rendering.
 */
export const slidesSchema = {
  type: SchemaType.OBJECT,
  properties: {
    slides: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          slide_number: { type: SchemaType.INTEGER },
          layout_type: {
            type: SchemaType.STRING,
            description:
              "Layout type from: TITLE_HERO, TITLE_WITH_IMAGE, BULLETS, TWO_COLUMN, THREE_COLUMN, IMAGE_LEFT, IMAGE_RIGHT, QUOTE, BIG_NUMBER, TIMELINE, ICON_GRID, CLOSING",
          },
          title: { type: SchemaType.STRING, description: "Slide title" },
          subtitle: {
            type: SchemaType.STRING,
            description: "Slide subtitle (for TITLE_HERO, CLOSING layouts)",
          },
          bullets: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Bullet points for BULLETS, IMAGE_LEFT, IMAGE_RIGHT layouts",
          },
          columns: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                heading: { type: SchemaType.STRING },
                items: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                },
              },
              required: ["heading", "items"],
            },
            description:
              "Column data for TWO_COLUMN, THREE_COLUMN layouts",
          },
          quote_text: {
            type: SchemaType.STRING,
            description: "Quote text for QUOTE layout",
          },
          quote_author: {
            type: SchemaType.STRING,
            description: "Quote attribution for QUOTE layout",
          },
          stat_number: {
            type: SchemaType.STRING,
            description: "Large statistic for BIG_NUMBER layout (e.g. '95%', '10M+')",
          },
          stat_label: {
            type: SchemaType.STRING,
            description: "Context for the statistic in BIG_NUMBER layout",
          },
          timeline_items: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                date: { type: SchemaType.STRING },
                event: { type: SchemaType.STRING },
              },
              required: ["date", "event"],
            },
            description: "Timeline events for TIMELINE layout",
          },
          icon_items: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                icon: {
                  type: SchemaType.STRING,
                  description: "Emoji icon representing this item",
                },
                title: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING },
              },
              required: ["icon", "title", "description"],
            },
            description: "Grid items for ICON_GRID layout",
          },
          speaker_notes: {
            type: SchemaType.STRING,
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
 * Gemini returns updated slides after a conversational refinement request.
 */
export const refineSchema = {
  type: SchemaType.OBJECT,
  properties: {
    action: {
      type: SchemaType.STRING,
      description:
        "What action to take: 'update_slides' to modify existing slides, 'replace_all' to regenerate all slides",
      enum: ["update_slides", "replace_all"],
    },
    message: {
      type: SchemaType.STRING,
      description:
        "A brief message to the user explaining what changes were made",
    },
    slides: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          slide_number: { type: SchemaType.INTEGER },
          layout_type: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          subtitle: { type: SchemaType.STRING },
          bullets: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          columns: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                heading: { type: SchemaType.STRING },
                items: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                },
              },
              required: ["heading", "items"],
            },
          },
          quote_text: { type: SchemaType.STRING },
          quote_author: { type: SchemaType.STRING },
          stat_number: { type: SchemaType.STRING },
          stat_label: { type: SchemaType.STRING },
          timeline_items: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                date: { type: SchemaType.STRING },
                event: { type: SchemaType.STRING },
              },
              required: ["date", "event"],
            },
          },
          icon_items: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                icon: { type: SchemaType.STRING },
                title: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING },
              },
              required: ["icon", "title", "description"],
            },
          },
          speaker_notes: { type: SchemaType.STRING },
        },
        required: ["slide_number", "layout_type", "title"],
      },
    },
  },
  required: ["action", "message", "slides"],
};
