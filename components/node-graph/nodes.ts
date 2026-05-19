import type { GraphNode, GraphLink } from "./types";

export const nodes: GraphNode[] = [
  { id: "umut", label: "umut", kind: "center" },

  { id: "node101", label: "node101", kind: "work", href: "https://node101.io", external: true },
  { id: "gtu-blockchain", label: "gtu-blockchain", kind: "work", href: "https://github.com/GTUBlockchain", external: true },

  { id: "roam-swarm", label: "roam-swarm", kind: "project", href: "/projects/roam-swarm" },
  { id: "timeswap", label: "timeswap", kind: "project", href: "/projects/timeswap" },
  { id: "minicrm", label: "minicrm", kind: "project", href: "/projects/minicrm" },
  { id: "gossip-net", label: "gossip-net", kind: "project", href: "/projects/gossip-network" },
  { id: "healthnode", label: "healthnode", kind: "project", href: "/projects/healthnode" },

  { id: "ethereum", label: "ethereum", kind: "ecosystem" },
  { id: "world-id", label: "world-id", kind: "ecosystem" },
  { id: "ens", label: "ens", kind: "ecosystem" },
  { id: "sui", label: "sui", kind: "ecosystem" },
];

export const links: GraphLink[] = [
  { source: "umut", target: "node101" },
  { source: "umut", target: "gtu-blockchain" },
  { source: "umut", target: "roam-swarm" },
  { source: "umut", target: "timeswap" },
  { source: "umut", target: "minicrm" },
  { source: "umut", target: "gossip-net" },
  { source: "umut", target: "healthnode" },
  { source: "roam-swarm", target: "world-id" },
  { source: "roam-swarm", target: "ens" },
  { source: "roam-swarm", target: "ethereum" },
  { source: "timeswap", target: "ethereum" },
  { source: "gossip-net", target: "sui" },
  { source: "gtu-blockchain", target: "ethereum" },
];
