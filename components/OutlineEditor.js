"use client";

/**
 * OutlineEditor — Displays the AI-generated outline as editable cards.
 * Users can review and approve before full slide generation.
 */
export default function OutlineEditor({ outline, onApprove, onRegenerate, isLoading }) {
  if (!outline) return null;

  return (
    <div className="outline-container">
      <div className="outline-header">
        <h2 className="outline-title">{outline.title}</h2>
        <p className="outline-meta">
          {outline.subtitle} · {outline.tone} tone · {outline.slides?.length}{" "}
          slides · For {outline.target_audience}
        </p>
      </div>

      <div className="outline-cards">
        {outline.slides?.map((slide, i) => (
          <div key={i} className="outline-card" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="outline-card-header">
              <div className="outline-card-number">{slide.slide_number}</div>
              <div>
                <div className="outline-card-title">{slide.title}</div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--app-text-muted)",
                    marginTop: "2px",
                  }}
                >
                  {slide.section} · {slide.suggested_layout}
                </div>
              </div>
            </div>
            <ul className="outline-card-points">
              {slide.talking_points?.map((tp, j) => (
                <li key={j}>{tp}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: "32px",
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={onRegenerate}
          disabled={isLoading}
        >
          ↻ Regenerate Outline
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={onApprove}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner" style={{ width: "16px", height: "16px" }} />
              Generating Slides...
            </>
          ) : (
            "✓ Generate Slides"
          )}
        </button>
      </div>
    </div>
  );
}
