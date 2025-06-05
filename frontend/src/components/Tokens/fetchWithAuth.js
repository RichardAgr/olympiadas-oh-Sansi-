// src/api/fetchWithAuth.js
export async function fetchWithAuth(url, options = {}) {
  const authToken = localStorage.getItem("authToken");

  const config = {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
  };

  return fetch(url, config);
}
