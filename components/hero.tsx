"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { GraphNode, GraphLink } from "./node-graph/types";

// Alt version (more confident):
// title: "I build infrastructure for decentralized networks."
// subtitle: "Three years shipping production dApps. ETHGlobal finalist. Currently at node101."

const NodeGraph = dynamic(() => import("./node-graph"), { ssr: false });

interface HeroProps {
  lastCommit: { when: string; sha: string } | null;
  relativeTime: string | null;
  graphNodes: GraphNode[];
  graphLinks: GraphLink[];
}

export default function Hero({
  lastCommit,
  relativeTime,
  graphNodes,
  graphLinks,
}: HeroProps) {
  const t = useTranslations("hero");

  return (
    <section className="max-w-[1280px] mx-auto px-8 md:px-16 pt-28 md:pt-32 pb-0">
      <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
        {/* Left: text 55% */}
        <div className="flex-1 md:max-w-[55%]">
          <h1 className="text-display" style={{ color: "var(--color-text)" }}>
            {t("title")}
          </h1>

          <p
            className="text-body mt-6"
            style={{ color: "var(--color-text-dim)", maxWidth: "520px" }}
          >
            {t("subtitle")}
          </p>

          <div className="mt-6 flex flex-col gap-1">
            <span className="text-mono" style={{ color: "#4ADE80" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#4ADE80",
                  marginRight: "6px",
                  animation: "status-pulse 2s ease-in-out infinite",
                }}
              />
              {t("status").replace("● ", "")}
            </span>

            {lastCommit && relativeTime && (
              <span className="text-mono" style={{ color: "var(--color-text-faint)" }}>
                {t("lastCommit")} {relativeTime} ·{" "}
                <span style={{ color: "var(--color-text-dim)" }}>{lastCommit.sha}</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: node graph 45% */}
        <div className="w-full md:w-[45%] md:max-w-[480px] aspect-square">
          <NodeGraph nodes={graphNodes} links={graphLinks} />
        </div>
      </div>
    </section>
  );
}
