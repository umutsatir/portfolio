export const site = {
  brand: "UMUTSATIR.DEV",
  ensLike: "umut.eth",
  email: "umutstr54@gmail.com",
  github: { label: "github.com/umutsatir", href: "https://github.com/umutsatir" },
  twitter: { label: "@umut_satir", href: "https://twitter.com/umut_satir" },
  telegram: { label: "@umutsatir", href: "https://t.me/umutsatir" },
  cal: { label: "cal.com/umutsatir", href: "https://cal.com/umutsatir" },
  status: "status: online · istanbul, tr · UTC+3",
  latency: "response latency: < 24h, usually < 2h",
  // TODO: fill in real PGP fingerprint once generated
  pgp: "pgp: 3F91 A2C4 88D0 17BE",
  walletLabel: "umutsatir.dev wallet",
};

export const stackTiers = [
  {
    letter: "A",
    tier: "DAILY_DRIVER",
    items: ["TypeScript", "React", "Next.js", "MongoDB", "MySQL", "PHP", "Solidity", "Node.js"],
    note: "// ships to mainnet every week",
    dashed: false,
  },
  {
    letter: "B",
    tier: "COMFORTABLE",
    items: ["Python", "PostgreSQL", "Docker", "AWS", "Linux"],
    note: "// productive without the docs open",
    dashed: false,
  },
  {
    letter: "C",
    tier: "EXPLORING",
    items: ["Rust", "distributed systems", "zk-proofs", "Move"],
    note: "// dangerous enough to ask good questions",
    dashed: true,
  },
];

export const workItems = [
  {
    number: "01",
    slug: "obscura",
    title: "OBSCURA",
    subtitle: "ON-CHAIN DAPPS · COMMIT-REVEAL · MONAD BLITZ ISTANBUL · MONAD TESTNET",
  },
  {
    number: "02",
    slug: "zk-voting",
    title: "ZK VOTING",
    subtitle: "ANONYMOUS BALLOTS · ZK-SNARK MERKLE PROOF · NOIR + ULTRAHONK · SEPOLIA",
  },
  {
    number: "03",
    slug: "roam-swarm",
    title: "ROAM-SWARM",
    subtitle: "LOCATION DISCOVERY · WORLD ID · ENS · ETHGLOBAL CANNES",
  },
];

type WorkSection = {
  label: string;
  heading: string;
  code?: string[];
  body: string;
};

type WorkDetail = {
  number: string;
  title: string;
  dot: string;
  tagline: string;
  badge: string;
  github: string;
  facts: { label: string; value: string }[];
  sections: WorkSection[];
};

