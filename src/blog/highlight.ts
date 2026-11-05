const KW: Record<string, string> = {
  solidity: "function external public private internal view pure payable returns return require if else for while mapping contract emit event struct memory storage calldata msg constant",
  noir: "fn let assert unconstrained pub mut struct use if else for in return global",
  sql: "insert into values on conflict do nothing create unique index where is null select from update delete set and or not",
};
const TY: Record<string, string> = { solidity: "uint uint256 bool address bytes32 string", noir: "Field u8 u32 u64 bool", sql: "" };

export type Token = { t: string; c: string };

/** Tiny tokenizer for the blog's code blocks (ported from the design). */
export function highlight(lines: string[], lang: string): Token[][] {
  const kw = new Set((KW[lang] || "").split(" "));
  const ty = new Set((TY[lang] || "").split(" ").filter(Boolean));
  const ci = lang === "sql";
  const re = /(\/\/.*$|--.*$)|("[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|(.)/g;
  return lines.map((line) => {
    const toks: Token[] = [];
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line))) {
      if (m[1]) toks.push({ t: m[1], c: "#9d97b8" });
      else if (m[2]) toks.push({ t: m[2], c: "#ffe680" });
      else if (m[3]) toks.push({ t: m[3], c: "#ffa77a" });
      else if (m[4]) {
        const w = m[4];
        const k = ci ? w.toLowerCase() : w;
        toks.push({ t: w, c: kw.has(k) ? "#c9b8ff" : ty.has(w) ? "#8fd0ff" : line.charAt(re.lastIndex) === "(" ? "#8fe3b4" : "#f3efff" });
      } else toks.push({ t: m[0], c: "#f3efff" });
    }
    return toks.length ? toks : [{ t: " ", c: "#f3efff" }];
  });
}
