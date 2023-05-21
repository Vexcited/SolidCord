import type { FetchOptions, Response } from "@tauri-apps/api/http";
import { fetch as _fetch } from "@tauri-apps/api/http";

/**
 * We re-export the function from Tauri but with a
 * constant header (`User-Agent`) for every requests.
 *
 * We add `User-Agent` to every native requests to make
 * the client less detectable for Discord.
 * Instead of Tauri's default User-Agent, we use the one from our WebView.
 */
const fetch = <T>(url: string, raw_options?: FetchOptions): Promise<Response<T>> => {
  const defaultHeaders = {
    "User-Agent": navigator.userAgent
  };

  if (raw_options) {
    // If options are passed, we check if some headers are set.
    if (!raw_options.headers) raw_options.headers = {};
    // If yes, just add/override the "User-Agent" header.
    raw_options.headers["User-Agent"] = navigator.userAgent;
  }

  const options: FetchOptions = raw_options ?? { method: "GET", headers: defaultHeaders };
  return _fetch<T>(url, options);
};

export default fetch;
