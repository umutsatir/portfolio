"use client";

import { useState } from "react";

interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
}

const events: TimelineEvent[] = [
  { date: "2022.10", title: "Started building dApps" },
  {
    date: "2024.01",
    title: "Full-stack developer @ ITU Blockchain",
    description: "Joined Istanbul Technical University Blockchain Society as a developer.",
  },
  {
    date: "2024.10",
    title: "ETHGlobal Istanbul · 1st place",
    description: "Won first place at ETHGlobal Istanbul.",
  },
  { date: "2025.01", title: "Concluded ITU Blockchain role" },
  {
    date: "2025.05",
    title: "ETHGlobal Prague · built Timeswap",
    description: "Built a time-token service exchange protocol at ETHGlobal Prague.",
  },
  {
    date: "2025.07",
    title: "Launched MiniCRM",
    description: "Shipped MiniCRM — a WhatsApp-native CRM for small businesses.",
  },
  {
    date: "2025.09",
    title: "Joined node101 as software engineer",
    description: "Started working on blockchain infrastructure at node101.",
  },
  {
    date: "2026.04",
    title: "ETHGlobal Cannes · built Roam-Swarm",
    description:
      "Built Roam-Swarm at ETHGlobal Cannes — an AI-powered urban discovery protocol.",
  },
  {
    date: "2027.Q1",
    title: "Expected BSc graduation · Gebze Technical University",
  },
  {
    date: "2027.Q4",
    title: "Targeting MSc intake · Italy",
    description:
      "Applying to PoliMi (top choice) and PoliTo for distributed systems MSc programs.",
  },
];

export default function Timeline() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{ backgroundColor: "var(--color-border)" }}
      />

      <div className="flex flex-col gap-6">
        {events.map((event) => (
          <div
            key={event.date}
            className="relative"
          >
            {/* Dot */}
            <div
              className="absolute -left-6 top-1 w-2 h-2 rounded-full border"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-text-faint)",
                transform: "translateX(-3px)",
              }}
            />

            <button
              onClick={() =>
                event.description
                  ? setExpanded(expanded === event.date ? null : event.date)
                  : undefined
              }
              className="text-left w-full"
              style={{ cursor: event.description ? "pointer" : "default" }}
            >
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  className="text-mono"
                  style={{ color: "var(--color-text-faint)" }}
                >
                  {event.date}
                </span>
                <span
                  className="text-small"
                  style={{ color: "var(--color-text)" }}
                >
                  {event.title}
                </span>
                {event.description && (
                  <span
                    className="text-mono text-[0.7rem]"
                    style={{ color: "var(--color-text-faint)" }}
                  >
                    {expanded === event.date ? "▲" : "▼"}
                  </span>
                )}
              </div>
            </button>

            {expanded === event.date && event.description && (
              <p
                className="text-small mt-2 pl-0"
                style={{
                  color: "var(--color-text-dim)",
                  maxWidth: "480px",
                }}
              >
                {event.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
