/**
 * Layout Registry — 12 slide layout templates.
 * Each layout defines its content slots, CSS class, and PPTX coordinates.
 * The `slots` array describes what content fields the AI should fill.
 */

const layouts = {
  TITLE_HERO: {
    id: 'TITLE_HERO',
    name: 'Title Hero',
    description: 'Full-width centered title + subtitle',
    icon: 'Presentation',
    slots: ['title', 'subtitle'],
    cssClass: 'layout-title-hero',
    pptx: {
      title: { x: '10%', y: '30%', w: '80%', h: '25%', align: 'center', fontSize: 52, bold: true },
      subtitle: { x: '15%', y: '58%', w: '70%', h: '15%', align: 'center', fontSize: 24 },
    },
  },

  TITLE_WITH_IMAGE: {
    id: 'TITLE_WITH_IMAGE',
    name: 'Title with Image',
    description: 'Split layout: image left, title right',
    icon: 'ImageIcon',
    slots: ['title', 'subtitle', 'image'],
    cssClass: 'layout-title-image',
    pptx: {
      title: { x: '52%', y: '25%', w: '43%', h: '20%', align: 'left', fontSize: 44, bold: true },
      subtitle: { x: '52%', y: '50%', w: '43%', h: '30%', align: 'left', fontSize: 20 },
      image: { x: '3%', y: '10%', w: '45%', h: '80%' },
    },
  },

  BULLETS: {
    id: 'BULLETS',
    name: 'Bullet Points',
    description: 'Title + bullet list for standard content',
    icon: 'List',
    slots: ['title', 'bullets'],
    cssClass: 'layout-bullets',
    pptx: {
      title: { x: '5%', y: '5%', w: '90%', h: '12%', align: 'left', fontSize: 36, bold: true },
      body: { x: '5%', y: '22%', w: '90%', h: '72%', fontSize: 20, bullet: true, lineSpacing: 38 },
    },
  },

  TWO_COLUMN: {
    id: 'TWO_COLUMN',
    name: 'Two Columns',
    description: 'Title + two side-by-side content areas',
    icon: 'Columns2',
    slots: ['title', 'columns'],
    cssClass: 'layout-two-column',
    pptx: {
      title: { x: '5%', y: '5%', w: '90%', h: '12%', align: 'left', fontSize: 36, bold: true },
      col1: { x: '5%', y: '22%', w: '43%', h: '72%', fontSize: 18, bullet: true, lineSpacing: 32 },
      col2: { x: '52%', y: '22%', w: '43%', h: '72%', fontSize: 18, bullet: true, lineSpacing: 32 },
    },
  },

  THREE_COLUMN: {
    id: 'THREE_COLUMN',
    name: 'Three Columns',
    description: 'Title + three content pillars',
    icon: 'Columns3',
    slots: ['title', 'columns'],
    cssClass: 'layout-three-column',
    pptx: {
      title: { x: '5%', y: '5%', w: '90%', h: '12%', align: 'left', fontSize: 36, bold: true },
      col1: { x: '3%', y: '22%', w: '30%', h: '72%', fontSize: 16, bullet: true, lineSpacing: 28 },
      col2: { x: '35%', y: '22%', w: '30%', h: '72%', fontSize: 16, bullet: true, lineSpacing: 28 },
      col3: { x: '67%', y: '22%', w: '30%', h: '72%', fontSize: 16, bullet: true, lineSpacing: 28 },
    },
  },

  IMAGE_LEFT: {
    id: 'IMAGE_LEFT',
    name: 'Image Left',
    description: 'Image on left, text on right',
    icon: 'PanelLeft',
    slots: ['title', 'bullets', 'image'],
    cssClass: 'layout-image-left',
    pptx: {
      title: { x: '50%', y: '12%', w: '45%', h: '15%', align: 'left', fontSize: 36, bold: true },
      body: { x: '50%', y: '30%', w: '45%', h: '60%', fontSize: 18, bullet: true, lineSpacing: 32 },
      image: { x: '3%', y: '10%', w: '44%', h: '80%' },
    },
  },

  IMAGE_RIGHT: {
    id: 'IMAGE_RIGHT',
    name: 'Image Right',
    description: 'Text on left, image on right',
    icon: 'PanelRight',
    slots: ['title', 'bullets', 'image'],
    cssClass: 'layout-image-right',
    pptx: {
      title: { x: '5%', y: '12%', w: '45%', h: '15%', align: 'left', fontSize: 36, bold: true },
      body: { x: '5%', y: '30%', w: '45%', h: '60%', fontSize: 18, bullet: true, lineSpacing: 32 },
      image: { x: '53%', y: '10%', w: '44%', h: '80%' },
    },
  },

  QUOTE: {
    id: 'QUOTE',
    name: 'Quote',
    description: 'Large centered quote with attribution',
    icon: 'Quote',
    slots: ['quote', 'author'],
    cssClass: 'layout-quote',
    pptx: {
      quote: { x: '12%', y: '22%', w: '76%', h: '40%', align: 'center', fontSize: 40, italic: true },
      author: { x: '12%', y: '68%', w: '76%', h: '10%', align: 'center', fontSize: 22, bold: true },
    },
  },

  BIG_NUMBER: {
    id: 'BIG_NUMBER',
    name: 'Big Number',
    description: 'Giant statistic with context',
    icon: 'Hash',
    slots: ['stat', 'label'],
    cssClass: 'layout-big-number',
    pptx: {
      number: { x: '10%', y: '15%', w: '80%', h: '40%', align: 'center', fontSize: 110, bold: true },
      subtitle: { x: '10%', y: '60%', w: '80%', h: '18%', align: 'center', fontSize: 28 },
    },
  },

  TIMELINE: {
    id: 'TIMELINE',
    name: 'Timeline',
    description: 'Horizontal timeline of events',
    icon: 'ArrowRightLeft',
    slots: ['title', 'timeline'],
    cssClass: 'layout-timeline',
    pptx: {
      title: { x: '5%', y: '5%', w: '90%', h: '12%', align: 'left', fontSize: 36, bold: true },
      // Timeline items are dynamically positioned in the PPTX builder
    },
  },

  ICON_GRID: {
    id: 'ICON_GRID',
    name: 'Icon Grid',
    description: '2×2 or 3×2 grid of icon+text feature cards',
    icon: 'LayoutGrid',
    slots: ['title', 'icon_items'],
    cssClass: 'layout-icon-grid',
    pptx: {
      title: { x: '5%', y: '5%', w: '90%', h: '12%', align: 'left', fontSize: 36, bold: true },
      // Grid items are dynamically positioned in the PPTX builder
    },
  },

  CLOSING: {
    id: 'CLOSING',
    name: 'Closing',
    description: 'Thank you / CTA ending slide',
    icon: 'PartyPopper',
    slots: ['title', 'subtitle'],
    cssClass: 'layout-closing',
    pptx: {
      title: { x: '10%', y: '30%', w: '80%', h: '25%', align: 'center', fontSize: 48, bold: true },
      subtitle: { x: '15%', y: '58%', w: '70%', h: '20%', align: 'center', fontSize: 22 },
    },
  },
};

export const getLayout = (layoutId) => layouts[layoutId] || layouts.BULLETS;
export const getAllLayouts = () => Object.values(layouts);
export const layoutIds = Object.keys(layouts);
export default layouts;
