export type Section = { label: string; heading: string; body: string; code?: string[] };
export type Fact = { label: string; value: string };
export type Project = {
  num: string;
  title: string;
  glyph: string;
  bg: string;
  badge: string;
  event: string;
  short: string;
  tags: string[];
  github: string;
  live?: string;
  hasCode: boolean;
  hasCase: boolean;
  tagline?: string;
  facts?: Fact[];
  sections?: Section[];
};

export const projects: Project[] = [
    { num: '01', title: 'Obscura', glyph: '0x', bg: '#ffe680', badge: 'Monad Blitz · 6h build', event: 'Monad Blitz Istanbul · Feb 2026', short: 'Two front-running-resistant dApps, on-chain voting and a sealed-bid auction, built on commit-reveal, deployed to Monad Testnet.', tags: ['Solidity', 'Hardhat', 'React'], github: 'https://github.com/GTU-Blockchain/obscura-monad-blitz-istanbul', hasCode: true, hasCase: true,
      tagline: 'Two front-running-resistant dApps, on-chain voting and a sealed-bid auction, built on commit-reveal and deployed to Monad Testnet to stress-test the reveal-phase transaction spike.',
      facts: [{ label: 'EVENT', value: 'Monad Blitz Istanbul' }, { label: 'CHAIN', value: 'Monad Testnet' }, { label: 'STACK', value: 'Solidity · Hardhat · React' }, { label: 'TIMELINE', value: '6-hour build · Feb 2026' }],
      sections: [
        { label: '§01 · WHAT I BUILT', heading: 'Two contracts, one factory, shared frontend.', body: 'CommitRevealVoting and SealedBidAuction, both deployable through a shared factory, plus a React frontend covering both flows. Split roughly in half with one teammate, contracts, tests, and UI all shared.' },
        { label: '§02 · HOW IT WORKS', heading: 'Commit. Reveal. Settle.', code: ['1 commit   keccak256(choice, secret, msg.sender)', '2 reveal   open (choice, secret) after the deadline', '3 settle   hash must match · only valid reveals count'], body: "msg.sender goes into the hash so a committed value can't be replayed from another address. The factory spins up new voting or auction instances without redeploying for every round." },
        { label: '§03 · REFLECTIONS', heading: "The failure mode wasn't in the contracts.", body: "The secret that unlocks a reveal lives in the browser. Clear localStorage between commit and reveal and the stake is gone for good. That's a UX ceiling built into commit-reveal itself: fixing it server-side just reintroduces the trusted party the pattern exists to remove." },
        { label: '§04 · OUTCOME', heading: 'No prize. Shipped anyway.', body: 'Both contracts and the factory worked end-to-end inside the 6-hour window, demoed live on Monad Testnet.' }] },
    { num: '02', title: 'ZK Voting', glyph: 'zk', bg: '#b9defa', badge: '31 passing tests', event: 'GTU CSE 496 · Capstone · 2026', short: 'Anonymous on-chain voting: eligibility proven via a ZK-SNARK Merkle proof, with a blake2s nullifier preventing double votes.', tags: ['Noir', 'Barretenberg', 'Solidity'], github: 'https://github.com/umutsatir/zkvoting-app', hasCode: true, hasCase: true,
      tagline: 'Anonymous on-chain voting: voters prove eligibility via a ZK-SNARK Merkle inclusion proof without revealing identity, with a blake2s nullifier preventing double votes.',
      facts: [{ label: 'EVENT', value: 'GTU CSE 496 · Capstone' }, { label: 'CHAIN', value: 'Ethereum Sepolia' }, { label: 'STACK', value: 'Noir · Barretenberg · Solidity' }, { label: 'TIMELINE', value: 'Solo · 2026' }],
      sections: [
        { label: '§00 · CONTEXT', heading: 'Porting zkVot off Mina.', body: 'node101 built zkVot, an anonymous ZK-voting protocol, but only for Mina. My senior capstone needed a substantial solo contribution, so I ported it to Ethereum: different proof system, verification cost and toolchain end to end.' },
        { label: '§01 · WHAT I BUILT', heading: 'Circuit, contracts, and frontend, solo.', body: 'A Noir circuit, a Solidity verifier and voting contract, and a React frontend with wagmi and viem, deployed to Sepolia. The organizer builds a Merkle tree of eligible voters; each voter proves membership without revealing which leaf; the contract checks the proof and a nullifier.' },
        { label: '§02 · HOW IT WORKS', heading: 'Prove in the browser, verify on-chain.', code: ['private   voter secret key, Merkle path', 'public    Merkle root, nullifier, vote choice', 'circuit   asserts leaf ∈ tree · nullifier derived from key'], body: "The circuit proves via UltraHonk, generated client-side through Barretenberg WASM in a Web Worker so proving never blocks the UI. The verifier contract checks the nullifier hasn't been used before it even calls into the ZK verifier." },
        { label: '§03 · REFLECTIONS', heading: 'A documented dead end, on purpose.', body: "Tried swapping the blake2s nullifier for ERC-7524's PLUME scheme. distributed-lab/noir-plume v2.0.0 doesn't compile against nargo 1.0.0-beta.13, an incompatibility undocumented upstream. I wrote it up instead of forcing it: knowing where a path doesn't go is still a result." },
        { label: '§04 · OUTCOME', heading: '31 passing tests, full flow on Sepolia.', body: '13 circuit tests, 10 contract tests, 8 end-to-end. Deploy, prove in-browser, verify on-chain, tally updates, all verified live on Sepolia.' }] },
    { num: '03', title: 'Roam-Swarm', glyph: '◎', bg: '#b5efcf', badge: '5 protocols integrated', event: 'ETHGlobal Cannes 2026 · team of 3', short: 'Location-based discovery game: unlock real places for AI-generated stories, each unlock a verifiable proof a real human was there.', tags: ['Solidity', 'Next.js', 'World ID', 'ENS'], github: 'https://github.com/GTU-Blockchain/roamswarm-ethglobal-cannes-2026', hasCode: true, hasCase: true,
      tagline: 'Location-based discovery game where players unlock real places to get AI-generated stories and nearby recommendations, with every unlock a verifiable proof a real human was there.',
      facts: [{ label: 'EVENT', value: 'ETHGlobal Cannes 2026' }, { label: 'CHAIN', value: 'Ethereum testnet' }, { label: 'STACK', value: 'Solidity · Next.js · World ID' }, { label: 'TIMELINE', value: '3 days · team of 3' }],
      sections: [
        { label: '§00 · CONTEXT', heading: 'Reward the walk, not just the arrival.', body: 'Most location apps optimize for arrival, not the walk that gets you there. Roam-Swarm makes real-world places dormant nodes on a map, getting physically close unlocks an AI-generated story about the place, plus nearby recommendations a guidebook wouldn\'t list.' },
        { label: '§01 · WHAT I BUILT', heading: 'Five integrations, three days, three of us.', body: 'I owned the contract layer and most of the ENS + World ID glue: the unlock registry and ENS subname issuance in Solidity, the Next.js map and story UI, World ID for one-human-one-account, Chainlink for location verification, 0G for AI inference and storage, x402 for micropayment-gated premium content.' },
        { label: '§02 · HOW IT WORKS', heading: 'Proof of presence, not proof of GPS.', code: ['function lockPayment(bytes32 poiId, address contributor)', '    external payable {', '    require(msg.value > 0, "No payment");', '    // ...locks payment, emits PaymentLocked', '}'], body: 'A World ID proof gets you a portable ENS subname identity. Walking near a location submits a claim that Chainlink-backed oracle data validates against expected GPS accuracy before the unlock writes on-chain. 0G then serves an AI narrative grounded in cached context, so repeat visitors see the same story.' },
        { label: '§03 · REFLECTIONS', heading: "Every piece worked. The pitch didn't land.", body: 'Five tracks in one five-minute demo dilutes the story judges can hold onto. Next time: one track, one narrative, and cut whatever doesn\'t survive the 60-second cut.' },
        { label: '§04 · OUTCOME', heading: 'No prize, but a real result anyway.', body: 'Shipped a working end-to-end demo across all five integrations inside the hackathon window. Production-grade integration with five protocols in three days was the real takeaway.' }] },
    { num: '04', title: 'Stoafi', glyph: '%', bg: '#ffc7a1', badge: '90% test coverage', event: 'Local-first finance · PWA', short: 'A finance PWA that weighs installments against inflation instead of guessing. No server, no account.', tags: ['Next.js PWA', 'TypeScript', 'IndexedDB', 'TR / EN'], github: 'https://github.com/umutsatir/stoafi', live: '', hasCode: true, hasCase: true,
      tagline: 'Spend wisely, the stoic way. Stoafi weighs installments against inflation instead of guessing, and keeps everything on your device.',
      facts: [{ label: 'TYPE', value: 'Local-first PWA' }, { label: 'STACK', value: 'Next.js · TypeScript · IndexedDB' }, { label: 'LANGUAGES', value: 'Turkish · English' }, { label: 'TESTS', value: 'Pure core, 90% coverage' }],
      sections: [
        { label: '§01 · THE PROBLEM', heading: 'Installments or cash?', body: 'With high inflation, paying in installments can beat paying cash, but only if the interest rate stays below what inflation eats. Most people guess. Stoafi does the maths: pick a price, a number of installments, a monthly rate and an inflation figure, and it tells you which option costs less in today\'s money.' },
        { label: '§02 · HOW IT WORKS', heading: 'Discount every payment to today.', code: ['payment  = P·r·(1+r)^n / ((1+r)^n − 1)', 'pv       = Σ payment / (1 + inflation)^i', 'verdict  = pv − price   (below zero: installments win)'], body: 'Each installment is discounted by monthly inflation and summed into a present value, then compared with the cash price. The verdict says exactly how much you save or lose.' },
        { label: '§03 · ARCHITECTURE', heading: 'No server. No account.', body: 'Stoafi is local-first: data lives in IndexedDB on the device and the app works offline as a PWA. There is nothing to sign up for and nothing to leak. The calculation core is a set of pure functions with about 90% test coverage, kept separate from the UI.' }] },
    { num: '05', title: 'Cortex', glyph: '2×2', bg: '#ffe680', badge: 'macOS desktop', event: 'Desktop planner · Tauri', short: 'Capture, triage, timebox. A brain dump feeding an Eisenhower matrix you can drag tasks across.', tags: ['Tauri 2', 'Rust', 'React 19', 'SQLite'], github: 'https://github.com/umutsatir/cortex', live: '', hasCode: true, hasCase: true,
      tagline: 'A desktop planner built around one idea: capture everything first, decide later. Capture. Triage. Timebox.',
      facts: [{ label: 'TYPE', value: 'macOS desktop app' }, { label: 'SHELL', value: 'Tauri 2 · Rust' }, { label: 'UI', value: 'React 19 · Zustand · dnd-kit' }, { label: 'STORAGE', value: 'SQLite, local' }],
      sections: [
        { label: '§01 · WHAT IT DOES', heading: 'A brain dump that sorts itself out.', body: 'Everything you type lands in an inbox. From there you triage tasks into an Eisenhower matrix: Do first, Schedule, Delegate or Eliminate. Drag a task into a quadrant, or click it to cycle through them.' },
        { label: '§02 · HOW IT\'S BUILT', heading: 'Native shell, web UI.', code: ['shell    Tauri 2 + Rust', 'ui       React 19 + Zustand', 'dnd      dnd-kit', 'storage  SQLite (local)'], body: 'Tauri gives a small native binary with a Rust backend, while the interface stays in React. Zustand holds UI state, dnd-kit handles drag and drop, and SQLite keeps tasks on disk with no cloud involved.' }] },
    { num: '06', title: 'Meridian', glyph: 'MR', bg: '#b5efcf', badge: 'Pre-development', event: 'Native macOS · SwiftUI', short: 'Focus, but make it a flight. Every work session is a virtual flight: check in, fly in real time, land to collect stamps.', tags: ['Swift 6', 'SwiftUI', 'MapKit', 'SwiftData'], github: 'https://github.com/umutsatir/meridian', live: '', hasCode: true, hasCase: true,
      tagline: 'A focus app that turns every work session into a virtual flight. Currently in pre-development.',
      facts: [{ label: 'TYPE', value: 'Native macOS app' }, { label: 'STATUS', value: 'Pre-development' }, { label: 'STACK', value: 'Swift 6 · SwiftUI' }, { label: 'DATA', value: 'MapKit · SwiftData · CloudKit' }],
      sections: [
        { label: '§01 · THE IDEA', heading: 'Make focus feel like travel.', body: 'Pick a session length and the app assigns a route: 25 minutes is Istanbul to Sofia, 50 is Athens, 90 is Rome. Check in, tear the boarding stub, fly in real time and land to collect a stamp. A flight you do not want to abandon is a better timer than a countdown.' },
        { label: '§02 · HOW IT\'S BUILT', heading: 'Fully native.', code: ['ui       SwiftUI, Swift 6', 'map      MapKit', 'data     SwiftData', 'sync     CloudKit'], body: 'Meridian is a native macOS app: SwiftUI for the interface, MapKit for the flight path, SwiftData for sessions and stamps, and CloudKit to sync across devices.' }] },
    { num: '07', title: 'Cryptle', glyph: 'W', bg: '#ffffff', badge: '★ 1st place', event: 'ETHGlobal Istanbul · 2023 · team of 5', short: 'An on-chain Wordle with ETH staking. Won first place at ETHGlobal Istanbul with a five-person team.', tags: ['Solidity', 'dApp', 'Staking'], github: 'https://github.com/GTU-Blockchain/cryptle-ethistanbul-2025', hasCode: true, hasCase: false }
];

export type SkillGroup = { name: string; note: string; bg: string; line: "solid" | "dashed"; items: string[] };

export const skills: SkillGroup[] = [
        { name: 'Backend & data', note: '// daily driver', bg: '#ffe680', line: 'solid', items: ['Node.js', 'TypeScript', 'PHP', 'FastAPI', 'MongoDB', 'MySQL', 'PostgreSQL', 'Python'] },
        { name: 'Frontend', note: '// daily driver', bg: '#b5efcf', line: 'solid', items: ['React', 'Next.js', 'TypeScript'] },
        { name: 'Infra', note: '// comfortable', bg: '#b9defa', line: 'solid', items: ['Docker', 'AWS', 'Linux'] },
        { name: 'Web3 & ZK', note: '// ships to mainnet every week', bg: '#ffc7a1', line: 'solid', items: ['o1js', 'Solidity', 'Noir', 'zk-proofs', 'Distributed systems', 'Hardhat', 'wagmi / viem'] },
        { name: 'Exploring', note: '// dangerous enough to ask good questions', bg: '#fff', line: 'dashed', items: ['Rust', 'Move'] }
];
