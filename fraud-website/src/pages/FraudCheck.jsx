import { useState } from "react";

export default function FraudCheck() {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);

  const checkFraud = async () => {
    const res = await fetch("http://localhost:5000/api/fraud/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>🔍 Fraud Check</h2>

      <input
        placeholder="Transaction Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={checkFraud}>Check</button>

      {result && (
        <h3 style={{ marginTop: "20px" }}>
          Result: {result.label} (Score: {result.fraudScore})
        </h3>
      )}
    </div>
  );
}