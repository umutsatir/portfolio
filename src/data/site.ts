export const EMAIL = "umutstr54@gmail.com";

export type AboutWord = { t: string; bg: string; pre: string; after: string; d: string };

export const aboutWords: AboutWord[] = [
  { t: "blockchain", bg: "#b9defa", pre: "I'm Umut Satır, a ", after: " &", d: "Smart contracts in Solidity, ZK circuits in Noir, shipped to mainnet and testnets. I care about the boring parts: state, ordering, failure modes." },
  { t: "fullstack", bg: "#b5efcf", pre: " ", after: "", d: "Node, TypeScript, FastAPI and React. Backend-heavy by habit, but I build the whole thing so the product works end to end." },
  { t: "node101", bg: "#ffe680", pre: " engineer at ", after: "", d: "Software engineer since 2025, building zero-knowledge and blockchain products close to the infrastructure layer." },
  { t: "ETHGlobal Istanbul", bg: "#ffc7a1", pre: ". I won ", after: "", d: "First place in 2023 with Cryptle, an on-chain Wordle with ETH staking, built with a team of five." },
  { t: "ZK systems", bg: "#e4d9ff", pre: ", built ", after: "", d: "A capstone system with eligibility proven by a ZK-SNARK Merkle proof, because elections deserve secret ballots. 31 passing tests." },
  { t: "GTU Blockchain", bg: "#b5efcf", pre: " and co-founded ", after: ".", d: "Co-founded the community in 2022, led the software committee and served on the board." },
  { t: "XON", bg: "#b9defa", pre: " Before that, ", after: ": PHP, databases and APIs at scale.", d: "Over a year of PHP backend work: database design, API architecture and large-scale system design for corporate projects. The foundation for everything on-chain." },
];

export const kv = [
  { k: "status", v: "online · Istanbul, TR · UTC+3" },
  { k: "education", v: "BSc Computer Engineering · GTU, class of 2027" },
  { k: "languages", v: "Turkish native · English fluent" },
  { k: "response", v: "< 24h, usually < 2h" },
];

export const timeline = [
  { year: "2025", title: "Software Engineer @ node101", desc: "Web3 and zero-knowledge products, close to the infrastructure layer.", tag: "Current", bg: "#fff", tagBg: "#b5efcf" },
  { year: "2024", title: "Software Developer @ XON", desc: "PHP backend: database design, API architecture, and large-scale system design for corporate projects.", tag: "Backend", bg: "#fff", tagBg: "#b9defa" },
  { year: "2023", title: "ETHGlobal Istanbul · 1st place", desc: "Won first place with Cryptle, an on-chain Wordle with ETH staking, built with a five-person team.", tag: "★ Winner", bg: "#fff", tagBg: "#ffe680" },
  { year: "2022", title: "Co-founded GTU Blockchain", desc: "Built the community from scratch, leading the software committee and serving on the board.", tag: "Community", bg: "#fff", tagBg: "#ffc7a1" },
  { year: "2022", title: "Genesis", desc: "First dApps, first smart contracts. Began exploring the Ethereum ecosystem through self-directed projects.", tag: "Block #00", bg: "#fff", tagBg: "#d9ccff" },
];

export const links = [
  { label: "GitHub", href: "https://github.com/umutsatir" },
  { label: "X · @umut_satir", href: "https://twitter.com/umut_satir" },
  { label: "Telegram", href: "https://t.me/umutsatir" },
  { label: "cal.com/umutsatir", href: "https://cal.com/umutsatir" },
];

export const navTabs = [
  ["about", "About"],
  ["work", "Work"],
  ["experience", "Experience"],
  ["contact", "Contact"],
] as const;
