import React from "react";

/**
 * MfeFallback
 * Inline-styled loading spinner used as the fallback for every
 * React.Suspense boundary that wraps a module-federated remote component.
 * Uses only inline styles so it works without Tailwind or any CSS framework.
 */
export default function MfeFallback() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "4px solid #e5e7eb",
          borderTopColor: "#2563eb",
          animation: "mfe-spin 0.8s linear infinite",
        }}
      />
      <span style={{ marginLeft: 12, color: "#4b5563", fontSize: 16 }}>
        Loading…
      </span>
      <style>{`@keyframes mfe-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
