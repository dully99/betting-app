import { useEffect, useState } from "react";
import { getStats, syncResults, syncToday, syncTomorrow } from "../../api";

export default function Home() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => getStats().then(setStats).catch(() => setError("Cannot reach backend"));

  useEffect(() => {
    load();
  }, []);

  const runSync = async (label: string, fn: () => Promise<Record<string, number>>) => {
    try {
      const res = await fn();
      setNotice(`${label}: ${JSON.stringify(res)}`);
      load();
    } catch {
      setError(`${label} failed`);
    }
  };

  const cards = [
    { key: "total", label: "Total Predictions" },
    { key: "review", label: "Awaiting Review" },
    { key: "published", label: "Published" },
    { key: "won", label: "Won" },
    { key: "lost", label: "Lost" },
    { key: "winRate", label: "Win Rate %" },
  ];

  return (
    <div>
      <div className="page-head">
        <h1>Dashboard</h1>
        <div className="sync-bar">
          <button onClick={() => runSync("Sync today", syncToday)}>Sync Today</button>
          <button onClick={() => runSync("Sync tomorrow", syncTomorrow)}>Sync Tomorrow</button>
          <button onClick={() => runSync("Sync results", syncResults)}>Sync Results</button>
        </div>
      </div>
      {notice && <div className="notice">{notice}</div>}
      {error && <div className="error">{error}</div>}
      <div className="stat-grid">
        {cards.map((c) => (
          <div key={c.key} className="stat-card">
            <div className="stat-value">{stats ? stats[c.key] ?? 0 : "—"}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
