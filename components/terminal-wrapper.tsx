"use client";

import dynamic from "next/dynamic";

const Terminal = dynamic(() => import("./terminal"), { ssr: false });

export default function TerminalWrapper() {
  return (
    <>
      <div className="hidden md:block">
        <Terminal />
      </div>
      <div
        className="md:hidden border rounded-md p-4 text-mono text-center"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text-faint)",
          backgroundColor: "var(--color-bg-elevated)",
          fontSize: "13px",
        }}
      >
        terminal available on desktop
      </div>
    </>
  );
}
