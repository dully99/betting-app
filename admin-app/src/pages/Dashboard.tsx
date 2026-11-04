import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";

const menu = [
  { to: "/dashboard", label: "Home", icon: "🏠", end: true },
  { to: "/dashboard/free-tips", label: "Free Tips", icon: "⚽" },
  { to: "/dashboard/vip-tips", label: "VIP Tips", icon: "⭐" },
  { to: "/dashboard/results", label: "Results", icon: "📊" },
  { to: "/dashboard/create", label: "Create Tip", icon: "✏️" },
  { to: "/dashboard/review", label: "Review Queue", icon: "🛡️" },
  { to: "/dashboard/subscribe", label: "Subscribe", icon: "💎" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo"><span className="mark">⚽</span> SmartBet</div>
        <nav>
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end as any} className="menu-item">
              <span className="icon">{m.icon}</span> {m.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Sign out
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
