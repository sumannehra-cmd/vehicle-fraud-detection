export function computeStats(transactions) {
  const total = transactions.length;
  const fraud = transactions.filter(t => t.status === "FRAUD").length;
  const rate = total === 0 ? 0 : ((fraud / total) * 100).toFixed(2);
  return { total, fraud, rate };
}
