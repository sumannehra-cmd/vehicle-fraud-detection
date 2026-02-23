import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Fraud", value: 42 },
  { name: "Not Fraud", value: 78 },
];

const COLORS = ["#ff4d4f", "#52c41a"];

export default function Dashboard() {
  return (
    <div style={container}>
      <h1 style={{ marginBottom: "20px" }}>📊 Fraud Detection Dashboard</h1>

      {/* Summary Cards */}
      <div style={cardRow}>
        <div style={card("#1890ff")}>
          <h3>Total Transactions</h3>
          <p>120</p>
        </div>
        <div style={card("#ff4d4f")}>
          <h3>Fraud Cases</h3>
          <p>42</p>
        </div>
        <div style={card("#52c41a")}>
          <h3>Safe Transactions</h3>
          <p>78</p>
        </div>
      </div>

      {/* Chart */}
      <div style={chartBox}>
        <h3>Fraud vs Safe Distribution</h3>
        <PieChart width={350} height={300}>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Actions */}
      <div style={{ marginTop: "30px" }}>
        <Link to="/check">
          <button style={btn}>🔍 Check Fraud</button>
        </Link>
        <Link to="/history">
          <button style={{ ...btn, marginLeft: "10px" }}>📜 View History</button>
        </Link>
      </div>
    </div>
  );
}

/* ===== Styles ===== */

const container = {
  padding: "30px",
  fontFamily: "Arial",
};

const cardRow = {
  display: "flex",
  gap: "20px",
};

const card = (color) => ({
  background: color,
  color: "white",
  padding: "20px",
  borderRadius: "12px",
  width: "200px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
});

const chartBox = {
  marginTop: "40px",
  background: "#f9f9f9",
  padding: "20px",
  borderRadius: "12px",
  width: "420px",
};

const btn = {
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  background: "#1890ff",
  color: "white",
  cursor: "pointer",
};