export const workDetails: Record<string, WorkDetail> = {
  obscura: {
    number: "01",
    title: "OBSCURA",
    dot: ".",
    tagline:
      "Two front-running-resistant dApps — on-chain voting and a sealed-bid auction — built on commit-reveal and deployed to Monad Testnet to stress-test the reveal-phase transaction spike.",
    badge: "MONAD BLITZ · 6H BUILD",
    github: "https://github.com/GTU-Blockchain/obscura-monad-blitz-istanbul",
    facts: [
      { label: "EVENT", value: "Monad Blitz Istanbul" },
      { label: "CHAIN", value: "Monad Testnet" },
      { label: "STACK", value: "Solidity · Hardhat · React" },
      { label: "TIMELINE", value: "6-hour build · Feb 2026" },
    ],
    sections: [
      {
        label: "§00 — CONTEXT",
        heading: "Six hours reframes the goal.",
        body: "Monad Blitz Istanbul ran on a 6-hour clock — not enough to build a product, enough to demonstrate understanding. Commit-reveal is the canonical fix for front-running in on-chain voting and auctions: lock a hashed choice, reveal only after the deadline. Monad's 500ms blocks and parallel EVM made it the right chain to stress-test the transaction burst that reveal phases create.",
      },
      {
        label: "§01 — WHAT I BUILT",
        heading: "Two contracts, one factory, shared frontend.",
        body: "CommitRevealVoting and SealedBidAuction, both deployable through a shared factory, plus a React frontend covering both flows. Split roughly in half with one teammate — contracts, tests, and UI all shared.",
      },
      {
        label: "§02 — HOW IT WORKS",
        heading: "Commit. Reveal. Settle.",
        code: [
          "1 commit   keccak256(choice, secret, msg.sender)",
          "2 reveal   open (choice, secret) after the deadline",
          "3 settle   hash must match · only valid reveals count",
        ],
        body: "msg.sender goes into the hash so a committed value can't be replayed from another address. The factory spins up new voting or auction instances without redeploying for every round.",
      },
      {
        label: "§03 — REFLECTIONS",
        heading: "The failure mode wasn't in the contracts.",
        body: "The secret that unlocks a reveal lives in the browser — clear localStorage between commit and reveal and the stake is gone for good. That's not a bug, it's a UX ceiling built into commit-reveal itself: fixing it server-side just reintroduces the trusted party the pattern exists to remove.",
      },
      {
        label: "§04 — OUTCOME",
        heading: "No prize. Shipped anyway.",
        body: "Both contracts and the factory worked end-to-end inside the 6-hour window, demoed live on Monad Testnet.",
      },
    ],
  },
  "zk-voting": {
    number: "02",
    title: "ZK VOTING",
    dot: ".",
    tagline:
      "Anonymous on-chain voting: voters prove eligibility via a ZK-SNARK Merkle inclusion proof without revealing identity, with a blake2s nullifier preventing double votes.",
    badge: "31 PASSING TESTS",
    github: "https://github.com/umutsatir/zkvoting-app",
    facts: [
      { label: "EVENT", value: "GTU CSE 496 · Capstone" },
      { label: "CHAIN", value: "Ethereum Sepolia" },
      { label: "STACK", value: "Noir · Barretenberg · Solidity" },
      { label: "TIMELINE", value: "Solo · 2026" },
    ],
    sections: [
      {
        label: "§00 — CONTEXT",
        heading: "Porting zkVot off Mina.",
        body: "node101 built zkVot, an anonymous ZK-voting protocol — but only for Mina. My senior capstone needed a substantial solo contribution, so I ported it to Ethereum: different proof system, different verification cost, different toolchain end to end.",
      },
      {
        label: "§01 — WHAT I BUILT",
        heading: "Circuit, contracts, and frontend — solo.",
        body: "A Noir circuit, a Solidity verifier and voting contract, and a React frontend with wagmi and viem, deployed to Sepolia. The organizer builds a Merkle tree of eligible voters; each voter proves membership without revealing which leaf; the contract checks the proof and a nullifier.",
      },
      {
        label: "§02 — HOW IT WORKS",
        heading: "Prove in the browser, verify on-chain.",
        code: [
          "private   voter secret key, Merkle path",
          "public    Merkle root, nullifier, vote choice",
          "circuit   asserts leaf ∈ tree · nullifier derived from key",
        ],
        body: "The circuit proves via UltraHonk, generated client-side through Barretenberg WASM in a Web Worker so proving never blocks the UI. The verifier contract checks the nullifier hasn't been used before it even calls into the ZK verifier.",
      },
      {
        label: "§03 — REFLECTIONS",
        heading: "A documented dead end, on purpose.",
        body: "Tried swapping the blake2s nullifier for ERC-7524's PLUME scheme. distributed-lab/noir-plume v2.0.0 doesn't compile against nargo 1.0.0-beta.13 — an incompatibility undocumented upstream. I wrote it up instead of forcing it: knowing where a path doesn't go is still a result.",
      },
      {
        label: "§04 — OUTCOME",
        heading: "31 passing tests, full flow on Sepolia.",
        body: "13 circuit tests, 10 contract tests, 8 end-to-end. Deploy, prove in-browser, verify on-chain, tally updates — all verified live on Sepolia.",
      },
    ],
  },
  "roam-swarm": {
    number: "03",
    title: "ROAM-SWARM",
    dot: ".",
    tagline:
      "Location-based discovery game where players unlock real places to get AI-generated stories and nearby recommendations, with every unlock a verifiable proof a real human was there.",
    badge: "5 PROTOCOLS INTEGRATED",
    github: "https://github.com/GTU-Blockchain/roamswarm-ethglobal-cannes-2026",
    facts: [
      { label: "EVENT", value: "ETHGlobal Cannes 2026" },
      { label: "CHAIN", value: "Ethereum testnet" },
      { label: "STACK", value: "Solidity · Next.js · World ID" },
      { label: "TIMELINE", value: "3 days · team of 3" },
    ],
    sections: [
      {
        label: "§00 — CONTEXT",
        heading: "Reward the walk, not just the arrival.",
        body: "Most location apps optimize for arrival, not the walk that gets you there. Roam-Swarm makes real-world places dormant nodes on a map — getting physically close unlocks an AI-generated story about the place, plus nearby recommendations a guidebook wouldn't list.",
      },
      {
        label: "§01 — WHAT I BUILT",
        heading: "Five integrations, three days, three of us.",
        body: "I owned the contract layer and most of the ENS + World ID glue: the unlock registry and ENS subname issuance in Solidity, the Next.js map and story UI, World ID for one-human-one-account, Chainlink for location verification, 0G for AI inference and storage, x402 for micropayment-gated premium content.",
      },
      {
        label: "§02 — HOW IT WORKS",
        heading: "Proof of presence, not proof of GPS.",
        code: [
          'function lockPayment(bytes32 poiId, address contributor)',
          "    external payable {",
          '    require(msg.value > 0, "No payment");',
          "    // ...locks payment, emits PaymentLocked",
          "}",
        ],
        body: "A World ID proof gets you a portable ENS subname identity. Walking near a location submits a claim that Chainlink-backed oracle data validates against expected GPS accuracy before the unlock writes on-chain. 0G then serves an AI narrative grounded in cached context, so repeat visitors see the same story instead of a fresh hallucination.",
      },
      {
        label: "§03 — REFLECTIONS",
        heading: "Every piece worked. The pitch didn't land.",
        body: "Five tracks in one five-minute demo dilutes the story judges can hold onto. Next time: one track, one narrative, and cut whatever doesn't survive the 60-second cut.",
      },
      {
        label: "§04 — OUTCOME",
        heading: "No prize — but a real result anyway.",
        body: "Shipped a working end-to-end demo across all five integrations inside the hackathon window. Production-grade integration with five protocols in three days turned out to be the real takeaway.",
      },
    ],
  },
};

