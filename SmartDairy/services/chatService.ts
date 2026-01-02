const API_URL = "http://127.0.0.1:8000/chat"; // ← your PC IP

export async function askChat(query: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Failed to get answer");
  }

  return response.json(); // { answer }
}
