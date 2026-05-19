"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ProjectCard from "@/components/project-card";
import type { ProjectMeta } from "@/lib/projects";

type Filter = "all" | "hackathon" | "saas" | "research" | "oss";

interface ProjectsClientProps {
  projects: ProjectMeta[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const t = useTranslations("projects");
  const [filter, setFilter] = useState<Filter>("all");

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "hackathon", label: t("filterHackathon") },
    { key: "saas", label: t("filterSaas") },
    { key: "research", label: t("filterResearch") },
    { key: "oss", label: t("filterOss") },
  ];

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <h1 className="text-h2 mb-10" style={{ color: "var(--color-text)" }}>
        {t("title")}
      </h1>

      {/* Filter bar */}
      <div className="flex gap-4 mb-10 flex-wrap">
        {filters.map((f, i) => (
          <span key={f.key} className="flex items-center gap-4">
            {i > 0 && (
              <span style={{ color: "var(--color-text-faint)" }} className="text-mono">
                ·
              </span>
            )}
            <button
              onClick={() => setFilter(f.key)}
              className="text-small transition-colors"
              style={{
                color:
                  filter === f.key
                    ? "var(--color-text)"
                    : "var(--color-text-dim)",
                fontFamily: "var(--font-mono)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {f.label}
            </button>
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} compact />
        ))}
        {filtered.length === 0 && (
          <p className="text-small" style={{ color: "var(--color-text-faint)" }}>
            no projects in this category yet.
          </p>
        )}
      </div>
    </>
  );
}
