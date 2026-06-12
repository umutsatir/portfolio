"use client";

import { useState } from "react";

export interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="relative pl-6">
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{ backgroundColor: "var(--color-border)" }}
      />

      <div className="flex flex-col gap-6">
        {events.map((event) => (
          <div key={event.date} className="relative">
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
