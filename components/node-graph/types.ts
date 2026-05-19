import type { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";

export type NodeKind = "center" | "work" | "project" | "ecosystem";

export interface GraphNode extends SimulationNodeDatum {
  id: string;
  label: string;
  kind: NodeKind;
  href?: string;
  external?: boolean;
}

export interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}
