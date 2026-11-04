import type { ReactNode } from "react";
import type { Prediction } from "../api";

const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export default function PredictionCard({ p, children }: { p: Prediction; children?: ReactNode }) {
  return (
    <div className="card">
      <div className="card-top">
        <span className="league">{p.league} · {p.country}</span>
        <span className={`badge ${p.status.toLowerCase()}`}>{p.isVip ? "VIP" : "FREE"} · {p.status}</span>
      </div>
      <div className="teams">
        <span className="crest">{initials(p.homeTeam)}</span>{p.homeTeam}
        <span>vs</span>
        <span className="crest">{initials(p.awayTeam)}</span>{p.awayTeam}
      </div>
      <div className="meta">
        {new Date(p.matchTime).toLocaleString()} · Pick: <b>{p.predictionValue ?? p.prediction}</b> ·
        Odds {p.odds} · Confidence {p.confidence}%
      </div>
      {p.analysis && <p className="analysis">{p.analysis}</p>}
      {children && <div className="actions">{children}</div>}
    </div>
  );
}
