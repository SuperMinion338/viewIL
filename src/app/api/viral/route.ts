import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { containsBlockedWords } from "@/lib/contentFilter";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();
    if (!idea) return NextResponse.json({ error: "חסר רעיון" }, { status: 400 });
    if (containsBlockedWords(idea))
      return NextResponse.json({ error: "הטקסט מכיל מילים לא מתאימות." }, { status: 400 });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a viral content strategist specializing in Israeli social media. Analyze the given video idea and return ONLY a JSON object (no markdown, no extra text) with this exact structure:
{
  "overallScore": 7.4,
  "subScores": {
    "catchiness": 8,
    "israeliRelevance": 9,
    "shareability": 6,
    "uniqueness": 7
  },
  "strengths": ["strength 1 in Hebrew", "strength 2 in Hebrew"],
  "weaknesses": ["weakness 1 in Hebrew", "weakness 2 in Hebrew"],
  "improvements": ["improvement 1 in Hebrew", "improvement 2 in Hebrew", "improvement 3 in Hebrew"],
  "betterVersion": "improved idea in Hebrew"
}
Be honest and specific. Use Israeli context. All text in Hebrew.`,
        },
        {
          role: "user",
          content: `נתח את הרעיון הזה לסרטון: "${idea}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const jsonStr = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(jsonStr);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Viral API error:", error);
    const status = (error as { status?: number })?.status;
    if (status === 429)
      return NextResponse.json({ error: "חרגת ממגבלת הבקשות. המתן רגע ונסה שוב.", retryAfter: 30 }, { status: 429 });
    return NextResponse.json({ error: "שגיאה בניתוח. נסה שוב." }, { status: 500 });
  }
}
