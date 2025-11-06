import { NextRequest } from "next/server";

function toTitleCase(text: string): string {
  return text
    .split(" ")
    .map((w) => w.length ? w[0].toUpperCase() + w.slice(1) : w)
    .join(" ");
}

type Language = "english" | "hinglish" | "punjabi";

type Options = {
  mood: string;
  tempo: string;
  language: Language;
};

const MOOD_TONES: Record<string, string[]> = {
  reflective: [
    "quiet city lights and slow-burn skies",
    "pages turning in a room that knows my name",
    "footsteps echo, mapping out a gentle maze",
  ],
  romantic: [
    "midnight jasmine drifting through your hair",
    "hands like constellations finding home",
    "heartbeats syncing to a whispered prayer",
  ],
  ambitious: [
    "steel in the sunrise, climb begins",
    "shoelaces tight, horizon on my skin",
    "blueprints folded in my grin",
  ],
  melancholic: [
    "raindrops practice the rhythm I forgot",
    "letters smudged with all the almosts",
    "alleys hum with memory's soft revolt",
  ],
  uplifting: [
    "golden chorus in an open field",
    "windows wide and brighter wheels",
    "every no becoming something real",
  ],
};

const TEMPO_PATTERNS: Record<string, number[]> = {
  slow: [6, 6, 6, 6],
  mid: [8, 8, 8, 8],
  fast: [10, 10, 10, 10],
};

function hookLine(language: Language): string {
  switch (language) {
    case "english":
      return "Soch, soch ? my thought becomes the song";
    case "hinglish":
      return "Soch meri, soch teri ? banegi kahaani";
    case "punjabi":
      return "Soch meri, soch teri ? gallan vich geet";
  }
}

function connective(language: Language): string[] {
  switch (language) {
    case "english":
      return ["and", "while", "because", "so"];
    case "hinglish":
      return ["aur", "par", "kyunki", "toh"];
    case "punjabi":
      return ["te", "par", "kyonke", "taan"];
  }
}

function sprinkleSoch(line: string, language: Language): string {
  const places = [0, Math.floor(line.length / 2)];
  let result = line;
  for (const p of places) {
    if (Math.random() > 0.5) continue;
    if (p === 0) {
      result = `soch ${result}`;
    } else {
      result = `${result}, soch`;
    }
  }
  if (!/\bsoch\b/i.test(result)) {
    // ensure at least one occurrence
    result = `${result} ? soch`;
  }
  // small language flavor
  if (language === "hinglish") return result.replace(/\bis\b/g, "hai");
  if (language === "punjabi") return result.replace(/\bis\b/g, "aa");
  return result;
}

function buildVerse(opts: Options): string {
  const tones = MOOD_TONES[opts.mood] ?? MOOD_TONES.reflective;
  const connects = connective(opts.language);
  const pattern = TEMPO_PATTERNS[opts.tempo] ?? TEMPO_PATTERNS.mid;

  const rawLines: string[] = [];
  for (let i = 0; i < 4; i++) {
    const base = tones[i % tones.length];
    const extra = connects[i % connects.length];
    const words = (base + " " + extra).split(" ");
    const target = pattern[i % pattern.length];
    while (words.length < target) {
      const pick = words[Math.max(0, Math.floor(Math.random() * Math.min(words.length, 4)))];
      words.push(pick);
    }
    const line = sprinkleSoch(words.join(" "), opts.language);
    rawLines.push(toTitleCase(line));
  }

  return rawLines.join("\n");
}

function buildHook(opts: Options): string {
  const line = hookLine(opts.language);
  const variant = opts.language === "english"
    ? "Let the mind catch the beat, let the beat catch the mind"
    : opts.language === "hinglish"
    ? "Dhadkan pe chalti rahein, raah pe chalti dhadkan"
    : "Dhadkan de naal chalde, raah de naal dhadkan";
  return `${line}\n${variant}`;
}

function generateTitle(opts: Options): string {
  const moodToTitle: Record<string, string> = {
    reflective: "Maps Of Soch",
    romantic: "Soch Wale Din",
    ambitious: "Blueprint Soch",
    melancholic: "Monsoon Soch",
    uplifting: "Skyward Soch",
  };
  return moodToTitle[opts.mood] ?? "Soch, Set, Go";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const opts: Options = {
      mood: String(body.mood ?? "reflective"),
      tempo: String(body.tempo ?? "mid"),
      language: (body.language ?? "hinglish") as Language,
    };

    const title = generateTitle(opts);
    const verse1 = buildVerse(opts);
    const hook = buildHook(opts);
    const verse2 = buildVerse(opts);

    const lyrics = [
      "[Verse 1]",
      verse1,
      "",
      "[Hook]",
      hook,
      "",
      "[Verse 2]",
      verse2,
    ].join("\n");

    return new Response(JSON.stringify({ title, lyrics }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? "Invalid request" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
}
