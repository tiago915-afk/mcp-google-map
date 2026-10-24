export class PublishError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: unknown,
  ) {
    super(message);
  }
}

export async function requestJson<T>(url: string, init: RequestInit, label: string): Promise<T> {
  const res = await fetch(url, init);
  const text = await res.text();
  const body = text ? safeJson(text) : undefined;
  if (!res.ok) {
    throw new PublishError(`${label} : HTTP ${res.status} ${describe(body) ?? text}`, res.status, body);
  }
  return body as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function describe(body: unknown): string | undefined {
  if (body && typeof body === "object") {
    const b = body as { error?: { message?: string }; message?: string };
    return b.error?.message ?? b.message;
  }
  return undefined;
}
