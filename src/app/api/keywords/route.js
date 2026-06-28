export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query || query.trim().length === 0) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const prompt = `You are an expert SEO keyword research analyst. Given the seed keyword or topic: "${query}"

Generate a comprehensive keyword research report. Respond ONLY with a valid JSON object, no markdown, no explanation, no backticks.

The JSON must have this exact structure:
{
  "topic": "string - the analyzed topic",
  "overview": "string - 2 sentence summary of keyword opportunity",
  "keywords": [
    {
      "keyword": "string",
      "volume": number (monthly searches, realistic estimate),
      "difficulty": number (0-100, SEO difficulty),
      "cpc": number (cost per click in USD),
      "intent": "Informational|Commercial|Transactional|Navigational",
      "trend": "Rising|Stable|Declining",
      "opportunity": "High|Medium|Low"
    }
  ],
  "longTail": [
    {
      "keyword": "string",
      "volume": number,
      "difficulty": number,
      "intent": "Informational|Commercial|Transactional|Navigational"
    }
  ],
  "questions": ["string array of 5 PAA-style questions people ask"],
  "contentIdeas": ["string array of 4 blog post title ideas"],
  "topTip": "string - one actionable SEO tip for this niche"
}

Generate exactly 8 main keywords and 6 long-tail keywords. Make the data realistic and useful for a blogger.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      }
    );

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return Response.json(parsed);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
