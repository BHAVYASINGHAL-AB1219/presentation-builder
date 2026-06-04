"use client";

/**
 * SlideCard — Renders a single slide with the correct layout.
 * Accepts slide data + theme config and renders the appropriate layout.
 */

export default function SlideCard({ slide, index, isActive, onClick }) {
  const layoutClass = getLayoutClass(slide.layout_type);
  const decorativeElements = getDecorativeElements(slide.layout_type, index);

  return (
    <div
      className={`slide-card ${layoutClass} slide-card-animate`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => onClick?.(index)}
      role="button"
      tabIndex={0}
      aria-label={`Slide ${slide.slide_number}: ${slide.title}`}
    >
      {/* Decorative shapes */}
      {decorativeElements}

      {/* Slide content based on layout */}
      <div className="slide-content">{renderLayout(slide)}</div>
    </div>
  );
}

/** Miniature version for the thumbnail sidebar */
export function SlideThumbnail({ slide, index, isActive, onClick }) {
  const layoutClass = getLayoutClass(slide.layout_type);

  return (
    <div
      className={`thumbnail ${isActive ? "active" : ""}`}
      onClick={() => onClick?.(index)}
      title={`Slide ${slide.slide_number}: ${slide.title}`}
    >
      <div
        className={`slide-card ${layoutClass}`}
        style={{
          borderRadius: "4px",
          fontSize: "3px",
          pointerEvents: "none",
        }}
      >
        <div className="slide-content">{renderLayout(slide)}</div>
      </div>
      <span className="thumbnail-number">{slide.slide_number}</span>
    </div>
  );
}

/* ============================================================
   LAYOUT RENDERERS
   ============================================================ */

function renderLayout(slide) {
  switch (slide.layout_type) {
    case "TITLE_HERO":
      return <TitleHeroLayout slide={slide} />;
    case "TITLE_WITH_IMAGE":
      return <TitleWithImageLayout slide={slide} />;
    case "BULLETS":
      return <BulletsLayout slide={slide} />;
    case "TWO_COLUMN":
      return <TwoColumnLayout slide={slide} />;
    case "THREE_COLUMN":
      return <ThreeColumnLayout slide={slide} />;
    case "IMAGE_LEFT":
      return <ImageLeftLayout slide={slide} />;
    case "IMAGE_RIGHT":
      return <ImageRightLayout slide={slide} />;
    case "QUOTE":
      return <QuoteLayout slide={slide} />;
    case "BIG_NUMBER":
      return <BigNumberLayout slide={slide} />;
    case "TIMELINE":
      return <TimelineLayout slide={slide} />;
    case "ICON_GRID":
      return <IconGridLayout slide={slide} />;
    case "CLOSING":
      return <ClosingLayout slide={slide} />;
    default:
      return <BulletsLayout slide={slide} />;
  }
}

