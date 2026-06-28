export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query || query.trim().length === 0) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "API key not configured" }, { status: 500 });
    }

    const prompt = `You are an SEO expert. Given topic: "${query}"

Return ONLY a JSON object with NO extra text, NO markdown, NO backticks.

{
  "topic": "topic name",
  "overview": "2 sentence opportunity summary",
  "keywords": [
    {"keyword": "kw1", "volume": 5000, "difficulty": 40, "cpc": 1.2, "intent": "Informational", "trend": "Rising", "opportunity": "High"},
    {"keyword": "kw2", "volume": 3000, "difficulty": 55, "cpc": 0.8, "intent": "Commercial", "trend": "Stable", "opportunity": "Medium"},
    {"keyword": "kw3", "volume": 8000, "difficulty": 70, "cpc": 2.1, "intent": "Transactional", "trend": "Rising", "opportunity": "High"},
    {"keyword": "kw4", "volume": 1500, "difficulty": 25, "cpc": 0.5, "intent": "Informational", "trend": "Stable", "opportunity": "High"},
    {"keyword": "kw5", "volume": 4000, "difficulty": 45, "cpc": 1.8, "intent": "Commercial", "trend": "Rising", "opportunity": "Medium"},
    {"keyword": "kw6", "volume": 2000, "difficulty": 30, "cpc": 0.9, "intent": "Informational", "trend": "Declining", "opportunity": "Low"},
    {"keyword": "kw7", "volume": 6000, "difficulty": 60, "cpc": 1.5, "intent": "Navigational", "trend": "Stable", "opportunity": "Medium"},
    {"keyword": "kw8", "volume": 900, "difficulty": 20, "cpc": 0.3, "intent": "Informational", "trend": "Rising", "opportunity": "High"}
  ],
  "longTail": [
    {"keyword": "lt1", "volume": 400, "difficulty": 15, "intent": "Informational"},
    {"keyword": "lt2", "volume": 300, "difficulty": 20, "intent": "Commercial"},
    {"keyword": "lt3", "volume": 500, "difficulty": 18, "intent": "Informational"},
    {"keyword": "lt4", "volume": 200, "difficulty": 12, "intent": "Transactional"},
    {"keyword": "lt5", "volume": 350, "difficulty": 22, "intent": "Informational"},
    {"keyword": "lt6", "volume": 150, "difficulty": 10, "intent": "Commercial"}
  ],
  "questions": ["q1?", "q2?", "q3?", "q4?", "q5?"],
  "contentIdeas": ["idea1", "idea2", "idea3", "idea4"],
  "topTip": "one actionable SEO tip"
}

Replace all placeholder values with real data for the topic: "${query}". Return ONLY the JSON.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            temperature: 0.5, 
            maxOutputTokens: 4096
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini error:", errText);
      return Response.json({ error: "Gemini API error" }, { status: 500 });
    }

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return Response.json(parsed);
  } catch (error) {
    console.error("API Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
