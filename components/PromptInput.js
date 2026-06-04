"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "A startup pitch for an AI-powered fitness app",
  "Benefits of remote work for enterprise teams",
  "Introduction to machine learning for beginners",
  "Quarterly business review for Q4 2025",
  "Product launch deck for a sustainable fashion brand",
  "How blockchain is transforming supply chains",
];

/**
 * PromptInput — Hero prompt input with suggestion chips.
 */
export default function PromptInput({ onSubmit, isLoading }) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  const handleSuggestion = (suggestion) => {
    setPrompt(suggestion);
  };

  return (
    <div className="landing-page gradient-mesh">
      <div className="landing-hero">
        <div className="landing-badge">
          <Sparkles size={14} />
          AI-Powered Presentations
        </div>

        <h1 className="landing-title">
          Turn ideas into <span>stunning decks</span> instantly
        </h1>

        <p className="landing-subtitle">
          Just describe your topic and DeckAI will create a beautifully
          designed, professionally structured presentation in seconds.
        </p>

        <form onSubmit={handleSubmit} className="prompt-container">
          <textarea
            className="prompt-input pulse-glow"
            placeholder="Describe your presentation... e.g., 'A pitch deck for an AI startup raising Series A'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={2}
            disabled={isLoading}
            id="prompt-input"
          />
          <button
            type="submit"
            className="prompt-submit"
            disabled={!prompt.trim() || isLoading}
            id="prompt-submit"
          >
            {isLoading ? (
              <div className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }} />
            ) : (
              <ArrowRight size={20} />
            )}
          </button>
        </form>

        <div className="chips-container">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              className="chip"
              onClick={() => handleSuggestion(s)}
              disabled={isLoading}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-title">Instant Generation</div>
            <div className="feature-desc">
              From prompt to polished deck in under 30 seconds with
              AI-powered content and design.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <div className="feature-title">8 Premium Themes</div>
            <div className="feature-desc">
              Curated color palettes, typography, and layouts that make
              every slide look professional.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <div className="feature-title">AI Refinement</div>
            <div className="feature-desc">
              Chat with AI to tweak your slides. Say &quot;make it more casual&quot;
              and watch it transform.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
