import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
        Fraud Detection System
      </h3>

      <div style={{ display: "flex", gap: "15px" }}>
        <button onClick={() => navigate("/history")}>History</button>
        <button onClick={() => navigate("/")}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
