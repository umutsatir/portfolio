"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { ProjectMeta } from "@/lib/projects";

const STATUS_LABELS: Record<string, string> = {
  shipped: "shipped",
  prototype: "prototype",
  archived: "archived",
  wip: "wip",
};

const STATUS_COLORS: Record<string, string> = {
  shipped: "#4ADE80",
  prototype: "var(--color-accent-2)",
  archived: "var(--color-text-faint)",
  wip: "var(--color-warn)",
};

interface ProjectCardProps {
  project: ProjectMeta;
  compact?: boolean;
}

export default function ProjectCard({ project, compact = false }: ProjectCardProps) {
  const locale = useLocale();
  const t = useTranslations("projects");

  const href = `/${locale}/projects/${project.slug}`;

  return (
    <Link
      href={href}
      className="group block border rounded-sm transition-colors duration-150"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
      }}
    >
      <div className={`flex gap-0 ${compact ? "p-5" : "p-6 md:p-8"}`}>
        {/* Metadata column */}
        <div
          className={`shrink-0 flex flex-col gap-1 ${compact ? "w-28 mr-5" : "w-36 mr-8"}`}
          style={{ color: "var(--color-text-dim)" }}
        >
          <span className="text-mono">
            {new Date(project.date).toISOString().slice(0, 7).replace("-", ".")}
          </span>
          {project.event && (
            <span className="text-mono" style={{ color: "var(--color-text-faint)", fontSize: "0.75rem" }}>
              {project.event}
            </span>
          )}
          {project.stack && project.stack.length > 0 && (
            <span className="text-mono mt-1" style={{ color: "var(--color-text-faint)", fontSize: "0.75rem" }}>
              {project.stack.slice(0, 3).join(" · ")}
            </span>
          )}
          {project.team && (
            <span className="text-mono" style={{ color: "var(--color-text-faint)", fontSize: "0.75rem" }}>
              Team of {project.team}
            </span>
          )}
          {project.prize && (
            <span className="text-mono mt-1" style={{ color: "var(--color-warn)", fontSize: "0.75rem" }}>
              {project.prize}
            </span>
          )}
        </div>

        {/* Content column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3
              className={compact ? "text-h3" : "text-h3"}
              style={{ color: "var(--color-text)" }}
            >
              {project.title}
            </h3>
            <span
              className="text-mono shrink-0 text-[0.7rem] px-1.5 py-0.5 rounded border"
              style={{
                color: STATUS_COLORS[project.status] ?? "var(--color-text-faint)",
                borderColor: STATUS_COLORS[project.status] ?? "var(--color-border)",
                opacity: 0.8,
              }}
            >
              {STATUS_LABELS[project.status]}
            </span>
          </div>

          <p
            className="text-small"
            style={{ color: "var(--color-text-dim)", maxWidth: "480px" }}
          >
            {project.oneLiner}
          </p>

          <div className="mt-4 flex items-center gap-1">
            <span
              className="text-small transition-transform duration-150 group-hover:translate-x-1"
              style={{ color: "var(--color-text-dim)", display: "inline-block" }}
            >
              {t("viewProject")} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
