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
  History,
} from "lucide-react";
import SlideRenderer from "@/components/SlideRenderer";
import LoadingAnimation from "@/components/LoadingAnimation";
import { OutlineLoading } from "@/components/LoadingAnimation";
import OutlineEditor from "@/components/OutlineEditor";
import ThemePicker from "@/components/ThemePicker";
import RefineChat from "@/components/RefineChat";
import ExportPanel from "@/components/ExportPanel";
import VersionHistoryPanel from "@/components/VersionHistoryPanel";
import { getTheme } from "@/lib/design/themes";

/**
 * Create Page — Main workspace with three-panel layout.
 * Flow: Prompt → Outline → Slides → Edit/Refine → Export
 */

const STEPS = {
  GENERATING_OUTLINE: "generating_outline",
  REVIEWING_OUTLINE: "reviewing_outline",
  GENERATING_SLIDES: "generating_slides",
  GENERATING_DESIGN: "generating_design",
  GENERATING_IMAGES: "generating_images",
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

  // Version History state
  const [history, setHistory] = useState([]);
  const [activeVersionId, setActiveVersionId] = useState(null);

  // Theme state
  const [currentTheme, setCurrentTheme] = useState("midnight");
  const [customTheme, setCustomTheme] = useState(null);

  // UI state
  const [sidebarTab, setSidebarTab] = useState("refine"); // 'refine' | 'theme' | 'export'
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  // Apply theme CSS variables whenever theme changes
  useEffect(() => {
    const theme = customTheme || getTheme(currentTheme);
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
  }, [currentTheme, customTheme]);

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
      
      // Now generate the design using Kimi
      await generateDesign(data.slides);
    } catch (err) {
      setError(err.message);
      setStep(STEPS.REVIEWING_OUTLINE);
    }
  };

  const generateDesign = async (rawSlides) => {
    setStep(STEPS.GENERATING_DESIGN);
    setError(null);

    try {
      const res = await fetch("/api/generate/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: rawSlides }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate design");
      }

      const data = await res.json();
      
      // Apply the theme
      setCustomTheme(data.design.theme);
      setCurrentTheme("Custom AI");
      
      // Now trigger Flux.1 image generation for the slides
      await generateImages(rawSlides);
    } catch (err) {
      setError("Design generation failed, falling back to default theme. " + err.message);
      // Fallback but still try to generate images
      await generateImages(rawSlides);
    }
  };

  const generateImages = async (currentSlides) => {
    // Check if any slides actually need images
    const needsImages = currentSlides.some(s => s.image_prompt);
    
    if (!needsImages) {
      setSlides(currentSlides);
      setActiveSlide(0);
      setStep(STEPS.VIEWING_SLIDES);
      
      // Save initial version
      const vId = Date.now();
      setHistory([{
        id: vId,
        timestamp: new Date().toISOString(),
        description: "Initial AI Generation",
        slides: currentSlides,
        theme: customTheme
      }]);
      setActiveVersionId(vId);
      return;
    }

    setStep(STEPS.GENERATING_IMAGES);
    try {
      const res = await fetch("/api/generate/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: currentSlides }),
      });

      if (res.ok) {
        const data = await res.json();
        const imagesMap = data.images || {};
        
        // Merge the generated images back into the slides
        const updatedSlides = currentSlides.map(slide => {
          if (imagesMap[slide.slide_number]) {
            return { ...slide, image: imagesMap[slide.slide_number] };
          }
          return slide;
        });
        
        setSlides(updatedSlides);
        
        // Save initial version
        const vId = Date.now();
        setHistory([{
          id: vId,
          timestamp: new Date().toISOString(),
          description: "Initial AI Generation",
          slides: updatedSlides,
          theme: customTheme
        }]);
        setActiveVersionId(vId);
      } else {
        throw new Error("Failed to fetch images");
      }
    } catch (err) {
      console.error("Image generation error:", err);
      setError("Image generation encountered an error. Some images may be missing.");
      setSlides(currentSlides);
      
      // Save initial version even on image failure
      const vId = Date.now();
      setHistory([{
        id: vId,
        timestamp: new Date().toISOString(),
        description: "Initial AI Generation",
        slides: currentSlides,
        theme: customTheme
      }]);
      setActiveVersionId(vId);
    } finally {
      setActiveSlide(0);
      setStep(STEPS.VIEWING_SLIDES);
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

  const handleSlidesUpdate = useCallback((newSlides, description = "Manual Edit") => {
    setSlides(newSlides);
    
    // Save version history
    const vId = Date.now();
    setHistory(prev => [{
      id: vId,
      timestamp: new Date().toISOString(),
      description,
      slides: newSlides,
      theme: customTheme
    }, ...prev]);
    setActiveVersionId(vId);
  }, [customTheme]);

  const handleRestoreVersion = useCallback((version) => {
    setSlides(version.slides);
    setCustomTheme(version.theme);
    setCurrentTheme(version.theme ? "Custom AI" : currentTheme);
    setActiveVersionId(version.id);
  }, [currentTheme]);

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
  if (
    step === STEPS.GENERATING_SLIDES ||
    step === STEPS.GENERATING_DESIGN ||
    step === STEPS.GENERATING_IMAGES
  ) {
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
          message={
            step === STEPS.GENERATING_DESIGN
              ? "Kimi is designing your theme & layouts..."
              : step === STEPS.GENERATING_IMAGES
              ? "Flux.1 is rendering your images..."
              : "Gemini is writing your slides..."
          }
        />

        <div className="workspace-sidebar" />
        <div className="workspace-statusbar">
          <span>
            {step === STEPS.GENERATING_DESIGN
              ? "Designing..."
              : step === STEPS.GENERATING_IMAGES
              ? "Rendering Images..."
              : "Generating..."}
          </span>
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
            className={`sidebar-tab ${sidebarTab === "history" ? "active" : ""}`}
            onClick={() => setSidebarTab("history")}
            title="Version History"
          >
            <History size={18} />
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

      {error && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            padding: "12px 24px",
            background: "rgba(239, 68, 68, 0.9)",
            border: "1px solid rgba(239, 68, 68, 1)",
            borderRadius: "8px",
            color: "#fff",
            textAlign: "center",
            fontSize: "0.875rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          {error}
          <button 
            className="btn btn-sm" 
            style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "none" }}
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

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
            isVisible={sidebarTab === "refine"}
          />
        )}
        {sidebarTab === "theme" && (
          <ThemePicker
            currentTheme={currentTheme}
            onThemeChange={(t) => {
              setCurrentTheme(t);
              setCustomTheme(null);
            }}
            isVisible={sidebarTab === "theme"}
          />
        )}
        {sidebarTab === "history" && (
          <VersionHistoryPanel
            history={history}
            activeVersionId={activeVersionId}
            onRestore={handleRestoreVersion}
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
