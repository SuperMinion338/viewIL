import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url?.trim()) {
      return NextResponse.json({ error: "חסר קישור" }, { status: 400 });
    }

    // Validate it's an Instagram or TikTok URL
    const isInstagram = url.includes("instagram.com");
    const isTikTok = url.includes("tiktok.com");

    if (!isInstagram && !isTikTok) {
      return NextResponse.json(
        { error: "נא להכניס קישור מאינסטגרם או TikTok בלבד" },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    let html: string;
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8",
          "Cache-Control": "no-cache",
        },
        redirect: "follow",
      });
      clearTimeout(timeout);
      html = await res.text();
    } catch {
      return NextResponse.json(
        {
          error:
            "לא הצלחנו לגשת לפוסט — נסה להכניס את הנתונים ידנית",
        },
        { status: 422 }
      );
    }

    const $ = cheerio.load(html);

    const getMeta = (prop: string) =>
      $(`meta[property="${prop}"]`).attr("content") ||
      $(`meta[name="${prop}"]`).attr("content") ||
      "";

    const title = getMeta("og:title") || $("title").text();
    const description = getMeta("og:description");

    // Try to extract numbers from description/title
    // Instagram descriptions like "12.3K likes, 456 comments"
    // TikTok titles like "3.2M views | 45K likes"
    const extractNumber = (text: string, patterns: RegExp[]): number => {
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          const numStr = match[1].replace(/,/g, "");
          const multiplier =
            numStr.toLowerCase().endsWith("m")
              ? 1_000_000
              : numStr.toLowerCase().endsWith("k")
              ? 1_000
              : 1;
          return Math.round(parseFloat(numStr) * multiplier);
        }
      }
      return 0;
    };

    const combinedText = `${title} ${description}`;

    const likes = extractNumber(combinedText, [
      /(\d[\d.,]*[km]?)\s*likes?/i,
      /likes?[:\s]+(\d[\d.,]*[km]?)/i,
    ]);

    const views = extractNumber(combinedText, [
      /(\d[\d.,]*[km]?)\s*views?/i,
      /(\d[\d.,]*[km]?)\s*plays?/i,
      /views?[:\s]+(\d[\d.,]*[km]?)/i,
    ]);

    const comments = extractNumber(combinedText, [
      /(\d[\d.,]*[km]?)\s*comments?/i,
      /comments?[:\s]+(\d[\d.,]*[km]?)/i,
    ]);

    // If we got nothing useful, fall back
    if (!likes && !views && !comments) {
      return NextResponse.json(
        {
          error:
            "לא הצלחנו לגשת לפוסט — נסה להכניס את הנתונים ידנית",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      views,
      likes,
      comments,
      shares: 0,
      saves: 0,
      reach: views || likes * 3,
      platform: isInstagram ? "instagram" : "tiktok",
      source: title || url,
    });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "לא הצלחנו לגשת לפוסט — נסה להכניס את הנתונים ידנית" },
      { status: 422 }
    );
  }
}
