import type { CSSProperties } from "react";

/**
 * The design ships its styles as inline CSS strings plus `style-hover` /
 * `style-active` pseudo-state strings. These helpers reproduce that behaviour
 * exactly (including the !important on pseudo rules) so the port stays 1:1.
 */

const styleCache = new Map<string, CSSProperties>();

function splitDecls(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === ";" && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((d) => d.trim()).filter(Boolean);
}

function camel(prop: string): string {
  if (prop.startsWith("--")) return prop;
  const p = prop.startsWith("-webkit-") ? "webkit-" + prop.slice(8) : prop;
  return p.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()).replace(/^webkit/, "Webkit");
}

/** Parse a CSS declaration string into a React style object (memoised). */
export function css(s: string): CSSProperties {
  const hit = styleCache.get(s);
  if (hit) return hit;
  const obj: Record<string, string> = {};
  for (const d of splitDecls(s)) {
    const i = d.indexOf(":");
    if (i < 0) continue;
    obj[camel(d.slice(0, i).trim())] = d.slice(i + 1).trim();
  }
  styleCache.set(s, obj as CSSProperties);
  return obj as CSSProperties;
}

let sheet: CSSStyleSheet | null = null;
const pseudoCache = new Map<string, string>();
let counter = 0;

function important(s: string): string {
  return splitDecls(s)
    .map((d) => d + " !important")
    .join(";");
}

function pseudoClass(pseudo: string, text: string): string {
  const key = pseudo + "|" + text;
  const hit = pseudoCache.get(key);
  if (hit) return hit;
  if (!sheet) {
    const el = document.createElement("style");
    el.setAttribute("data-pseudo", "");
    document.head.appendChild(el);
    sheet = el.sheet as CSSStyleSheet;
  }
  const cls = "scp" + (counter++).toString(36);
  sheet.insertRule(`.${cls}:${pseudo}{${important(text)}}`, sheet.cssRules.length);
  pseudoCache.set(key, cls);
  return cls;
}

export type Pseudo = { h?: string; a?: string };

/** `style` + optional hover/active strings -> props for an element. */
export function P(base: string, pseudo: Pseudo = {}): { style: CSSProperties; className?: string } {
  const cls = [pseudo.h && pseudoClass("hover", pseudo.h), pseudo.a && pseudoClass("active", pseudo.a)]
    .filter(Boolean)
    .join(" ");
  return cls ? { style: css(base), className: cls } : { style: css(base) };
}
