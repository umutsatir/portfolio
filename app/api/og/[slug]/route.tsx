import { ImageResponse } from "next/og";
import { getProjectMeta } from "@/lib/projects";

// Node.js runtime needed for fs/path in getProjectMeta

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const meta = getProjectMeta(slug, "en");

  const title = meta?.title ?? slug;
  const oneLiner = meta?.oneLiner ?? "";
  const stack = meta?.stack?.slice(0, 5).join(" · ") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#0A0B0D",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Top */}
        <div style={{ display: "flex" }}>
          <span
            style={{
              color: "#4A4C52",
              fontSize: "14px",
              letterSpacing: "0.05em",
            }}
          >
            umutsatir.dev
          </span>
        </div>

        {/* Center */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              color: "#E8E8E6",
              fontSize: "56px",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              maxWidth: "800px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#8A8C92",
              fontSize: "22px",
              maxWidth: "700px",
              lineHeight: 1.4,
            }}
          >
            {oneLiner}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <span style={{ color: "#4A4C52", fontSize: "14px" }}>{stack}</span>

          {/* Node graph silhouette */}
          <svg
            width="120"
            height="80"
            viewBox="0 0 120 80"
            style={{ opacity: 0.4 }}
          >
            <line x1="60" y1="40" x2="20" y2="20" stroke="#4ADE80" strokeWidth="1" />
            <line x1="60" y1="40" x2="100" y2="15" stroke="#4ADE80" strokeWidth="1" />
            <line x1="60" y1="40" x2="95" y2="65" stroke="#4ADE80" strokeWidth="1" />
            <line x1="60" y1="40" x2="25" y2="65" stroke="#4ADE80" strokeWidth="1" />
            <line x1="60" y1="40" x2="10" y2="50" stroke="#4ADE80" strokeWidth="1" />
            <circle cx="60" cy="40" r="8" fill="#4ADE80" />
            <circle cx="20" cy="20" r="4" fill="none" stroke="#4ADE80" strokeWidth="1" />
            <circle cx="100" cy="15" r="4" fill="none" stroke="#4ADE80" strokeWidth="1" />
            <circle cx="95" cy="65" r="4" fill="none" stroke="#4ADE80" strokeWidth="1" />
            <circle cx="25" cy="65" r="4" fill="none" stroke="#4ADE80" strokeWidth="1" />
            <circle cx="10" cy="50" r="3" fill="none" stroke="#4ADE80" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
