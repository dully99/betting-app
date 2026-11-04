import { useEffect, useState } from "react";
import { getPredictions, type Prediction } from "../../api";
import PredictionCard from "../../components/PredictionCard";

export default function Results() {
  const [items, setItems] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getPredictions("WON"), getPredictions("LOST")])
      .then(([won, lost]) =>
        setItems([...won, ...lost].sort((a, b) => b.matchTime.localeCompare(a.matchTime)))
      )
      .catch(() => setError("Cannot reach backend"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Results <span className="count">({items.length})</span></h1>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p className="empty">No settled predictions yet. Run "Sync Results" from Home.</p>
      ) : (
        <div className="cards">
          {items.map((p) => (
            <PredictionCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
