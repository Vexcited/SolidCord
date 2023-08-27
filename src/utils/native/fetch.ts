import { type FetchOptions, type Response, fetch as _fetch, Body } from "@tauri-apps/api/http";

import { DISCORD_API_ENDPOINT } from "@/api";
import { createClientPropertiesHeader } from "@/utils/api/client-properties";

/** We replace the `body` property in our `fetch` function to prevent the extra step. */
type FetchRawOptions = Omit<FetchOptions, "body"> & {
  body?: (
    | Record<string, unknown>
    | string
    | Body
  );
}

/**
 * Re-export of the `fetch` function from Tauri but with some tweaks.
 *
 * @param url - URL to fetch.
 * @param raw_options - Parameters to pass to the `fetch` function.
 *
 * @example
 * const { data } = await fetch("https://example.com/api", {
 *   method: "POST",
 *   body: { hello: "world" }
 * })
 */
const fetch = async <T>(url: string | URL, raw_options?: FetchRawOptions): Promise<Response<T>> => {
  // We convert the `URL` to a string.
  if (url instanceof URL) url = url.href;

  const recommended_headers = {
    "User-Agent": navigator.userAgent,

    // Add `X-Super-Properties` header when calling Discord API.
    ...(url.startsWith(DISCORD_API_ENDPOINT) ? {
      "X-Super-Properties": await createClientPropertiesHeader()
    } : {})
  };

  if (raw_options) {
    // Add or override the "User-Agent" header.
    if (!raw_options.headers) raw_options.headers = {};
    raw_options.headers = {
      ...raw_options.headers,
      ...recommended_headers
    };

    // When we don't use an instance of Tauri HTTP API's `Body`,
    // we should assign it automatically.
    if (raw_options.body && !(raw_options.body instanceof Body)) {
      switch (typeof raw_options.body) {
      case "string":
        raw_options.body = Body.text(raw_options.body);
        break;
      case "object":
        raw_options.body = Body.json(raw_options.body);
        break;
      }
    }
  }

  // When we don't have any `raw_options`, we still use the default ones.
  const options: FetchOptions = raw_options as FetchOptions ?? { method: "GET", headers: recommended_headers };

  // Prettify request in console.
  console.groupCollapsed(`[native/fetch] ${options.method} -> ${url}`);
  console.table(options.headers);
  if (options.query) console.table(options.query);
  if (options.body) console.log(options.body);
  console.groupEnd();

  // Add a timer for the request.
  let timer_in_ms = performance.now();
  const response = await _fetch<T>(url, options);
  timer_in_ms = Math.round(performance.now() - timer_in_ms);

  // Prettify response in console.
  console.groupCollapsed(`[native/fetch] <- ${response.status} ${url} (took ~${timer_in_ms}ms)`);
  console.table(response.headers);
  if (response.data) console.log(response.data);
  console.groupEnd();

  return response;
};

export default fetch;
export { ResponseType } from "@tauri-apps/api/http";