function TitleHeroLayout({ slide }) {
  return (
    <>
      <h1 className="slide-title">{slide.title}</h1>
      {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
    </>
  );
}

function TitleWithImageLayout({ slide }) {
  return (
    <>
      <div className="slide-image-area">
        <div className="slide-image-placeholder">
          <span>🖼️</span>
        </div>
      </div>
      <div className="slide-text-area">
        <h2 className="slide-title">{slide.title}</h2>
        {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
        {slide.bullets && (
          <div className="slide-bullets" style={{ marginTop: "8px" }}>
            {slide.bullets.map((b, i) => (
              <div className="slide-bullet-item" key={i}>
                <span className="slide-bullet-dot" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function BulletsLayout({ slide }) {
  return (
    <>
      <h2 className="slide-title">{slide.title}</h2>
      <div className="slide-bullets">
        {(slide.bullets || []).map((bullet, i) => (
          <div className="slide-bullet-item" key={i}>
            <span className="slide-bullet-dot" />
            <span>{bullet}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function TwoColumnLayout({ slide }) {
  const columns = slide.columns || [];
  return (
    <>
      <h2 className="slide-title">{slide.title}</h2>
      <div className="slide-columns">
        {columns.slice(0, 2).map((col, i) => (
          <div className="slide-column" key={i}>
            <div className="slide-column-heading">{col.heading}</div>
            {(col.items || []).map((item, j) => (
              <div className="slide-column-item" key={j}>
                <span className="slide-bullet-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function ThreeColumnLayout({ slide }) {
  const columns = slide.columns || [];
  return (
    <>
      <h2 className="slide-title">{slide.title}</h2>
      <div className="slide-columns">
        {columns.slice(0, 3).map((col, i) => (
          <div className="slide-column" key={i}>
            <div className="slide-column-heading">{col.heading}</div>
            {(col.items || []).map((item, j) => (
              <div className="slide-column-item" key={j}>
                <span className="slide-bullet-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function ImageLeftLayout({ slide }) {
  return (
    <>
      <div className="slide-image-area">
        <div className="slide-image-placeholder">
          <span>🖼️</span>
        </div>
      </div>
      <div className="slide-text-area">
        <h2 className="slide-title">{slide.title}</h2>
        <div className="slide-bullets">
          {(slide.bullets || []).map((b, i) => (
            <div className="slide-bullet-item" key={i}>
              <span className="slide-bullet-dot" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ImageRightLayout({ slide }) {
  return (
    <>
      <div className="slide-image-area">
        <div className="slide-image-placeholder">
          <span>🖼️</span>
        </div>
      </div>
      <div className="slide-text-area">
        <h2 className="slide-title">{slide.title}</h2>
        <div className="slide-bullets">
          {(slide.bullets || []).map((b, i) => (
            <div className="slide-bullet-item" key={i}>
              <span className="slide-bullet-dot" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function QuoteLayout({ slide }) {
  return (
    <>
      <span className="slide-quote-mark">&ldquo;</span>
      <p className="slide-quote-text">
        {slide.quote_text || slide.title}
      </p>
      <span className="slide-quote-author">
        — {slide.quote_author || ""}
      </span>
    </>
  );
}

function BigNumberLayout({ slide }) {
  return (
    <>
      <div className="slide-big-number">
        {slide.stat_number || slide.title}
      </div>
      <p className="slide-big-label">
        {slide.stat_label || slide.subtitle || ""}
      </p>
    </>
  );
}

function TimelineLayout({ slide }) {
  const items = slide.timeline_items || [];
  return (
    <>
      <h2 className="slide-title">{slide.title}</h2>
      <div className="slide-timeline">
        {items.map((item, i) => (
          <div className="slide-timeline-item" key={i}>
            <div className="slide-timeline-date">{item.date}</div>
            <div className="slide-timeline-event">{item.event}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function IconGridLayout({ slide }) {
  const items = slide.icon_items || [];
  return (
    <>
      <h2 className="slide-title">{slide.title}</h2>
      <div className="slide-icon-grid">
        {items.map((item, i) => (
          <div className="slide-icon-card" key={i}>
            <span className="slide-icon-emoji">{item.icon}</span>
            <div className="slide-icon-title">{item.title}</div>
            <div className="slide-icon-desc">{item.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function ClosingLayout({ slide }) {
  return (
    <>
      <h1 className="slide-title">{slide.title}</h1>
      {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
    </>
  );
}

/* ============================================================
   HELPERS
   ============================================================ */

function getLayoutClass(layoutType) {
  const map = {
    TITLE_HERO: "layout-title-hero",
    TITLE_WITH_IMAGE: "layout-title-image",
    BULLETS: "layout-bullets",
    TWO_COLUMN: "layout-two-column",
    THREE_COLUMN: "layout-three-column",
    IMAGE_LEFT: "layout-image-left",
    IMAGE_RIGHT: "layout-image-right",
    QUOTE: "layout-quote",
    BIG_NUMBER: "layout-big-number",
    TIMELINE: "layout-timeline",
    ICON_GRID: "layout-icon-grid",
    CLOSING: "layout-closing",
  };
  return map[layoutType] || "layout-bullets";
}

function getDecorativeElements(layoutType, index) {
  // Vary decorations based on slide position for visual interest
  const pattern = index % 4;

  switch (pattern) {
    case 0:
      return (
        <>
          <div className="slide-shape-accent-bar" />
          <div className="slide-shape-corner-circle" />
        </>
      );
    case 1:
      return (
        <>
          <div className="slide-shape-top-bar" />
          <div className="slide-shape-dots" />
        </>
      );
    case 2:
      return (
        <>
          <div className="slide-shape-bottom-line" />
          <div className="slide-shape-corner-circle" />
        </>
      );
    case 3:
      return (
        <>
          <div className="slide-shape-accent-bar" />
          <div className="slide-shape-dots" />
        </>
      );
    default:
      return null;
  }
}
