import { fetch as native_fetch } from "@tauri-apps/plugin-http";

import { DISCORD_API_ENDPOINT } from "@/api";
import { createClientPropertiesHeader } from "@/utils/api/client-properties";

export type Reply<T> = {
  status: number;
  headers: Headers;
  data: T;
};

/**
 * Re-export of the `fetch` function from Tauri but with some tweaks.
 */
const fetch = async <T>(url: string | URL, options: {
  /** @default "GET" */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** @default {} */
  headers?: Record<string, string>;
  /** @default undefined */
  body?: string | Record<string, unknown>;
  /** @default "json" */
  response?: "json" | "text";
}): Promise<Reply<T>> => {
  // We convert the `URL` to a string.
  if (url instanceof URL) url = url.href;

  // Default options
  Object.assign(options, {
    method: options.method ?? "GET",
    headers: options.headers ?? {},
    body: options.body ?? undefined,
    response: options.response ?? "json"
  });

  const recommended_headers = {
    "User-Agent": navigator.userAgent,

    // Add `X-Super-Properties` header when calling Discord API.
    ...(url.startsWith(DISCORD_API_ENDPOINT) ? {
      "X-Super-Properties": await createClientPropertiesHeader()
    } : {})
  };

  if (!options.headers) options.headers = {};
  // Add or override the "User-Agent" header.
  options.headers = {
    ...options.headers,
    ...recommended_headers
  };

  if (options.body && typeof options.body === "object") {
    options.headers["Content-Type"] = "application/json";
  }
  
  // Prettify request in console.
  console.groupCollapsed(`[native/fetch] ${options.method} -> ${url}`);
  console.table(options.headers);
  console.log(options.body)
  console.groupEnd();

  // Add a timer for the request.
  let timer_in_ms = performance.now();
  const response = await native_fetch(url, {
    method: options.method,
    headers: options.headers,
    body: options.body ? (
      typeof options.body === "string" ? options.body : JSON.stringify(options.body)
    ) : undefined
  });
  timer_in_ms = Math.round(performance.now() - timer_in_ms);

  const data = await (options.response === "json" ?  response.json() : response.text());

  // Prettify response in console.
  console.groupCollapsed(`[native/fetch] <- ${response.status} ${url} (took ~${timer_in_ms}ms)`);
  console.log(data);
  console.groupEnd();

  return {
    data,
    headers: response.headers,
    status: response.status
  };
};

export default fetch;