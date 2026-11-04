import { useEffect, useState } from "react";
import {
  approvePrediction,
  getReviewQueue,
  regenerateAnalysis,
  rejectPrediction,
  type Prediction,
} from "../../api";
import PredictionCard from "../../components/PredictionCard";

export default function Review() {
  const [items, setItems] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getReviewQueue());
    } catch {
      setError("Cannot reach backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id: number, fn: (id: number) => Promise<Prediction>) => {
    setBusy(id);
    try {
      await fn(id);
      await load();
    } catch {
      setError("Action failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <h1>Review Queue <span className="count">({items.length})</span></h1>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p className="empty">No predictions awaiting review.</p>
      ) : (
        <div className="cards">
          {items.map((p) => (
            <PredictionCard key={p.id} p={p}>
              <button className="approve" disabled={busy === p.id} onClick={() => act(p.id, approvePrediction)}>
                Approve
              </button>
              <button className="reject" disabled={busy === p.id} onClick={() => act(p.id, rejectPrediction)}>
                Reject
              </button>
              <button className="regen" disabled={busy === p.id} onClick={() => act(p.id, regenerateAnalysis)}>
                Regenerate Analysis
              </button>
            </PredictionCard>
          ))}
        </div>
      )}
    </div>
  );
}
