import { useEffect, useState } from "react";
import {
  createPrediction,
  getCategories,
  getFixtures,
  getOdds,
  type Category,
  type Fixture,
} from "../../api";

const PICKS = [
  "Home Win", "Away Win", "Draw",
  "Home Win or Draw", "Away Win or Draw", "Home Win or Away Win",
  "Over 2.5 Goals", "Under 2.5 Goals", "Over 1.5 Goals", "Under 3.5 Goals",
  "Both Teams to Score - Yes", "Both Teams to Score - No",
];

export default function CreateTip() {
  const [days, setDays] = useState(1);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Fixture | null>(null);
  const [prediction, setPrediction] = useState(PICKS[0]);
  const [odds, setOdds] = useState("1.85");
  const [confidence, setConfidence] = useState("80");
  const [isVip, setIsVip] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [oddsNote, setOddsNote] = useState<string | null>(null);

  useEffect(() => {
    getFixtures(days).then(setFixtures).catch(() => setError("Cannot load fixtures"));
    getCategories().then(setCategories).catch(() => {});
  }, [days]);

  const pickToMarket = (pick: string, o: Record<string, Record<string, number>>): number | null => {
    const p = pick.toLowerCase();
    if (p === "home win") return o.h2h?.home ?? null;
    if (p === "away win") return o.h2h?.away ?? null;
    if (p === "draw") return o.h2h?.draw ?? null;
    const m = p.match(/(over|under) ([\d.]+)/);
    if (m) return o.totals?.[`${m[1]}${m[2]}`] ?? null;
    if (p.includes("both teams")) return o.btts?.[p.includes("no") ? "no" : "yes"] ?? null;
    return null;
  };

  useEffect(() => {
    if (!selected) return;
    setOddsNote(null);
    getOdds(selected.homeTeam, selected.awayTeam).then((o) => {
      if (!o) {
        setOddsNote("No bookmaker odds found for this match");
        return;
      }
      const price = pickToMarket(prediction, o);
      if (price) {
        setOdds(price.toFixed(2));
        setOddsNote(`Bookmaker odds auto-filled: ${price.toFixed(2)}`);
      } else {
        setOddsNote("No market odds for this pick type");
      }
    }).catch(() => setOddsNote("Could not load odds"));
  }, [selected, prediction]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setError(null);
    const category = categories.find((c) => c.type === (isVip ? "VIP" : "FREE")) ?? categories[0];
    if (!category) {
      setError("No categories found");
      setLoading(false);
      return;
    }
    try {
      await createPrediction({
        homeTeam: selected.homeTeam,
        awayTeam: selected.awayTeam,
        league: selected.league,
        country: selected.country,
        matchTime: selected.startingAt.replace(" ", "T"),
        prediction,
        odds: parseFloat(odds),
        confidence: parseInt(confidence),
        categoryId: category.id,
        isVip,
        analysis: analysis || undefined,
        providerFixtureId: selected.providerFixtureId,
      });
      setNotice(`Published: ${selected.homeTeam} vs ${selected.awayTeam} — ${prediction}`);
      setSelected(null);
      setAnalysis("");
    } catch {
      setError("Failed to create prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <h1>Create Tip</h1>
        <div className="sync-bar">
          {[1, 2, 3].map((d) => (
            <button key={d} className={days === d ? "approve" : ""} onClick={() => setDays(d)}>
              {d === 1 ? "Today" : `+${d} days`}
            </button>
          ))}
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {notice && <div className="notice">{notice}</div>}

      <div className="create-grid">
        <div>
          <h2 className="section-title">Pick a match</h2>
          <div className="fixture-list">
            {fixtures.length === 0 && <p className="empty">No fixtures (check Sportmonks token / sync).</p>}
            {fixtures.map((f) => (
              <button
                key={f.id}
                className={`fixture-row ${selected?.id === f.id ? "selected" : ""}`}
                onClick={() => setSelected(f)}
              >
                <div className="f-main">
                  <span className="f-league">{f.league}</span>
                  <span className="f-teams">{f.homeTeam} vs {f.awayTeam}</span>
                </div>
                <span className="f-time">
                  {new Date(f.startingAt.replace(" ", "T")).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                  <br />
                  {new Date(f.startingAt.replace(" ", "T")).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="section-title">Your tip</h2>
          {selected ? (
            <form className="tip-form" onSubmit={submit}>
              <div className="teams">{selected.homeTeam} <span>vs</span> {selected.awayTeam}</div>
              <label>
                Prediction
                <select value={prediction} onChange={(e) => setPrediction(e.target.value)}>
                  {PICKS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <div className="form-row">
                <label>
                  Odds
                  <input type="number" step="0.01" min="1" value={odds} onChange={(e) => setOdds(e.target.value)} />
                </label>
                {oddsNote && <span className="odds-note">{oddsNote}</span>}
                <label>
                  Confidence %
                  <input type="number" min="1" max="100" value={confidence} onChange={(e) => setConfidence(e.target.value)} />
                </label>
              </div>
              <label className="vip-toggle">
                <input type="checkbox" checked={isVip} onChange={(e) => setIsVip(e.target.checked)} />
                VIP tip
              </label>
              <label>
                Analysis (optional)
                <textarea rows={3} value={analysis} onChange={(e) => setAnalysis(e.target.value)} />
              </label>
              <button className="btn primary" disabled={loading}>
                {loading ? "Publishing…" : "Publish Tip"}
              </button>
            </form>
          ) : (
            <p className="empty">Select a fixture to create a tip.</p>
          )}
        </div>
      </div>
    </div>
  );
}
