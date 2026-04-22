export const BASE_URL =
  "https://fraud-backend-production-cd09.up.railway.app";

export async function checkFraud(amount) {
  const res = await fetch(`${BASE_URL}/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  return res.json();
}

export async function getHistory() {
  const res = await fetch(`${BASE_URL}/history`);
  return res.json();
}
