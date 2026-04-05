import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { messages, context } = await req.json();

  const systemPrompt = `Du är en intelligent assistent för Sofies personliga projektdashboard.
Du är just nu på sidan för: ${context}.

Sofie är en digital marknadsförare och innehållsskapare. Hennes projekt:
- Great Earth: hållbara produkter, nyhetsbrev, kampanjer
- Pepper Deals: affiliate-marknadsföring, deals
- HomesForYou: fastighetsprojekt, leadsgenerering
- GavelDal: innehållspublicering
- PrimeBets: prenumeranter, sportbetting-innehåll

Sofies team: Sara (Social Media Manager), Clara (Content Creator), Max (Marketing Manager), Gustav (Growth Manager).
Sociala kanaler: TikTok @sofiegullstrom (986K visningar/mån), Instagram @sofiegullstrom (280K visningar/mån).

Svara alltid på svenska. Var konkret, kort och hjälpsam. Max 3-4 meningar om det inte krävs mer.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const content = response.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ content: "Kunde inte generera svar." });
  }

  return NextResponse.json({ content: content.text });
}
