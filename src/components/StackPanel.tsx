type Props = {
  letter: string;
  tier: string;
  items: string[];
  note: string;
  dashed: boolean;
  borderRight: boolean;
  hot: boolean;
};

export default function StackPanel({ letter, tier, items, note, dashed, borderRight, hot }: Props) {
  return (
    <div
      data-reveal
      className={`dc-stack-panel${hot ? " dc-stack-panel-hot" : ""}`}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "32px 28px 40px",
        borderRight: borderRight ? "1px solid #2A2A2A" : undefined,
      }}
    >
      <span
        className="wm"
        style={{
          position: "absolute",
          top: -30,
          right: -10,
          fontWeight: 800,
          fontSize: 170,
          lineHeight: 1,
          letterSpacing: "-.05em",
          color: "rgba(237,237,230,.06)",
          pointerEvents: "none",
        }}
      >
        {letter}
      </span>
      <p style={{ margin: "0 0 6px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: ".12em", color: "rgba(237,237,230,.45)" }}>
        $ stack --tier
      </p>
      <p style={{ margin: "0 0 24px", fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, letterSpacing: ".1em", color: "#D8FF3E" }}>
        {tier}
        {dashed && <span className="dc-blink">_</span>}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, position: "relative" }}>
        {items.map((item) => (
          <span
            key={item}
            className="dc-tag"
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12.5,
              padding: "8px 14px",
              border: dashed ? "1px dashed #3A3A3A" : "1px solid #3A3A3A",
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <p style={{ margin: "26px 0 0", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: ".06em", color: "rgba(237,237,230,.4)" }}>
        {note}
      </p>
    </div>
  );
}
