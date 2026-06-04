"use client";

/**
 * LoadingAnimation — Skeleton shimmer cards shown while AI generates slides.
 */
export default function LoadingAnimation({ slideCount = 6, message = "Generating your presentation..." }) {
  return (
    <>
      {/* Thumbnail skeletons */}
      <div className="workspace-thumbnails">
        {Array.from({ length: slideCount }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              width: "100%",
              aspectRatio: "16/9",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Main area skeletons */}
      <div className="workspace-main">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "var(--app-accent)",
            marginBottom: "16px",
          }}
        >
          <div className="spinner" />
          <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{message}</span>
        </div>

        {Array.from({ length: slideCount }).map((_, i) => (
          <div
            key={i}
            style={{ width: "100%", maxWidth: "var(--slide-max-width)" }}
          >
            <div
              className="skeleton"
              style={{
                width: "100%",
                aspectRatio: "16/9",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * Inline skeleton for the outline generation phase
 */
export function OutlineLoading() {
  return (
    <div className="outline-container">
      <div className="outline-header" style={{ marginBottom: "32px" }}>
        <div
          className="skeleton"
          style={{ width: "60%", height: "32px", margin: "0 auto 12px" }}
        />
        <div
          className="skeleton"
          style={{ width: "40%", height: "18px", margin: "0 auto" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          color: "var(--app-accent)",
          marginBottom: "24px",
        }}
      >
        <div className="spinner" />
        <span style={{ fontSize: "0.875rem" }}>Creating your outline...</span>
      </div>

      <div className="outline-cards">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              width: "100%",
              height: "100px",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
