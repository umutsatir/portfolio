export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#0A0B0D",
          color: "#E8E8E6",
          fontFamily: "monospace",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <span style={{ color: "#4A4C52", fontSize: "0.8125rem" }}>404</span>
        <p style={{ color: "#8A8C92", fontSize: "0.875rem", margin: 0 }}>
          page not found
        </p>
        <a
          href="/en"
          style={{
            color: "#FB923C",
            fontSize: "0.8125rem",
            textDecoration: "none",
            fontFamily: "monospace",
          }}
        >
          ← home
        </a>
      </body>
    </html>
  );
}
