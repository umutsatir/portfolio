/**
 * Profanity filter for the signature notes (English + Turkish). Shared by the browser (early warning) and the
 * API (the real check). It works on whole words, so innocent words that merely contain a bad one ("class",
 * "Scunthorpe", "Amina") pass, and it sees through the usual tricks: leetspeak (f0ck, $hit), stretched letters
 * (fuuuck), spaced or dotted letters (f u c k, s.i.k), masked letters (f*ck) and Turkish diacritics.
 *
 * The lists are plain arrays below: add or remove words there.
 */

/* ---- English: whole word ---- */
const EN_EXACT = [
  "fuck", "fvck", "phuck", "fucks", "fucker", "fuckers", "fucked", "fucking", "fck", "fuk", "fuq", "motherfucker", "mofo", "wtf",
  "shit", "shits", "shitty", "bullshit", "shite",
  "bitch", "bitches", "bitchy", "bastard", "bastards", "asshole", "assholes", "arsehole", "ass", "asses", "dumbass", "jackass",
  "dick", "dicks", "dickhead", "cock", "cocks", "cocksucker", "prick", "pussy", "pussies", "cunt", "cunts", "twat", "wanker", "tosser",
  "whore", "whores", "slut", "sluts", "hoe", "skank", "douche", "douchebag", "cum", "jizz", "blowjob", "handjob", "dildo", "porn", "boobs", "tits",
  "nigger", "niggers", "nigga", "niggas", "faggot", "faggots", "fag", "fags", "dyke", "tranny", "kike", "spic", "chink", "gook", "wetback", "paki", "coon",
  "retard", "retards", "retarded", "rapist", "kys", "stfu", "gtfo",
];
/* ---- English: any word that starts with it ---- */
const EN_STEMS = ["fuck", "shit", "bitch", "cunt", "nigg", "fagg", "motherf", "cocksuck", "whore", "retard"];

/* ---- Turkish: matched on the text exactly as typed (with ç ş ğ ı ö ü), for words that would clash with an
        English word once the diacritics are dropped (göt/got, piç/pic, amına/Amina) ---- */
const TR_RAW_EXACT = ["göt", "götü", "götüne", "götünü", "götveren", "piç", "piçler", "puşt", "amına", "amını", "amcık", "ananı", "ananın", "orospu", "taşak", "taşşak", "yavşak", "şerefsiz", "gerizekalı", "sürtük", "kahpe", "döl", "sıçtım", "sıçarım", "sıçayım", "sıçmak"];
const TR_RAW_STEMS = ["orospu", "amcık", "yavşak", "götveren", "taşak"];

/* ---- Turkish: ASCII spelling (people often write without diacritics) ---- */
const TR_EXACT = [
  "amk", "aq", "amq", "amg", "sik", "sikik", "siker", "sikim", "sikerim", "sikeyim", "sikeyimmi", "siktir", "siktirgit", "siktirlan",
  "ibne", "ibneler", "gavat", "pezevenk", "yarrak", "yarak", "dalyarak", "dalyarrak", "amcik", "orospu", "orospucocugu", "kahpe", "yavsak", "tasak", "tassak",
  "serefsiz", "namussuz", "gerizekali", "dangalak", "surtuk", "pust", "ezik", "sictim", "sicarim", "sicayim", "orospucocuklari", "ananisikeyim", "anasinisikeyim",
  "aptal", "salak",
];
const TR_STEMS = ["siktir", "sikeyim", "sikerim", "sikicem", "sikecem", "orospu", "pezevenk", "yarrak", "dalyar", "amcik", "yavsak", "gavat", "ibne"];

/* ---- phrases (matched on the ASCII-folded text, at word starts) ---- */
const PHRASES = ["amina koy", "amini sik", "anani sik", "anasini sik", "ananin ami", "anani avrat", "kill yourself", "go die", "fuck you", "fuck off", "piece of shit", "son of a bitch", "orospu cocu", "got veren"];

const FOLD: Record<string, string> = { ı: "i", ş: "s", ğ: "g", ü: "u", ö: "o", ç: "c", â: "a", î: "i", û: "u" };
const LEET: Record<string, string> = { "@": "a", $: "s", "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "!": "i", "+": "t" };

const fold = (s: string) => s.replace(/[ışğüöçâîû]/g, (c) => FOLD[c]);
const leet = (t: string) => (/\p{L}{2,}/u.test(t) ? t.replace(/[@$013457!+]/g, (c) => LEET[c]) : t);

const set = (a: string[]) => new Set(a);
const S_EN = set(EN_EXACT);
const S_TR = set(TR_EXACT);
const S_TR_RAW = set(TR_RAW_EXACT);

/** "fuuuck" -> ["fuuuck", "fuck", "fuuck"]: stretched letters collapse to one or two. */
function variants(t: string): string[] {
  const out = new Set([t]);
  if (/(.)\1{2,}/.test(t)) {
    out.add(t.replace(/(.)\1{2,}/g, "$1"));
    out.add(t.replace(/(.)\1{2,}/g, "$1$1"));
  }
  return [...out];
}

/** "f*ck" matches "fuck" (same length, every non-* letter equal). */
function masked(t: string, words: string[]): boolean {
  if (!t.includes("*") || t.replace(/\*/g, "").length < 2) return false;
  return words.some((w) => w.length === t.length && [...t].every((c, i) => c === "*" || c === w[i]));
}

type Mode = "raw" | "en" | "tr";
function hit(token: string, mode: Mode): boolean {
  for (const v of variants(token)) {
    if (mode === "raw") {
      if (S_TR_RAW.has(v) || TR_RAW_STEMS.some((s) => v.startsWith(s))) return true;
    } else if (mode === "en") {
      if (S_EN.has(v) || EN_STEMS.some((s) => v.startsWith(s))) return true;
    } else if (S_TR.has(v) || TR_STEMS.some((s) => v.startsWith(s))) return true;
  }
  return false;
}

export function isProfane(text: string): boolean {
  const lower = text.normalize("NFC").toLowerCase().replace(/i̇/g, "i");
  // split into words; keep * and leet symbols inside words
  const tokens = lower.split(/[^\p{L}\p{N}@$!+*]+/u).filter(Boolean).map((t) => t.replace(/^[!+]+|[!+]+$/g, ""));
  // runs of single letters ("f u c k", "s.i.k") are one word
  const words: string[] = [];
  let run = "";
  for (const t of [...tokens, ""]) {
    if (t.length === 1 && /[\p{L}*]/u.test(t)) run += t;
    else {
      if (run.length >= 3) words.push(run);
      if (run.length && run.length < 3) words.push(...run.split(""));
      run = "";
      if (t) words.push(t);
    }
  }
  const allWords = [...EN_EXACT, ...TR_EXACT];
  for (const w of words) {
    for (const t of new Set([w, leet(w)])) {
      const f = fold(t);
      // Turkish ASCII spellings only count when the word was typed without diacritics: "sık" (frequent) is not "sik"
      if (hit(t, "raw") || hit(f, "en") || (f === t && hit(f, "tr")) || masked(f, allWords)) return true;
    }
  }
  // phrases, on the folded text with every non-letter turned into a space
  const flat = " " + fold(lower).replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
  return PHRASES.some((p) => flat.includes(" " + p));
}
