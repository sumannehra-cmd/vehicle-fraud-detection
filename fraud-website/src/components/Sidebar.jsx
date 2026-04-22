import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const btn = (path) => ({
    background: pathname === path ? "#1d4ed8" : "#334155",
    color: "#e5e7eb",
    width: "100%",
    marginBottom: 10
  });

  return (
    <div style={{ width: 220, padding: 16, borderRight: "1px solid #1f2937" }}>
      <h3>Fraud System</h3>
      <button style={btn("/dashboard")} onClick={() => nav("/dashboard")}>Dashboard</button>
      <button style={btn("/check")} onClick={() => nav("/check")}>Check Fraud</button>
      <button style={btn("/history")} onClick={() => nav("/history")}>History</button>
      <button onClick={() => { localStorage.clear(); nav("/"); }}>Logout</button>
    </div>
  );
}
