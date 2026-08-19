import Nav from "../components/Nav";
import Footer from "../components/Footer";

// TODO: port about.dc.html from the Claude Design project verbatim,
// same rules as Contact.tsx (inline styles, style-hover -> global.css classes).
export default function About() {
  return (
    <div style={{ minHeight: "100vh", background: "#0C0C0C", display: "flex", flexDirection: "column" }}>
      <Nav />
      <main style={{ flex: 1, padding: "70px 28px", fontFamily: "'JetBrains Mono',monospace", color: "#EDEDE6" }}>
        about — coming next
      </main>
      <Footer />
    </div>
  );
}
