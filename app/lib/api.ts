import { AyahDetail, SourceAyah } from "../types";

export const DEFAULT_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Formats a Surah and Ayah number into 3-digit strings for audio fetching.
 * e.g., Surah 2, Ayah 255 -> "002255.mp3"
 */
export function getAyahAudioUrl(surahNo: number, ayahNo: number): string {
  const pad = (n: number) => n.toString().padStart(3, "0");
  return `https://everyayah.com/data/Alafasy_128kbps/${pad(surahNo)}${pad(ayahNo)}.mp3`;
}

/**
 * Check backend connection and ping latency.
 */
export async function checkBackendHealth(
  baseUrl: string = DEFAULT_BACKEND_URL,
): Promise<{ ok: boolean; latencyMs: number }> {
  const start = performance.now();
  try {
    const res = await fetch(`${baseUrl}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });
    const latencyMs = Math.round(performance.now() - start);
    return { ok: res.ok, latencyMs };
  } catch {
    return { ok: false, latencyMs: 0 };
  }
}

/**
 * Standard Fast JSON Q&A endpoint (~2s).
 */
export async function sendChatMessageJSON(
  query: string,
  similarityThreshold?: number,
  baseUrl: string = DEFAULT_BACKEND_URL,
): Promise<{
  query: string;
  detected_language: string;
  is_greeting: boolean;
  answer: string;
  sources: SourceAyah[];
}> {
  const payload: { query: string; similarity_threshold?: number } = {
    query: query.trim(),
  };
  if (typeof similarityThreshold === "number") {
    payload.similarity_threshold = similarityThreshold;
  }

  const res = await fetch(`${baseUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `Server responded with status ${res.status}`);
  }

  return await res.json();
}

/**
 * Real-time SSE streaming endpoint (first token in ~0.8s).
 */
export async function sendChatMessageStream(
  query: string,
  similarityThreshold: number | undefined,
  baseUrl: string = DEFAULT_BACKEND_URL,
  callbacks: {
    onMetadata?: (meta: {
      query: string;
      detected_language: string;
      is_greeting: boolean;
      sources: SourceAyah[];
    }) => void;
    onToken?: (token: string) => void;
    onDone?: () => void;
    onError?: (err: Error) => void;
  },
  abortSignal?: AbortSignal,
): Promise<void> {
  const payload: { query: string; similarity_threshold?: number } = {
    query: query.trim(),
  };
  if (typeof similarityThreshold === "number") {
    payload.similarity_threshold = similarityThreshold;
  }

  try {
    const res = await fetch(`${baseUrl}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(payload),
      signal: abortSignal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Streaming failed with status ${res.status}`);
    }

    if (!res.body) {
      throw new Error("Streaming response has no readable body.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        const dataStr = trimmed.slice(6);
        if (!dataStr) continue;

        try {
          const event = JSON.parse(dataStr);
          if (event.type === "metadata") {
            callbacks.onMetadata?.({
              query: event.query,
              detected_language: event.detected_language,
              is_greeting: event.is_greeting,
              sources: event.sources || [],
            });
          } else if (event.type === "token") {
            callbacks.onToken?.(event.content || "");
          } else if (event.type === "done") {
            callbacks.onDone?.();
          }
        } catch {
          // Ignore partial parse
        }
      }
    }

    callbacks.onDone?.();
  } catch (err: unknown) {
    if (abortSignal?.aborted) return;
    const errorObj = err instanceof Error ? err : new Error(String(err));
    callbacks.onError?.(errorObj);
    throw errorObj;
  }
}

/**
 * Fetch detailed Ayah metadata and translations.
 */
export async function fetchAyahDetail(
  surahNo: number,
  ayahNo: number,
  baseUrl: string = DEFAULT_BACKEND_URL,
): Promise<AyahDetail> {
  const res = await fetch(`${baseUrl}/ayah/${surahNo}/${ayahNo}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Ayah ${surahNo}:${ayahNo} not found.`);
  }

  return await res.json();
}
