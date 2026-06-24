"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { nodes as fallbackNodes, links as fallbackLinks } from "./nodes";
import { createSimulation, pinCenter } from "./simulation";
import type { GraphNode, GraphLink } from "./types";

interface NodeGraphProps {
  nodes?: GraphNode[];
  links?: GraphLink[];
}

const WIDTH = 600;
const HEIGHT = 600;

const NODE_RADIUS: Record<string, number> = {
  center: 24,
  work: 18,
  project: 16,
  ecosystem: 14,
};

function getNodeId(n: string | GraphNode): string {
  return typeof n === "string" ? n : n.id;
}

export default function NodeGraph({ nodes, links }: NodeGraphProps = {}) {
  const initialNodes = nodes ?? fallbackNodes;
  const initialLinks = links ?? fallbackLinks;
  const router = useRouter();
  const locale = useLocale();
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodePositions, setNodePositions] = useState<GraphNode[]>([]);
  const [linkData, setLinkData] = useState<GraphLink[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const simRef = useRef<ReturnType<typeof createSimulation> | null>(null);
  const perturbTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const getConnectedNodeIds = useCallback(
    (nodeId: string): Set<string> => {
      const connected = new Set<string>([nodeId]);
      initialLinks.forEach((l) => {
        const src = getNodeId(l.source);
        const tgt = getNodeId(l.target);
        if (src === nodeId) connected.add(tgt);
        if (tgt === nodeId) connected.add(src);
      });
      return connected;
    },
    [initialLinks]
  );

  const getConnectedLinkIds = useCallback(
    (nodeId: string): Set<string> => {
      const connected = new Set<string>();
      initialLinks.forEach((l, i) => {
        const src = getNodeId(l.source);
        const tgt = getNodeId(l.target);
        if (src === nodeId || tgt === nodeId) {
          connected.add(`${i}`);
        }
      });
      return connected;
    },
    [initialLinks]
  );

  useEffect(() => {
    const nodesCopy: GraphNode[] = initialNodes.map((n) => ({ ...n }));
    const linksCopy: GraphLink[] = initialLinks.map((l) => ({ ...l }));

    // Seed non-center nodes evenly around the center so the settled layout is
    // symmetric and stays centered (avoids one-sided clustering / empty gaps).
    const outer = nodesCopy.filter((n) => n.id !== "umut");
    outer.forEach((n, i) => {
      const angle = (i / outer.length) * Math.PI * 2;
      n.x = WIDTH / 2 + Math.cos(angle) * 160;
      n.y = HEIGHT / 2 + Math.sin(angle) * 160;
    });

    pinCenter(nodesCopy, WIDTH, HEIGHT);

    const sim = createSimulation(nodesCopy, linksCopy, WIDTH, HEIGHT);
    simRef.current = sim;

    if (prefersReducedMotion || isMobile) {
      // Run the simulation to equilibrium so nodes settle without overlap,
      // then render the static result (no animation loop).
      sim.tick(300);
      pinCenter(nodesCopy, WIDTH, HEIGHT);
      setNodePositions([...nodesCopy]);
      setLinkData(sim.force<any>("link")?.links() ?? linksCopy);
      sim.stop();
      return;
    }

    const tick = () => {
      pinCenter(nodesCopy, WIDTH, HEIGHT);
      sim.tick();
      setNodePositions([...nodesCopy]);
      setLinkData(sim.force<any>("link")?.links() ?? linksCopy);

      if (sim.alpha() > 0.001) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    sim.stop();
    rafRef.current = requestAnimationFrame(tick);

    // Gentle perturbation every 3s
    const perturb = () => {
      const nonCenter = nodesCopy.filter((n) => n.id !== "umut");
      const target = nonCenter[Math.floor(Math.random() * nonCenter.length)];
      if (target) {
        target.vx = (Math.random() - 0.5) * 2;
        target.vy = (Math.random() - 0.5) * 2;
        sim.alpha(0.1).restart();
        rafRef.current = requestAnimationFrame(tick);
      }
      perturbTimerRef.current = setTimeout(perturb, 3000);
    };
    perturbTimerRef.current = setTimeout(perturb, 4000);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (perturbTimerRef.current) clearTimeout(perturbTimerRef.current);
      sim.stop();
    };
  }, [prefersReducedMotion, isMobile, initialNodes, initialLinks]);

  const handleNodeClick = (node: GraphNode) => {
    if (!node.href) return;
    if (node.external) {
      window.open(node.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/${locale}${node.href}`);
    }
  };

  const activeNode = hoveredNode ?? focusedNode;
  const connectedNodes = activeNode ? getConnectedNodeIds(activeNode) : null;
  const connectedLinks = activeNode ? getConnectedLinkIds(activeNode) : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-full"
      role="img"
      aria-label="Interactive node graph showing Umut's projects and ecosystem connections"
    >
      {/* Links */}
      <g>
        {linkData.map((link, i) => {
          const src = link.source as GraphNode;
          const tgt = link.target as GraphNode;
          if (
            typeof src !== "object" ||
            typeof tgt !== "object" ||
            !src.x ||
            !tgt.x
          )
            return null;

          const isHighlighted = connectedLinks?.has(`${i}`);
          const isDimmed = connectedLinks && !isHighlighted;

          return (
            <line
              key={i}
              x1={src.x}
              y1={src.y}
              x2={tgt.x}
              y2={tgt.y}
              stroke={
                isHighlighted
                  ? "var(--color-accent-2)"
                  : "var(--color-border)"
              }
              strokeOpacity={isHighlighted ? 0.6 : isDimmed ? 0.2 : 0.8}
              strokeWidth={isHighlighted ? 1.5 : 1}
              style={{ transition: "stroke 150ms, stroke-opacity 150ms" }}
            />
          );
        })}
      </g>

      {/* Nodes */}
      <g>
        {nodePositions.map((node, tabIdx) => {
          const r = NODE_RADIUS[node.kind] ?? 14;
          const isHovered = activeNode === node.id;
          const isConnected = connectedNodes?.has(node.id);
          const isDimmed = connectedNodes && !isConnected && !isHovered;
          const showLabel =
            node.kind === "center" || isHovered || isConnected;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x ?? WIDTH / 2}, ${node.y ?? HEIGHT / 2})`}
              style={{
                cursor: node.href ? "pointer" : "default",
                transition: "opacity 150ms",
                opacity: isDimmed ? 0.25 : 1,
              }}
              tabIndex={node.href ? tabIdx + 1 : -1}
              role={node.href ? "button" : undefined}
              aria-label={node.href ? `Navigate to ${node.label}` : node.label}
              onMouseEnter={() => !isMobile && setHoveredNode(node.id)}
              onMouseLeave={() => !isMobile && setHoveredNode(null)}
              onFocus={() => setFocusedNode(node.id)}
              onBlur={() => setFocusedNode(null)}
              onClick={() => handleNodeClick(node)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNodeClick(node);
                }
              }}
            >
              {/* Node circle */}
              {node.kind === "center" ? (
                <circle
                  r={isHovered ? r * 1.25 : r}
                  fill="var(--color-accent)"
                  style={{ transition: "r 150ms cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
              ) : node.kind === "work" ? (
                <circle
                  r={isHovered ? r * 1.25 : r}
                  fill="var(--color-bg-elevated)"
                  stroke="var(--color-accent-2)"
                  strokeWidth={2}
                  style={{ transition: "r 150ms cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
              ) : node.kind === "project" ? (
                <circle
                  r={isHovered ? r * 1.25 : r}
                  fill="var(--color-bg-elevated)"
                  stroke="var(--color-text-dim)"
                  strokeWidth={1}
                  style={{ transition: "r 150ms cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
              ) : (
                <circle
                  r={isHovered ? r * 1.25 : r}
                  fill="transparent"
                  stroke="var(--color-text-faint)"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  style={{ transition: "r 150ms cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
              )}

              {/* Label */}
              {showLabel && (
                <text
                  y={r + 14}
                  textAnchor="middle"
                  fill={
                    node.kind === "center"
                      ? "var(--color-bg)"
                      : "var(--color-text-dim)"
                  }
                  fontSize={11}
                  fontFamily="var(--font-mono)"
                  style={{
                    userSelect: "none",
                    pointerEvents: "none",
                    transition: "opacity 150ms",
                  }}
                >
                  {node.kind === "center" ? null : node.label}
                </text>
              )}

              {/* Center label inside circle */}
              {node.kind === "center" && (
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--color-bg)"
                  fontSize={11}
                  fontFamily="var(--font-mono)"
                  fontWeight={500}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
