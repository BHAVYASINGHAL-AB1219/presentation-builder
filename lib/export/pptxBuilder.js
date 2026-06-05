/**
 * PPTX Builder — Converts slide data + theme into a PowerPoint file.
 * Evolved from the original ppt.js prototype.
 * Runs server-side only (uses pptxgenjs).
 */

import PptxGenJS from "pptxgenjs";
import { getTheme } from "@/lib/design/themes";
import { getLayout } from "@/lib/design/layouts";

/**
 * Build a .pptx file from slide data and theme.
 * @param {Array} slides - Array of slide data objects
 * @param {string} themeId - Theme identifier
 * @param {string} title - Presentation title
 * @returns {Buffer} PPTX file as a Buffer
 */
export async function buildPptx(slides, themeId = "midnight", title = "Presentation") {
  const theme = getTheme(themeId);
  const pptx = new PptxGenJS();

  pptx.layout = "LAYOUT_16x9";
  pptx.title = title;
  pptx.author = "DeckAI";

  // Helper to strip '#' from hex colors
  const hex = (color) => (color || "").replace("#", "");

  // Shared text options builder
  const textOpts = (overrides = {}) => ({
    fontFace: theme.fonts.heading.split(",")[0].replace(/'/g, "").trim(),
    color: hex(theme.colors.heading),
    fit: "shrink",
    ...overrides,
  });

  for (const slideData of slides) {
    const pptxSlide = pptx.addSlide();
    const layout = getLayout(slideData.layout_type);

    // 1. Background
    pptxSlide.background = { color: hex(theme.colors.slideBg) };

    // 2. Accent bar decoration
    pptxSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 0.08,
      h: "100%",
      fill: { color: hex(theme.decorative.accentBarColor) },
    });

    // 3. Render content based on layout type
    switch (slideData.layout_type) {
      case "TITLE_HERO":
      case "CLOSING":
        pptxSlide.addText(slideData.title, {
          ...layout.pptx.title,
          ...textOpts({ fontSize: layout.pptx.title.fontSize }),
        });
        if (slideData.subtitle) {
          pptxSlide.addText(slideData.subtitle, {
            ...layout.pptx.subtitle,
            ...textOpts({
              color: hex(theme.colors.body),
              fontSize: layout.pptx.subtitle.fontSize,
              bold: false,
            }),
          });
        }
        break;

      case "BULLETS":
        pptxSlide.addText(slideData.title, {
          ...layout.pptx.title,
          ...textOpts(),
        });
        if (slideData.bullets?.length) {
          pptxSlide.addText(
            slideData.bullets.map((b) => ({
              text: b,
              options: {
                bullet: { code: "2022" },
                color: hex(theme.colors.body),
                fontSize: layout.pptx.body.fontSize,
              },
            })),
            {
              ...layout.pptx.body,
              fontFace: theme.fonts.body.split(",")[0].replace(/'/g, "").trim(),
              color: hex(theme.colors.body),
              valign: "top",
              fit: "shrink",
            }
          );
        }
        break;

      case "TWO_COLUMN":
        pptxSlide.addText(slideData.title, {
          ...layout.pptx.title,
          ...textOpts(),
        });
        if (slideData.columns?.length >= 2) {
          for (let i = 0; i < 2; i++) {
            const col = slideData.columns[i];
            const colKey = i === 0 ? "col1" : "col2";
            const items = [
              {
                text: col.heading,
                options: {
                  bold: true,
                  color: hex(theme.colors.accent),
                  fontSize: 18,
                  breakLine: true,
                },
              },
              ...col.items.map((item) => ({
                text: item,
                options: {
                  bullet: { code: "2022" },
                  color: hex(theme.colors.body),
                  fontSize: layout.pptx[colKey].fontSize,
                },
              })),
            ];
            pptxSlide.addText(items, {
              ...layout.pptx[colKey],
              fontFace: theme.fonts.body.split(",")[0].replace(/'/g, "").trim(),
              valign: "top",
              fit: "shrink",
            });
          }
        }
        break;

      case "THREE_COLUMN":
        pptxSlide.addText(slideData.title, {
          ...layout.pptx.title,
          ...textOpts(),
        });
        if (slideData.columns?.length >= 3) {
          for (let i = 0; i < 3; i++) {
            const col = slideData.columns[i];
            const colKey = `col${i + 1}`;
            const items = [
              {
                text: col.heading,
                options: {
                  bold: true,
                  color: hex(theme.colors.accent),
                  fontSize: 16,
                  breakLine: true,
                },
              },
              ...col.items.map((item) => ({
                text: item,
                options: {
                  bullet: { code: "2022" },
                  color: hex(theme.colors.body),
                  fontSize: layout.pptx[colKey].fontSize,
                },
              })),
            ];
            pptxSlide.addText(items, {
              ...layout.pptx[colKey],
              fontFace: theme.fonts.body.split(",")[0].replace(/'/g, "").trim(),
              valign: "top",
              fit: "shrink",
            });
          }
        }
        break;

      case "QUOTE":
        pptxSlide.addText(slideData.quote_text || slideData.title, {
          ...layout.pptx.quote,
          ...textOpts({
            italic: true,
            fontSize: layout.pptx.quote.fontSize,
          }),
        });
        if (slideData.quote_author) {
          pptxSlide.addText(`— ${slideData.quote_author}`, {
            ...layout.pptx.author,
            ...textOpts({
              color: hex(theme.colors.accent),
              fontSize: layout.pptx.author.fontSize,
              italic: false,
            }),
          });
        }
        break;

      case "BIG_NUMBER":
        pptxSlide.addText(slideData.stat_number || slideData.title, {
          ...layout.pptx.number,
          ...textOpts({
            color: hex(theme.colors.accent),
            fontSize: layout.pptx.number.fontSize,
          }),
        });
        if (slideData.stat_label) {
          pptxSlide.addText(slideData.stat_label, {
            ...layout.pptx.subtitle,
            ...textOpts({
              color: hex(theme.colors.body),
              fontSize: layout.pptx.subtitle.fontSize,
              bold: false,
            }),
          });
        }
        break;

      case "TIMELINE":
        pptxSlide.addText(slideData.title, {
          ...layout.pptx.title,
          ...textOpts(),
        });
        if (slideData.timeline_items?.length) {
          const items = slideData.timeline_items;
          const colWidth = 8.5 / items.length;
          items.forEach((item, i) => {
            // Date label
            pptxSlide.addText(item.date, {
              x: 0.75 + i * colWidth,
              y: "30%",
              w: colWidth - 0.2,
              h: "10%",
              fontSize: 14,
              bold: true,
              color: hex(theme.colors.accent),
              fontFace: theme.fonts.heading.split(",")[0].replace(/'/g, "").trim(),
            });
            // Event description
            pptxSlide.addText(item.event, {
              x: 0.75 + i * colWidth,
              y: "42%",
              w: colWidth - 0.2,
              h: "40%",
              fontSize: 12,
              color: hex(theme.colors.body),
              fontFace: theme.fonts.body.split(",")[0].replace(/'/g, "").trim(),
              valign: "top",
            });
            // Timeline dot
            pptxSlide.addShape(pptx.ShapeType.ellipse, {
              x: 0.85 + i * colWidth,
              y: "26%",
              w: 0.15,
              h: 0.15,
              fill: { color: hex(theme.colors.accent) },
            });
          });
          // Timeline line
          pptxSlide.addShape(pptx.ShapeType.rect, {
            x: 0.75,
            y: "28%",
            w: 8.5,
            h: 0.02,
            fill: { color: hex(theme.colors.accent), transparency: 60 },
          });
        }
        break;

      case "ICON_GRID":
        pptxSlide.addText(slideData.title, {
          ...layout.pptx.title,
          ...textOpts(),
        });
        if (slideData.icon_items?.length) {
          const items = slideData.icon_items;
          const cols = items.length <= 4 ? 2 : 3;
          const rows = Math.ceil(items.length / cols);
          const cellW = 8 / cols;
          const cellH = 3.5 / rows;
          items.forEach((item, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            // Icon + Title
            pptxSlide.addText(
              [
                {
                  text: `${item.icon} ${item.title}`,
                  options: {
                    bold: true,
                    fontSize: 14,
                    color: hex(theme.colors.heading),
                    breakLine: true,
                  },
                },
                {
                  text: item.description,
                  options: {
                    fontSize: 11,
                    color: hex(theme.colors.body),
                  },
                },
              ],
              {
                x: 0.75 + col * cellW,
                y: 1.8 + row * cellH,
                w: cellW - 0.3,
                h: cellH - 0.2,
                fontFace: theme.fonts.body.split(",")[0].replace(/'/g, "").trim(),
                valign: "top",
              }
            );
          });
        }
        break;

      case "IMAGE_LEFT":
      case "IMAGE_RIGHT":
      case "TITLE_WITH_IMAGE":
        // For image layouts, render text content and a placeholder shape for the image area
        pptxSlide.addText(slideData.title, {
          ...(layout.pptx.title || {}),
          ...textOpts({ fontSize: (layout.pptx.title || {}).fontSize || 36 }),
        });
        if (slideData.bullets?.length) {
          pptxSlide.addText(
            slideData.bullets.map((b) => ({
              text: b,
              options: {
                bullet: { code: "2022" },
                color: hex(theme.colors.body),
                fontSize: (layout.pptx.body || {}).fontSize || 18,
              },
            })),
            {
              ...(layout.pptx.body || {}),
              fontFace: theme.fonts.body.split(",")[0].replace(/'/g, "").trim(),
              color: hex(theme.colors.body),
              valign: "top",
            }
          );
        }
        if (slideData.subtitle) {
          pptxSlide.addText(slideData.subtitle, {
            ...(layout.pptx.subtitle || { x: "52%", y: "50%", w: "43%", h: "30%" }),
            ...textOpts({
              color: hex(theme.colors.body),
              fontSize: 20,
              bold: false,
            }),
          });
        }
        // Image rendering or placeholder
        const imgPos = layout.pptx.image || { x: "3%", y: "10%", w: "44%", h: "80%" };
        if (slideData.image) {
          pptxSlide.addImage({
            data: slideData.image,
            ...imgPos
          });
        } else {
          pptxSlide.addShape(pptx.ShapeType.rect, {
            ...imgPos,
            fill: { color: hex(theme.colors.slideBgAlt) },
            line: { color: hex(theme.colors.accent), width: 1, dashType: "dash" },
          });
        }
        break;

      default:
        // Fallback: render as bullets
        pptxSlide.addText(slideData.title, {
          x: "5%", y: "5%", w: "90%", h: "12%",
          ...textOpts({ fontSize: 36 }),
        });
        if (slideData.bullets?.length) {
          pptxSlide.addText(
            slideData.bullets.map((b) => ({
              text: b,
              options: { bullet: { code: "2022" }, color: hex(theme.colors.body), fontSize: 20 },
            })),
            {
              x: "5%", y: "22%", w: "90%", h: "72%",
              fontFace: theme.fonts.body.split(",")[0].replace(/'/g, "").trim(),
              valign: "top",
            }
          );
        }
    }

    // 4. Speaker notes
    if (slideData.speaker_notes) {
      pptxSlide.addNotes(slideData.speaker_notes);
    }
  }

  // Generate as Buffer
  const buffer = await pptx.write({ outputType: "nodebuffer" });
  return buffer;
}
