import { useEffect, useState } from "react";
import { deletePrediction, getPredictions, type Prediction } from "../../api";
import PredictionCard from "../../components/PredictionCard";

export default function TipsList({ vip }: { vip: boolean }) {
  const [items, setItems] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const all = await getPredictions("PENDING");
      setItems(all.filter((p) => p.isVip === vip));
    } catch {
      setError("Cannot reach backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [vip]);

  const remove = async (id: number) => {
    if (!confirm("Delete this prediction?")) return;
    await deletePrediction(id);
    load();
  };

  return (
    <div>
      <h1>{vip ? "VIP Tips" : "Free Tips"} <span className="count">({items.length})</span></h1>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p className="empty">No published {vip ? "VIP" : "free"} predictions.</p>
      ) : (
        <div className="cards">
          {items.map((p) => (
            <PredictionCard key={p.id} p={p}>
              <button className="reject" onClick={() => remove(p.id)}>Delete</button>
            </PredictionCard>
          ))}
        </div>
      )}
    </div>
  );
}
