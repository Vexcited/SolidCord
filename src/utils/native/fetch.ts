import type { FetchOptions, Response } from "@tauri-apps/api/http";
import { fetch as _fetch } from "@tauri-apps/api/http";

import { DISCORD_API_ENDPOINT } from "@/api";
import { createClientPropertiesHeader } from "@/utils/api/client-properties";

/**
 * We re-export the function from Tauri but with a
 * constant header (`User-Agent`) for every requests.
 *
 * We add `User-Agent` to every native requests.
 * Instead of Tauri's default User-Agent, we use the one from our WebView.
 */
const fetch = async <T>(url: string, raw_options?: FetchOptions): Promise<Response<T>> => {
  const recommended_headers = {
    "User-Agent": navigator.userAgent,

    // Add `X-Super-Properties` header when calling Discord API.
    ...(url.startsWith(DISCORD_API_ENDPOINT) ? {
      "X-Super-Properties": await createClientPropertiesHeader()
    } : {})
  };

  // Add or override the "User-Agent" header.
  if (raw_options) {
    if (!raw_options.headers) raw_options.headers = {};
    raw_options.headers = {
      ...raw_options.headers,
      ...recommended_headers
    };
  }

  const options: FetchOptions = raw_options ?? { method: "GET", headers: recommended_headers };

  // Add timing to debug.
  const timerStart = performance.now();
  console.groupCollapsed(`[native/fetch] -> ${url}`);
  console.table(options.headers);
  if (options.query) console.table(options.query);
  console.info({ data: options.body, method: options.method });
  console.groupEnd();

  const data = await _fetch<T>(url, options);

  const timerEnd = performance.now();
  console.groupCollapsed(`[native/fetch] <- ${url} (took ~${Math.round(timerEnd - timerStart)}ms)`);
  console.table(data.headers);
  console.info({ status: data.status, data: data.data });
  console.groupEnd();

  return data;
};

export default fetch;
