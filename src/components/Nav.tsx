import { Link } from "react-router-dom";
import { site } from "../data/site";

export default function Nav() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 28px",
        borderBottom: "1px solid #2A2A2A",
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 12,
        letterSpacing: ".08em",
      }}
    >
      <Link to="/" style={{ fontWeight: 700 }}>
        ← {site.brand}
      </Link>
      <div style={{ display: "flex", gap: 28 }}>
        <Link to="/">[HOME]</Link>
        <Link to="/#work">[WORK]</Link>
        <Link to="/about">[ABOUT]</Link>
      </div>
    </nav>
  );
}
