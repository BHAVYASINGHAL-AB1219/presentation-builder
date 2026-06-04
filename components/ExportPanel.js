"use client";

import { FileDown, FileText } from "lucide-react";

/**
 * ExportPanel — Export options for PPTX and PDF.
 */
export default function ExportPanel({ slides, title, isExporting, onExport }) {
  const hasSlides = slides && slides.length > 0;

  return (
    <div className="export-panel">
      <div
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--app-text)",
          marginBottom: "4px",
        }}
      >
        Export
      </div>
      <div
        style={{
          fontSize: "0.8125rem",
          color: "var(--app-text-muted)",
          marginBottom: "16px",
        }}
      >
        Download your presentation
      </div>

      <button
        className="export-option"
        onClick={() => onExport("pptx")}
        disabled={!hasSlides || isExporting}
        style={{ opacity: !hasSlides || isExporting ? 0.5 : 1 }}
      >
        <div className="export-option-icon">
          <FileDown size={20} />
        </div>
        <div className="export-option-text">
          <h4>PowerPoint (.pptx)</h4>
          <p>Editable slides for Microsoft PowerPoint</p>
        </div>
      </button>

      <button
        className="export-option"
        onClick={() => onExport("pdf")}
        disabled={!hasSlides}
        style={{ opacity: !hasSlides ? 0.5 : 1 }}
      >
        <div className="export-option-icon">
          <FileText size={20} />
        </div>
        <div className="export-option-text">
          <h4>PDF</h4>
          <p>Print-ready document via browser</p>
        </div>
      </button>

      {isExporting && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--app-accent)",
            fontSize: "0.8125rem",
            marginTop: "8px",
          }}
        >
          <div className="spinner" />
          Building your file...
        </div>
      )}
    </div>
  );
}
