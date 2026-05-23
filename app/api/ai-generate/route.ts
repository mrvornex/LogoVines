import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const data      = await req.formData();
    const imageFile = data.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ success: false, message: "No image provided" }, { status: 400 });
    }

    const bytes      = await imageFile.arrayBuffer();
    const buffer     = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    const prompt = `You are a professional logo analyst and copywriter.

Analyze this logo image carefully and generate:
1. A short, professional title (2-5 words max) — just the brand/logo name or style
2. A compelling description (1-2 sentences, max 100 characters) — what the logo represents

Rules:
- Title: concise, no extra words, no punctuation at end
- Description: professional, creative, suitable for a logo gallery
- Do NOT say "this logo" or "the logo" — write naturally
- Respond ONLY in this exact format, nothing else:

Title: [your title here]
Description: [your description here]`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data:     base64Data,
          mimeType: imageFile.type || "image/png",
        },
      },
    ]);

    const text = result.response.text().trim();

    const titleMatch = text.match(/Title:\s*(.+)/);
    const descMatch  = text.match(/Description:\s*(.+)/);

    const title = titleMatch?.[1]?.trim() || "";
    const desc  = descMatch?.[1]?.trim()  || "";

    if (!title || !desc) {
      return NextResponse.json({ success: false, message: "AI could not analyze image" }, { status: 422 });
    }

    return NextResponse.json({ success: true, title, desc });

  } catch (error: any) {
    console.error("[AI GENERATE ERROR]:", error);
    return NextResponse.json(
      { success: false, message: "AI generation failed: " + error.message },
      { status: 500 }
    );
  }
}