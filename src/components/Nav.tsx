import { Link } from "react-router-dom";
import { site } from "../data/site";

type Props = { current: "home" | "about" | "contact" };

export default function Nav({ current }: Props) {
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
      {current === "home" ? (
        <span style={{ fontWeight: 700 }}>{site.brand}</span>
      ) : (
        <Link to="/" style={{ fontWeight: 700 }}>
          ← {site.brand}
        </Link>
      )}
      <div style={{ display: "flex", gap: 28 }}>
        {current !== "home" && <Link to="/">[HOME]</Link>}
        {current !== "home" ? <Link to="/#work">[WORK]</Link> : <a href="#work">[WORK]</a>}
        {current !== "about" && <Link to="/about">[ABOUT]</Link>}
        {current !== "contact" && <Link to="/contact">[CONTACT]</Link>}
      </div>
    </nav>
  );
}
