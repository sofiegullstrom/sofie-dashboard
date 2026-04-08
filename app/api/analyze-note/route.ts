import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `Du är en intelligent assistent för Sofies personliga projektdashboard. Din uppgift är att analysera fritext och returnera strukturerad JSON.

## Sofies projekt och nyckelord
- **Great Earth** (hälsoprodukter, affiliate, nyhetsbrev) — nyckelord: "greatearth", "great earth", "hälso", "vitaminer", "supplement"
- **Pepper Deals** (deals, affiliate, kampanjer) — nyckelord: "pepper", "pepperdeals", "deals", "kampanj", "affiliate"
- **HomesForYou** (fastigheter, boende, content) — nyckelord: "homesforyou", "homes", "fastighet", "bostad", "boende"
- **GavelDal** (auktioner, antikviteter, content) — nyckelord: "gavledal", "gavelsdal", "gavel", "auktion", "antik", "viktor"
- **PrimeBets** (sport, spel, prenumeranter) — nyckelord: "primebets", "prime", "bets", "odds", "sport", "spel"
- **Sociala medier** (TikTok, Instagram, content) — nyckelord: "tiktok", "instagram", "inlägg", "reel", "video", "sociala", "saman"
- **Övrigt** — allt som inte matchar ovanstående

## Teammedlemmar
- Sara = Social Media Manager
- Clara = Content Creator
- Max = Marketing Manager
- Gustav = Growth Manager

## Prioritetsbedömning
- **high**: ord som "brådskande", "idag", "asap", "nu", "deadline", "måste", "viktigt", "snabbt"
- **medium**: normalt arbete utan tidspress
- **low**: "sen", "nästa vecka", "när tid finns", "kanske"

## Tidsuppskattning
- Snabb koll / svar: 10–15 min
- Enkelt inlägg / meddelande: 20–30 min
- Video / redigering: 30–60 min
- Artikel / nyhetsbrev: 45–90 min
- Möte / planering: 30–60 min
- Komplex rapport / strategi: 60–120 min

## Output-format
Returnera ALLTID giltig JSON i detta format (inga markdown-backticks, bara ren JSON):
{
  "project": "Great Earth",
  "type": "task" | "update" | "idea" | "note" | "mixed",
  "summary": "Kort beskrivning av vad som skrevs (1 mening, svenska)",
  "tasks": [
    {
      "title": "Uppgiftstitel (konkret, actionbar)",
      "priority": "high" | "medium" | "low",
      "estimated_minutes": 30,
      "notes": "Valfri extra info om uppgiften"
    }
  ],
  "completed": ["Beskrivning av något som verkar vara klart/gjort"],
  "suggestion": "Valfritt förslag på nästa steg eller markera som klar (null om inget)"
}

## Regler
- tasks kan vara tom array [] om inget är en uppgift
- completed kan vara tom array [] om inget verkar klart
- suggestion är null om inget förslag behövs
- Var konkret: "Redigera video 3 för Great Earth" inte bara "Redigera video"
- Om texten innehåller flera uppgifter — dela upp dem i separata tasks-objekt
- Titlar på svenska
- MAX 5 tasks per analys`;

export interface AnalyzedNote {
  project: string;
  type: "task" | "update" | "idea" | "note" | "mixed";
  summary: string;
  tasks: {
    title: string;
    priority: "high" | "medium" | "low";
    estimated_minutes: number;
    notes?: string;
  }[];
  completed: string[];
  suggestion: string | null;
}

export async function POST(req: NextRequest) {
  const { text, currentProject } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  const userMessage = currentProject
    ? `Nuvarande projektsida: ${currentProject}\n\nText att analysera:\n${text}`
    : `Text att analysera:\n${text}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "Unexpected response" }, { status: 500 });
  }

  try {
    const parsed: AnalyzedNote = JSON.parse(content.text);
    return NextResponse.json(parsed);
  } catch {
    // If JSON parse fails, return a fallback
    return NextResponse.json({
      project: currentProject || "Övrigt",
      type: "note",
      summary: text.slice(0, 100),
      tasks: [{ title: text.slice(0, 80), priority: "medium", estimated_minutes: 30 }],
      completed: [],
      suggestion: null,
    } as AnalyzedNote);
  }
}
