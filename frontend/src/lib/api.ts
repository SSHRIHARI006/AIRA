// src/lib/api.ts
export type BotResponse = { response: string };

/**
 * Safely read environment variables:
 * - Prefer Vite's import.meta.env (VITE_ prefixed)
 * - Fall back to process.env only if it exists at runtime
 */
function getEnvVar(name: string): string | undefined {
  // Vite exposes import.meta.env
  const im = (import.meta as any)?.env;
  if (im && typeof im[name] !== "undefined") {
    return String(im[name]);
  }

  // Only access process.env if process is defined at runtime (guarded)
  if (typeof (globalThis as any).process !== "undefined" && (globalThis as any).process?.env) {
    return (globalThis as any).process.env[name];
  }

  return undefined;
}

const API_URL = "http://127.0.0.1:8000/query";
const USE_MOCK =
  (getEnvVar("VITE_USE_MOCK") === "1" || getEnvVar("VITE_USE_MOCK") === "true") ||
  (getEnvVar("REACT_APP_USE_MOCK") === "1" || getEnvVar("REACT_APP_USE_MOCK") === "true");

/** simple mock used while backend isn't ready */
async function mockSend(query: string, signal?: AbortSignal): Promise<BotResponse> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => resolve({ response: `Mock reply: "${query}"` }), 700);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(t);
        // mimic fetch abort
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });
}

/**
 * sendChatQuery
 * - query: user text
 * - signal: optional AbortSignal to cancel in-flight requests
 *
 * Throws on network / unexpected response shapes.
 * Returns normalized { response: string }.
 */
export async function sendChatQuery(query: string, signal?: AbortSignal): Promise<BotResponse> {
  if (USE_MOCK) {
    return mockSend(query, signal);
  }

  if (!API_URL) {
    throw new Error(
      "Chat API URL not configured. Set VITE_CHAT_API_URL (Vite) or REACT_APP_CHAT_API_URL (CRA)."
    );
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add Authorization header here later if needed
    },
    body: JSON.stringify({ query }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Server ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json().catch(() => null);

  // Normalize common shapes
  if (typeof data === "string") return { response: data };
  if (data?.response) return { response: String(data.response) };
  if (data?.text) return { response: String(data.text) };
  if (Array.isArray(data?.output) && data.output[0]?.text) return { response: String(data.output[0].text) };

  throw new Error("Unexpected API response shape");
}
