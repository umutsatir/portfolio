import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type Simulation,
} from "d3-force";
import type { GraphNode, GraphLink } from "./types";

export function createSimulation(
  nodes: GraphNode[],
  links: GraphLink[],
  width: number,
  height: number
): Simulation<GraphNode, GraphLink> {
  const sim = forceSimulation<GraphNode, GraphLink>(nodes)
    .force(
      "link",
      forceLink<GraphNode, GraphLink>(links)
        .id((d) => d.id)
        .distance(120)
    )
    .force("charge", forceManyBody<GraphNode>().strength(-300))
    .force("center", forceCenter(width / 2, height / 2))
    .force("collide", forceCollide<GraphNode>().radius(40));

  return sim;
}

export function pinCenter(nodes: GraphNode[], width: number, height: number) {
  const center = nodes.find((n) => n.id === "umut");
  if (center) {
    center.fx = width / 2;
    center.fy = height / 2;
  }
}
