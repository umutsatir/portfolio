export interface TerminalContext {
  locale: string;
  clearHistory: () => void;
  navigate: (href: string) => void;
}

export type CommandOutput =
  | { type: "text"; lines: string[] }
  | { type: "list"; lines: string[] }
  | { type: "navigate"; href: string }
  | { type: "link"; url: string; lines: string[] }
  | { type: "clear" };

export type CommandHandler = (
  args: string[],
  ctx: TerminalContext
) => CommandOutput;

const buildDate = new Date("2022-10-15");
function daysOnline(): number {
  return Math.floor((Date.now() - buildDate.getTime()) / (1000 * 60 * 60 * 24));
}

export const commands: Record<string, CommandHandler> = {
  help: () => ({
    type: "list",
    lines: [
      "available commands:",
      "  whoami    — who am I",
      "  ls        — list projects (try: ls projects/)",
      "  cat       — read a file (about.md, now.md, contact.md)",
      "  gh        — open github profile",
      "  tg        — open telegram",
      "  email     — open email client",
      "  date      — current date",
      "  uptime    — time since first commit",
      "  echo      — echo arguments",
      "  clear     — clear terminal",
      "  sudo hire me — ;)",
    ],
  }),

  whoami: () => ({
    type: "text",
    lines: ["Umut Satır — Software Engineer @ node101"],
  }),

  ls: (args) => {
    if (args[0] === "projects/") {
      return {
        type: "list",
        lines: [
          "projects/",
          "  roam-swarm     hackathon · ETHGlobal Cannes 2026",
          "  timeswap       hackathon · ETHGlobal Prague 2025",
          "  minicrm        saas · shipped 2025.07",
          "  gossip-network research · 2024",
          "  pos-comparison research · 2024",
          "  healthnode     oss · 2023",
          "  gtu-portfolio  oss · 2023",
        ],
      };
    }
    return {
      type: "list",
      lines: ["about.md  now.md  contact.md  projects/"],
    };
  },

  cat: (args, ctx) => {
    const file = args[0];
    if (file === "about.md") {
      return { type: "navigate", href: `/${ctx.locale}/about` };
    }
    if (file === "contact.md") {
      return { type: "navigate", href: `/${ctx.locale}/contact` };
    }
    if (file === "now.md") {
      return {
        type: "list",
        lines: [
          "# now.md",
          "",
          "> building     blockchain infrastructure at node101",
          "> learning     distributed consensus, Rust",
          "> reading      Designing Data-Intensive Applications",
          "",
          "updated 2026-05-19",
        ],
      };
    }
    return {
      type: "text",
      lines: [`cat: ${file}: no such file`],
    };
  },

  gh: () => ({
    type: "link",
    url: "https://github.com/umutsatir",
    lines: ["opening github.com/umutsatir..."],
  }),

  tg: () => ({
    type: "link",
    url: "https://t.me/TODO",
    lines: ["opening telegram..."],
  }),

  email: () => ({
    type: "link",
    url: "mailto:TODO@TODO.com",
    lines: ["opening email client..."],
  }),

  date: () => ({
    type: "text",
    lines: [new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC"],
  }),

  uptime: () => ({
    type: "text",
    lines: [
      `building since 2022-10-15 (${daysOnline()} days online)`,
    ],
  }),

  echo: (args) => ({
    type: "text",
    lines: [args.join(" ")],
  }),

  clear: (_args, ctx) => {
    ctx.clearHistory();
    return { type: "clear" };
  },

  sudo: (args) => {
    if (args[0] === "hire" && args[1] === "me") {
      return {
        type: "list",
        lines: [
          "permission granted.",
          "email: TODO@TODO.com",
          "response time: < 24h",
        ],
      };
    }
    return {
      type: "text",
      lines: ["sudo: command not allowed"],
    };
  },
};
