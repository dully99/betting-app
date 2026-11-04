import { useEffect, useState } from "react";
import { getPlans, type Plan } from "../../api";

export default function Subscribe() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlans().then(setPlans).catch(() => setError("Cannot reach backend"));
  }, []);

  return (
    <div>
      <h1>Subscription Plans <span className="count">({plans.length})</span></h1>
      {error && <div className="error">{error}</div>}
      <div className="cards">
        {plans.map((p) => (
          <div key={p.id} className="card">
            <div className="card-top">
              <span className="league">{p.durationDays} days</span>
              {p.isPopular && <span className="badge vip">{p.badge || "POPULAR"}</span>}
            </div>
            <div className="teams">{p.name}</div>
            <div className="meta">${p.price}</div>
            {p.description && <p className="analysis">{p.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
