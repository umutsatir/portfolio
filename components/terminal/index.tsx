"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { commands } from "./commands";
import type { HistoryEntry } from "./history";

let entryId = 0;

export default function Terminal() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("terminal");

  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: entryId++,
      input: "whoami",
      output: ["Umut Satır — Software Engineer @ node101"],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const editableRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Keep contentEditable in sync when inputValue changes programmatically (history nav, tab)
  useEffect(() => {
    const el = editableRef.current;
    if (!el) return;
    if (el.textContent !== inputValue) {
      el.textContent = inputValue;
      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [inputValue]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router]
  );

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      setCmdHistory((prev) => [trimmed, ...prev]);
      setHistoryIndex(-1);

      const [cmd, ...args] = trimmed.split(/\s+/);
      const handler = commands[cmd];

      let outputLines: string[];

      if (handler) {
        const result = handler(args, { locale, clearHistory, navigate });

        if (result.type === "clear") {
          return;
        }
        if (result.type === "navigate") {
          navigate(result.href);
          outputLines = [`navigating to ${result.href}...`];
        } else if (result.type === "link") {
          window.open(result.url, "_blank", "noopener,noreferrer");
          outputLines = result.lines;
        } else {
          outputLines = result.lines;
        }
      } else {
        outputLines = [
          `command not found: ${cmd}. type 'help' for commands.`,
        ];
      }

      setHistory((prev) => [
        ...prev,
        { id: entryId++, input: trimmed, output: outputLines },
      ]);
    },
    [locale, clearHistory, navigate]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const current = editableRef.current?.textContent ?? "";
      runCommand(current);
      setInputValue("");
      if (editableRef.current) editableRef.current.textContent = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIndex((prev) => {
        const next = Math.min(prev + 1, cmdHistory.length - 1);
        if (cmdHistory[next] !== undefined) setInputValue(cmdHistory[next]);
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIndex((prev) => {
        const next = Math.max(prev - 1, -1);
        setInputValue(next === -1 ? "" : cmdHistory[next] ?? "");
        return next;
      });
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = editableRef.current?.textContent ?? "";
      const match = Object.keys(commands).find((k) => k.startsWith(current));
      if (match) setInputValue(match);
    }
  };

  const handleInput = () => {
    // Keep state in sync for tab-complete prefix matching
    setInputValue(editableRef.current?.textContent ?? "");
  };

  const focusInput = () => editableRef.current?.focus();

  return (
    <div
      className="rounded-md border cursor-text"
      style={{
        backgroundColor: "var(--color-bg-elevated)",
        borderColor: "var(--color-border)",
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
      }}
      onClick={focusInput}
    >
      {/* Terminal header */}
      <div
        className="flex items-center gap-1.5 px-4 py-3 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-border)" }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-border)" }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-border)" }} />
        <span className="ml-2 text-[11px]" style={{ color: "var(--color-text-faint)" }}>
          umut@portfolio:~
        </span>
      </div>

      {/* Output area */}
      <div
        ref={outputRef}
        className="px-4 py-3 max-h-96 overflow-y-auto"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {/* Welcome message */}
        <div className="mb-3" style={{ color: "var(--color-text-faint)" }}>
          {t("welcome")}
        </div>

        {history.map((entry) => (
          <div key={entry.id} className="mb-2">
            <div className="flex items-center gap-2">
              <span style={{ color: "var(--color-accent)" }}>$</span>
              <span style={{ color: "var(--color-text)" }}>{entry.input}</span>
            </div>
            {entry.output.map((line, i) => (
              <div
                key={i}
                className="pl-4"
                style={{
                  color: line.startsWith("command not found")
                    ? "var(--color-warn)"
                    : "var(--color-text-dim)",
                  whiteSpace: "pre",
                }}
              >
                {line}
              </div>
            ))}
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--color-accent)" }}>$</span>
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            className="flex-1 outline-none min-w-0"
            style={{
              color: "var(--color-text)",
              caretColor: "var(--color-accent)",
              fontFamily: "inherit",
              fontSize: "inherit",
              whiteSpace: "pre",
            }}
            role="textbox"
            aria-label="Terminal input"
            aria-multiline="false"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