export const careerChain = [
  {
    block: "BLOCK #00",
    year: "2022",
    hash: "0000001",
    prev: "———————",
    title: "GENESIS",
    desc: "First dApps, first smart contracts. Began exploring the Ethereum ecosystem through self-directed projects.",
    winner: false,
    filled: true,
  },
  {
    block: "BLOCK #01",
    year: "2022",
    hash: "c15e0f6",
    prev: "0000001",
    title: "GTU BLOCKCHAIN",
    desc: "Co-founded GTU Blockchain from scratch, leading the software committee and serving on the board.",
    winner: false,
    filled: false,
  },
  {
    block: "BLOCK #02",
    year: "2023",
    hash: "3d9c441",
    prev: "c15e0f6",
    title: "ETHGLOBAL ISTANBUL",
    desc: "Won first place with Cryptle, an on-chain Wordle with ETH staking, built with a five-person team.",
    winner: true,
    filled: false,
  },
  {
    block: "BLOCK #03",
    year: "2024",
    hash: "f7b3a19",
    prev: "3d9c441",
    title: "SOFTWARE DEVELOPER @ XON",
    desc: "PHP backend: database design, API architecture, and large-scale system design for corporate projects.",
    winner: false,
    filled: false,
  },
  {
    block: "BLOCK #04",
    year: "2025",
    hash: "9c02e8d",
    prev: "f7b3a19",
    title: "SOFTWARE ENGINEER @ NODE101",
    desc: "Joined node101 to build Web3 and zero-knowledge products, close to the infrastructure layer.",
    winner: false,
    filled: false,
  },
  {
    block: "BLOCK #05",
    year: "2026",
    hash: "a41f7c2",
    prev: "9c02e8d",
    title: "ETHGLOBAL CANNES · ROAM-SWARM",
    desc: "Location-based discovery protocol with on-chain unlocks and AI-generated place narratives.",
    winner: false,
    filled: false,
  },
  {
    block: "BLOCK #06",
    year: "2027",
    hash: "???????",
    prev: "a41f7c2",
    title: "MSc · MILANO",
    desc: "Distributed systems, Politecnico di Milano.",
    winner: false,
    filled: false,
    future: true,
  },
];
