import type { GraphNode, GraphLink } from "./types";
import type { ProjectMeta } from "@/lib/projects";

const centerNode: GraphNode = { id: "umut", label: "umut", kind: "center" };

const workNodes: GraphNode[] = [
  { id: "node101", label: "node101", kind: "work", href: "https://node101.io", external: true },
  { id: "gtu-blockchain", label: "gtu-blockchain", kind: "work", href: "https://github.com/GTUBlockchain", external: true },
];

const ecosystemNodes: GraphNode[] = [
  { id: "ethereum", label: "ethereum", kind: "ecosystem" },
  { id: "world-id", label: "world-id", kind: "ecosystem" },
  { id: "ens", label: "ens", kind: "ecosystem" },
  { id: "sui", label: "sui", kind: "ecosystem" },
  { id: "typescript", label: "typescript", kind: "ecosystem" },
  { id: "react", label: "react", kind: "ecosystem" },
  { id: "rust", label: "rust", kind: "ecosystem" },
  { id: "python", label: "python", kind: "ecosystem" },
];

// Stack/tech keywords that map a project onto an ecosystem (tag) node.
const ecosystemMatchers: { id: string; keywords: string[] }[] = [
  { id: "ethereum", keywords: ["ethereum", "solidity", "evm", "foundry", "hardhat"] },
  { id: "world-id", keywords: ["world id", "worldid", "world-id"] },
  { id: "ens", keywords: ["ens"] },
  { id: "sui", keywords: ["sui", "move"] },
  { id: "typescript", keywords: ["typescript"] },
  { id: "react", keywords: ["react", "next.js", "next "] },
  { id: "rust", keywords: ["rust", "tauri"] },
  { id: "python", keywords: ["python", "fastapi"] },
];

// Static links that don't depend on the project list.
const workLinks: GraphLink[] = [
  { source: "umut", target: "node101" },
  { source: "umut", target: "gtu-blockchain" },
  { source: "gtu-blockchain", target: "ethereum" },
];

export function buildGraph(projects: ProjectMeta[]): {
  nodes: GraphNode[];
  links: GraphLink[];
} {
  const projectNodes: GraphNode[] = projects.map((p) => ({
    id: p.slug,
    label: p.slug,
    kind: "project",
    href: `/projects/${p.slug}`,
  }));

  // Projects tagged with an org hang under that org node; otherwise under umut.
  const workIds = new Set(workNodes.map((w) => w.id));
  const projectLinks: GraphLink[] = projects.map((p) => ({
    source: p.org && workIds.has(p.org) ? p.org : "umut",
    target: p.slug,
  }));

  const usedEcosystem = new Set<string>();
  const ecosystemLinks: GraphLink[] = [];

  for (const p of projects) {
    const stack = (p.stack ?? []).map((s) => s.toLowerCase());
    for (const matcher of ecosystemMatchers) {
      const hit = stack.some((s) =>
        matcher.keywords.some((k) => s.includes(k))
      );
      if (hit) {
        usedEcosystem.add(matcher.id);
        ecosystemLinks.push({ source: p.slug, target: matcher.id });
      }
    }
  }

  // gtu-blockchain links to ethereum via workLinks, so keep it visible.
  usedEcosystem.add("ethereum");

  const nodes: GraphNode[] = [
    centerNode,
    ...workNodes,
    ...projectNodes,
    ...ecosystemNodes.filter((e) => usedEcosystem.has(e.id)),
  ];

  const links: GraphLink[] = [...workLinks, ...projectLinks, ...ecosystemLinks];

  return { nodes, links };
}

// Static fallback (no project data) so the client can render before/without props.
export const { nodes, links } = buildGraph([]);
