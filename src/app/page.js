"use client";
import { useState } from "react";

const COLORS = {
  bg: "#0A0F1E",
  surface: "#111827",
  card: "#1A2236",
  border: "#1E2D45",
  accent: "#3B82F6",
  green: "#10B981",
  yellow: "#F59E0B",
  red: "#EF4444",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#4B5563",
};

const difficultyColor = (d) => {
  if (d <= 30) return COLORS.green;
  if (d <= 60) return COLORS.yellow;
  return COLORS.red;
};
const difficultyLabel = (d) => {
  if (d <= 30) return "Easy";
  if (d <= 60) return "Medium";
  return "Hard";
};
const intentBadge = (intent) => {
  const map = {
    Informational: { bg: "#1E3A5F", color: "#60A5FA" },
    Commercial: { bg: "#1E3A2F", color: "#34D399" },
    Transactional: { bg: "#3A1E1E", color: "#F87171" },
    Navigational: { bg: "#3A2E1E", color: "#FBBF24" },
  };
  return map[intent] || { bg: "#2D2D2D", color: "#9CA3AF" };
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("volume");
  const [filterIntent, setFilterIntent] = useState("All");
  const [copiedIdx, setCopiedIdx] = useState(null);

  const analyzeKeywords = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch (e) {
      setError(e.message || "Kuch gadbad hui. Dobara try karo.");
    }
    setLoading(false);
  };

  const copyKeyword = (kw, idx) => {
    navigator.clipboard.writeText(kw);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const filteredKeywords = results?.keywords
    ?.filter((k) => filterIntent === "All" || k.intent === filterIntent)
    ?.sort((a, b) =>
      sortBy === "volume" ? b.volume - a.volume
      : sortBy === "difficulty" ? a.difficulty - b.difficulty
      : b.cpc - a.cpc
    );

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: COLORS.textPrimary }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔍</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>KeywordIQ</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted }}>AI-Powered Keyword Research</div>
        </div>
        <div style={{ marginLeft: "auto", background: "#1E3A2F", color: COLORS.green, fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>FREE PLAN</div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px", background: "linear-gradient(135deg, #F1F5F9, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Find Keywords That Rank
          </h1>
          <p style={{ color: COLORS.textSecondary, fontSize: 15, margin: "0 0 28px" }}>
            AI se discover karo high-opportunity keywords apne blog ke liye
          </p>
          <div style={{ display: "flex", gap: 10, maxWidth: 560, margin: "0 auto" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyzeKeywords()}
              placeholder="e.g. best stocks to buy, crypto trading, SIP investment..."
              style={{ flex: 1, padding: "14px 18px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.textPrimary, fontSize: 14, outline: "none" }}
            />
            <button
              onClick={analyzeKeywords}
              disabled={loading || !query.trim()}
              style={{ padding: "14px 24px", background: loading ? COLORS.textMuted : "linear-gradient(135deg, #3B82F6, #8B5CF6)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", minWidth: 100 }}
            >
              {loading ? "Analyzing..." : "Analyze →"}
            </button>
          </div>
          {error && <div style={{ color: COLORS.red, marginTop: 12, fontSize: 13 }}>{error}</div>}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚙️</div>
            <div style={{ color: COLORS.textSecondary }}>AI keyword data analyze ho raha hai...</div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Overview */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>📊</span>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{results.topic}</span>
              </div>
              <p style={{ color: COLORS.textSecondary, fontSize: 14, margin: 0, lineHeight: 1.6 }}>{results.overview}</p>
            </div>

            {/* Top Tip */}
            <div style={{ background: "linear-gradient(135deg, #1E3A5F22, #8B5CF622)", border: "1px solid #3B82F644", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20 }}>💡</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.accent, marginBottom: 4 }}>PRO TIP</div>
                <div style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6 }}>{results.topTip}</div>
              </div>
            </div>

            {/* Keywords Table */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>🎯 Main Keywords ({results.keywords?.length})</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <select value={filterIntent} onChange={(e) => setFilterIntent(e.target.value)}
                    style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, padding: "6px 10px", borderRadius: 6, fontSize: 12 }}>
                    {["All", "Informational", "Commercial", "Transactional", "Navigational"].map((i) => <option key={i}>{i}</option>)}
                  </select>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, padding: "6px 10px", borderRadius: 6, fontSize: 12 }}>
                    <option value="volume">Sort: Volume</option>
                    <option value="difficulty">Sort: Easiest</option>
                    <option value="cpc">Sort: CPC</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 90px 60px 110px 70px 36px", padding: "10px 20px", background: COLORS.surface, fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <span>Keyword</span><span>Volume</span><span>Difficulty</span><span>CPC</span><span>Intent</span><span>Trend</span><span></span>
              </div>

              {filteredKeywords?.map((kw, i) => (
                <div key={i}
                  style={{ display: "grid", gridTemplateColumns: "2fr 80px 90px 60px 110px 70px 36px", padding: "12px 20px", borderTop: `1px solid ${COLORS.border}`, alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{kw.keyword}</div>
                    <div style={{ fontSize: 11, marginTop: 2, color: kw.opportunity === "High" ? COLORS.green : kw.opportunity === "Medium" ? COLORS.yellow : COLORS.textMuted, fontWeight: 600 }}>
                      {kw.opportunity} Opp
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{kw.volume?.toLocaleString()}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 36, height: 5, background: COLORS.border, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${kw.difficulty}%`, height: "100%", background: difficultyColor(kw.difficulty), borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, color: difficultyColor(kw.difficulty), fontWeight: 600 }}>{difficultyLabel(kw.difficulty)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.green }}>${kw.cpc?.toFixed(2)}</div>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: intentBadge(kw.intent).bg, color: intentBadge(kw.intent).color }}>
                      {kw.intent}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: kw.trend === "Rising" ? COLORS.green : kw.trend === "Declining" ? COLORS.red : COLORS.textSecondary }}>
                    {kw.trend === "Rising" ? "↑ " : kw.trend === "Declining" ? "↓ " : "→ "}{kw.trend}
                  </div>
                  <button onClick={() => copyKeyword(kw.keyword, i)}
                    style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 5, cursor: "pointer", color: copiedIdx === i ? COLORS.green : COLORS.textMuted, fontSize: 12, padding: "4px 6px" }}>
                    {copiedIdx === i ? "✓" : "⎘"}
                  </button>
                </div>
              ))}
            </div>

            {/* Long Tail + Questions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>🔎 Long-Tail Keywords</div>
                {results.longTail?.map((kw, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none" }}>
                    <div>
                      <div style={{ fontSize: 13 }}>{kw.keyword}</div>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: intentBadge(kw.intent).bg, color: intentBadge(kw.intent).color, marginTop: 3, display: "inline-block" }}>
                        {kw.intent}
                      </span>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{kw.volume?.toLocaleString()}/mo</div>
                      <div style={{ fontSize: 10, color: difficultyColor(kw.difficulty) }}>KD {kw.difficulty}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>❓ People Also Ask</div>
                {results.questions?.map((q, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none", alignItems: "flex-start" }}>
                    <span style={{ color: COLORS.accent, fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>Q{i + 1}</span>
                    <span style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.5 }}>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Ideas */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>✍️ Blog Post Ideas</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {results.contentIdeas?.map((idea, i) => (
                  <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "12px 14px", fontSize: 13, lineHeight: 1.5 }}>
                    <span style={{ color: COLORS.accent, fontWeight: 700, marginRight: 6 }}>#{i + 1}</span>{idea}
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade CTA */}
            <div style={{ background: "linear-gradient(135deg, #1E2D45, #1E1E3A)", border: "1px solid #3B82F644", borderRadius: 12, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>🚀 More Searches Chahiye?</div>
              <div style={{ color: COLORS.textSecondary, fontSize: 14, marginBottom: 16 }}>Free plan mein 5 searches/day. Pro mein unlimited access + competitor analysis + backlink data.</div>
              <button style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 28px", cursor: "pointer" }}>
                Upgrade to Pro — ₹499/month →
              </button>
            </div>
          </div>
        )}

        {!results && !loading && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <div style={{ color: COLORS.textSecondary, fontSize: 15, marginBottom: 8 }}>Koi bhi topic ya seed keyword daalo</div>
            <div style={{ color: COLORS.textMuted, fontSize: 13 }}>e.g. "best mutual funds", "crypto for beginners", "how to invest in stocks"</div>
            <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
              {["mutual funds India", "penny stocks", "crypto trading", "SIP calculator"].map((s) => (
                <button key={s} onClick={() => setQuery(s)}
                  style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "7px 14px", fontSize: 12, color: COLORS.textSecondary, cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
