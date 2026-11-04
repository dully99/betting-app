import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <span className="logo"><span className="mark">Smart</span>Bet<span style={{color:"#5b6b84",fontWeight:600,fontSize:14}}> Admin</span></span>
        <Link to="/login" className="btn">Admin Login</Link>
      </nav>
      <section className="hero">
        <h1>Prediction management, end to end.</h1>
        <p>
          Sync fixtures from Sportmonks, generate AI-powered match analysis,
          review and approve picks, and publish them to the SmartBet mobile app.
        </p>
        <div className="hero-actions">
          <Link to="/login" className="btn primary">Open Dashboard</Link>
        </div>
      </section>
      <section className="features">
        <div className="feature"><h3>Data Collection</h3><p>Fixtures, results and predictions synced from Sportmonks on a schedule.</p></div>
        <div className="feature"><h3>AI Analysis</h3><p>LLM-generated match analysis for every pick, with statistical fallback.</p></div>
        <div className="feature"><h3>Review & Approve</h3><p>Nothing reaches users until an admin approves it in the review queue.</p></div>
        <div className="feature"><h3>Auto Results</h3><p>Finished matches are settled automatically as WON or LOST.</p></div>
      </section>
    </div>
  );
}
