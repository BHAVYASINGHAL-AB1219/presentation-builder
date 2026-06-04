"use client";

import { useRef, useCallback } from "react";
import SlideCard, { SlideThumbnail } from "./SlideCard";

/**
 * SlideRenderer — The main presentation canvas.
 * Shows slide thumbnails on the left and full-size cards in the center.
 */
export default function SlideRenderer({
  slides,
  activeSlide,
  onSlideClick,
}) {
  const mainRef = useRef(null);
  const slideRefs = useRef([]);

  const scrollToSlide = useCallback(
    (index) => {
      onSlideClick(index);
      slideRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
    [onSlideClick]
  );

  if (!slides || slides.length === 0) {
    return (
      <div className="workspace-main" style={{ justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "var(--app-text-muted)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📑</div>
          <p>No slides generated yet.</p>
          <p style={{ fontSize: "0.875rem" }}>
            Enter a prompt to create your presentation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail sidebar */}
      <div className="workspace-thumbnails">
        {slides.map((slide, i) => (
          <SlideThumbnail
            key={slide.slide_number || i}
            slide={slide}
            index={i}
            isActive={activeSlide === i}
            onClick={scrollToSlide}
          />
        ))}
      </div>

      {/* Main slide area */}
      <div className="workspace-main" ref={mainRef}>
        {slides.map((slide, i) => (
          <div
            key={slide.slide_number || i}
            ref={(el) => (slideRefs.current[i] = el)}
            style={{ width: "100%", maxWidth: "var(--slide-max-width)" }}
          >
            <SlideCard
              slide={slide}
              index={i}
              isActive={activeSlide === i}
              onClick={scrollToSlide}
            />
          </div>
        ))}
      </div>
    </>
  );
}
