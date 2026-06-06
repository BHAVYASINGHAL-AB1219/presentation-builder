"use client";

import { History, Clock, RotateCcw } from "lucide-react";

/**
 * VersionHistoryPanel — Displays a timeline of presentation versions and allows restoring them.
 */
export default function VersionHistoryPanel({
  history,
  activeVersionId,
  onRestore,
}) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="panel-header">
        <History size={16} />
        Version History
      </div>
      
      <div className="panel-content" style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {history.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--app-text-muted)", marginTop: "24px", fontSize: "0.875rem" }}>
            No history yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {history.map((version, index) => {
              const isActive = version.id === activeVersionId;
              const date = new Date(version.timestamp);
              const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div
                  key={version.id}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: `1px solid ${isActive ? "var(--app-accent)" : "var(--app-border)"}`,
                    background: isActive ? "rgba(59, 130, 246, 0.05)" : "var(--app-bg)",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--app-text-muted)", fontSize: "0.75rem" }}>
                    <Clock size={12} />
                    {timeString}
                  </div>
                  
                  <div style={{ fontSize: "0.875rem", fontWeight: isActive ? 600 : 500, color: "var(--app-text)", marginBottom: "12px", lineHeight: 1.4 }}>
                    {version.description}
                  </div>
                  
                  {!isActive && (
                    <button
                      onClick={() => onRestore(version)}
                      className="btn btn-secondary btn-sm"
                      style={{ width: "100%", justifyContent: "center", gap: "6px" }}
                    >
                      <RotateCcw size={14} />
                      Restore
                    </button>
                  )}
                  {isActive && (
                    <div style={{ fontSize: "0.75rem", color: "var(--app-accent)", fontWeight: 600 }}>
                      Current Version
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
