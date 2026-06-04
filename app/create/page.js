"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Download,
  Palette,
  MessageSquare,
  ArrowLeft,
  Layers,
} from "lucide-react";
import SlideRenderer from "@/components/SlideRenderer";
import LoadingAnimation from "@/components/LoadingAnimation";
import { OutlineLoading } from "@/components/LoadingAnimation";
import OutlineEditor from "@/components/OutlineEditor";
import ThemePicker from "@/components/ThemePicker";
import RefineChat from "@/components/RefineChat";
import ExportPanel from "@/components/ExportPanel";
import { getTheme } from "@/lib/design/themes";

/**
 * Create Page — Main workspace with three-panel layout.
 * Flow: Prompt → Outline → Slides → Edit/Refine → Export
 */

// Steps in the creation flow
const STEPS = {
  GENERATING_OUTLINE: "generating_outline",
  REVIEWING_OUTLINE: "reviewing_outline",
  GENERATING_SLIDES: "generating_slides",
  VIEWING_SLIDES: "viewing_slides",
};

export default function CreatePage() {
  const router = useRouter();

  // Core state
  const [step, setStep] = useState(STEPS.GENERATING_OUTLINE);
  const [prompt, setPrompt] = useState("");
  const [outline, setOutline] = useState(null);
  const [slides, setSlides] = useState([]);
  const [presentationTitle, setPresentationTitle] = useState("Untitled");
  const [activeSlide, setActiveSlide] = useState(0);

  // Theme state
  const [currentTheme, setCurrentTheme] = useState("midnight");

  // UI state
  const [sidebarTab, setSidebarTab] = useState("refine"); // 'refine' | 'theme' | 'export'
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  // Apply theme CSS variables whenever theme changes
  useEffect(() => {
    const theme = getTheme(currentTheme);
    const root = document.documentElement;

    root.style.setProperty("--slide-bg", theme.colors.slideBg);
    root.style.setProperty("--slide-bg-alt", theme.colors.slideBgAlt);
    root.style.setProperty("--slide-card-bg", theme.colors.cardBg);
    root.style.setProperty("--slide-heading", theme.colors.heading);
    root.style.setProperty("--slide-body", theme.colors.body);
    root.style.setProperty("--slide-muted", theme.colors.muted);
    root.style.setProperty("--slide-accent", theme.colors.accent);
    root.style.setProperty("--slide-accent-light", theme.colors.accentLight);
    root.style.setProperty("--slide-accent-glow", theme.colors.accentGlow);
    root.style.setProperty("--slide-border", theme.colors.border);
    root.style.setProperty("--slide-gradient", theme.colors.gradient);
    root.style.setProperty("--slide-font-heading", theme.fonts.heading);
    root.style.setProperty("--slide-font-body", theme.fonts.body);
    root.style.setProperty("--slide-shape-color", theme.decorative.shapeColor);
    root.style.setProperty(
      "--slide-shape-opacity",
      String(theme.decorative.shapeOpacity)
    );
    root.style.setProperty(
      "--slide-accent-bar",
      theme.decorative.accentBarColor
    );
    root.style.setProperty(
      "--slide-corner-radius",
      theme.decorative.cornerRadius
    );
  }, [currentTheme]);

  // On mount, grab the prompt from URL and start generating
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const savedPrompt = urlParams.get("prompt");
    
    if (savedPrompt) {
      setPrompt(savedPrompt);
      // Clean up the URL so it looks nice
      window.history.replaceState({}, document.title, "/create");
      generateOutline(savedPrompt);
    } else {
      // No prompt? Go back to landing
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- API Calls ---

  const generateOutline = async (userPrompt) => {
    setStep(STEPS.GENERATING_OUTLINE);
    setError(null);

    try {
      const res = await fetch("/api/generate/outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate outline");
      }

      const data = await res.json();
      console.log("Outline API response:", data);
      
      setOutline(data.outline);
      setPresentationTitle(data.outline?.title || "Untitled");
      setStep(STEPS.REVIEWING_OUTLINE);
    } catch (err) {
      console.error("Outline error:", err);
      setError(err.message);
      setStep(STEPS.REVIEWING_OUTLINE);
    }
  };

  const generateSlides = async () => {
    if (!outline) return;
    setStep(STEPS.GENERATING_SLIDES);
    setError(null);

    try {
      const res = await fetch("/api/generate/slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outline }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate slides");
      }

      const data = await res.json();
      setSlides(data.slides);
      setActiveSlide(0);
      setStep(STEPS.VIEWING_SLIDES);
    } catch (err) {
      setError(err.message);
      setStep(STEPS.REVIEWING_OUTLINE);
    }
  };

  const handleExport = async (format) => {
    if (format === "pdf") {
      window.print();
      return;
    }

    if (format === "pptx") {
      setIsExporting(true);
      try {
        const res = await fetch("/api/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slides,
            theme: currentTheme,
            title: presentationTitle,
          }),
        });

        if (!res.ok) throw new Error("Export failed");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${presentationTitle.replace(/[^a-zA-Z0-9]/g, "_")}.pptx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        setError("Export failed: " + err.message);
      } finally {
        setIsExporting(false);
      }
    }
  };

  const handleSlidesUpdate = useCallback((newSlides) => {
    setSlides(newSlides);
  }, []);

  // --- Render ---

  // Pre-slide steps (outline generation/review)
  if (
    step === STEPS.GENERATING_OUTLINE ||
    step === STEPS.REVIEWING_OUTLINE
  ) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--app-bg)",
          overflowY: "auto",
        }}
      >
        {/* Simple top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 24px",
            borderBottom: "1px solid var(--app-border)",
            background: "var(--app-bg-elevated)",
          }}
        >
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => router.push("/")}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: "0.875rem",
              color: "var(--app-text-secondary)",
            }}
          >
            {prompt && `"${prompt.slice(0, 60)}${prompt.length > 60 ? "..." : ""}"`}
          </div>
        </div>

        {error && (
          <div
            style={{
              maxWidth: "600px",
              margin: "24px auto",
              padding: "16px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              color: "var(--app-danger)",
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            {error}
            <br />
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: "12px" }}
              onClick={() => generateOutline(prompt)}
            >
              Retry
            </button>
          </div>
        )}

        {step === STEPS.GENERATING_OUTLINE && <OutlineLoading />}
        {step === STEPS.REVIEWING_OUTLINE && outline && (
          <OutlineEditor
            outline={outline}
            onApprove={generateSlides}
            onRegenerate={() => generateOutline(prompt)}
            isLoading={false}
          />
        )}
      </div>
    );
  }

  // Slide generation loading state
  if (step === STEPS.GENERATING_SLIDES) {
    return (
      <div className="workspace">
        {/* Navbar */}
        <div className="workspace-navbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => router.push("/")}
            >
              <ArrowLeft size={16} />
            </button>
            <Layers size={18} style={{ color: "var(--app-accent)" }} />
            <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
              DeckAI
            </span>
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--app-text-secondary)",
            }}
          >
            {presentationTitle}
          </div>
          <div />
        </div>

        <LoadingAnimation
          slideCount={outline?.slides?.length || 6}
          message="Generating your slides..."
        />

        <div className="workspace-sidebar" />
        <div className="workspace-statusbar">
          <span>Generating...</span>
          <span>DeckAI</span>
        </div>
      </div>
    );
  }

  // Main workspace with slides
  return (
    <div className="workspace">
      {/* Navbar */}
      <div className="workspace-navbar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => router.push("/")}
          >
            <ArrowLeft size={16} />
          </button>
          <Layers size={18} style={{ color: "var(--app-accent)" }} />
          <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
            DeckAI
          </span>
          <span
            style={{
              color: "var(--app-text-muted)",
              fontSize: "0.8125rem",
              marginLeft: "4px",
            }}
          >
            / {presentationTitle}
          </span>
        </div>

        {/* Center: sidebar tab switcher */}
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            className={`btn btn-sm ${
              sidebarTab === "refine" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setSidebarTab("refine")}
          >
            <MessageSquare size={14} />
            Refine
          </button>
          <button
            className={`btn btn-sm ${
              sidebarTab === "theme" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setSidebarTab("theme")}
          >
            <Palette size={14} />
            Theme
          </button>
          <button
            className={`btn btn-sm ${
              sidebarTab === "export" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setSidebarTab("export")}
          >
            <Download size={14} />
            Export
          </button>
        </div>

        {/* Right: quick export */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleExport("pptx")}
          disabled={isExporting || !slides.length}
        >
          {isExporting ? (
            <div
              className="spinner"
              style={{ width: "14px", height: "14px" }}
            />
          ) : (
            <Download size={14} />
          )}
          Download PPTX
        </button>
      </div>

      {/* Slide renderer (includes thumbnails + main area) */}
      <SlideRenderer
        slides={slides}
        activeSlide={activeSlide}
        onSlideClick={setActiveSlide}
      />

      {/* Right sidebar */}
      <div className="workspace-sidebar">
        {sidebarTab === "refine" && (
          <RefineChat
            slides={slides}
            onSlidesUpdate={handleSlidesUpdate}
            isVisible={true}
          />
        )}
        {sidebarTab === "theme" && (
          <ThemePicker
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
          />
        )}
        {sidebarTab === "export" && (
          <ExportPanel
            slides={slides}
            title={presentationTitle}
            isExporting={isExporting}
            onExport={handleExport}
          />
        )}
      </div>

      {/* Status bar */}
      <div className="workspace-statusbar">
        <span>
          {slides.length} slide{slides.length !== 1 ? "s" : ""} ·{" "}
          {currentTheme} theme
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={12} style={{ color: "var(--app-accent)" }} />
          <span>Powered by DeckAI</span>
        </div>
      </div>
    </div>
  );
}
