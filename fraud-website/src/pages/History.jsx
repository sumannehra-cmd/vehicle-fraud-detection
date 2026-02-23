export default function History() {
  const history = [
    { id: 1, amount: 5000, result: "Fraud" },
    { id: 2, amount: 1200, result: "Not Fraud" },
    { id: 3, amount: 9000, result: "Fraud" },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h2>📜 Fraud History</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.amount}</td>
              <td>{h.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}