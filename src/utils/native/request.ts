import { getCurlInstallation } from "./appdata";

export type RequestOptionsMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "HEAD"
  | "DELETE"
  | "OPTIONS"
  | "TRACE"

export type RequestOptionsHttpClient =
  | "http2"
  | "http1.1"

export interface RequestOptions {
  /** @default "GET" */
  method?: RequestOptionsMethod;
  /** @default true */
  followRedirects?: boolean;
  /** @default "http2" */
  http_client?: RequestOptionsHttpClient;

  body?: string,
  headers?: HeadersInit
}

const NEW_LINE_REGEX = "[\\r]?\\n";

export const request = async (url: string, options: RequestOptions = {
  method: "GET",
  followRedirects: true,
  http_client: "http2"
}) => {
  const CURL_PATH = await getCurlInstallation()

  const command = [
    CURL_PATH,
    "-i" // Or `--include`, it includes protocol response headers in the output.
  ];

  switch (options.http_client) {
  case "http1.1":
    command.push("--http1.1");
    break;

  // cURL defaults to `--http2` when no specified.
  case "http2":
  default:
    options.http_client = "http2";
    command.push("--http2");
  }

  if (options.followRedirects)
    // Or `--location`, it allows to follow redirects.
    command.push("-L");

  const method = (options.method || "GET").toUpperCase() as RequestOptionsMethod;
  command.push("-X", method);

  if (options.headers) {
    options.headers = new Headers(options.headers);

    // Make sure to add a UA when there's none.
    if (!options.headers.get("user-agent"))
      options.headers.set("user-agent", navigator.userAgent);

    for (const [key, value] of options.headers.entries()) {
      command.push(`-H "${key}: ${value}"`);
    }
  }

  if (options.body && method !== "GET")
    // Or `--data <data>`, it adds HTTP POST data.
    command.push("-d", `"${options.body.replaceAll("\"", "\\\"")}"`);

  command.push(`"${url}"`);

  // /* For debugging purposes.
  console.groupCollapsed(`[native:request:input] ${options.method} ${url}`);
  console.table(Object.fromEntries([...(options.headers as Headers)]));
  options.body && console.info(options.headers?.get("content-type") === "application/json" ? JSON.parse(options.body) : options.body);
  console.info(command.join(" "));
  console.groupEnd();
  // */

  const { stdOut, stdErr, exitCode } = await Neutralino.os.execCommand(command.join(" "));

  if (exitCode !== 0 && !stdOut && stdErr) {
    const [,, raw_message] = stdErr.split(/curl: \((.*?)\) /);
    const message = raw_message.trim();
    throw new Error(message);
  }

  /** Header and body are seperated with two linebreaks. */
  const [raw_header, raw_body] = stdOut.split(new RegExp(NEW_LINE_REGEX + NEW_LINE_REGEX));

  /**
   * First line of the `raw_header` is all about the status
   * of the response (eg.: `HTTP/1.1 200 OK`, `HTTP/2 200`, ...)
   *
   * Every other lines are the headers received.
   */
  const [raw_status, ...raw_headers] = raw_header.split(new RegExp(NEW_LINE_REGEX));
  const received_headers: Omit<{
    [key: string]: string
  }, "set-cookie"> & { "set-cookie"?: string[] } = {};

  for (const header_raw of raw_headers) {
    const [raw_key, content] = header_raw.split(": ");
    /** Lowercase every headers so they're easier to parse. */
    const key = raw_key.toLowerCase();

    /**
     * When it comes to `set-cookie`, it's a bit different
     * since we can have multiple `set-cookie` headers.
     *
     * We put them in an array for get them more easily.
     */
    if (key === "set-cookie") {
      // Initialize the array if not already done.
      if (!received_headers["set-cookie"])
        received_headers["set-cookie"] = [];

      received_headers["set-cookie"].push(content);
      continue;
    }

    received_headers[key] = content;
  }

  const [http_version, raw_status_code, ...raw_status_message] = raw_status.split(" ");
  const status_message = raw_status_message.join(" ") || undefined;
  const status_code = parseInt(raw_status_code);

  // /* For debugging purposes.
  console.groupCollapsed(`[native:request:output] ${options.method} ${url}`);
  console.table(received_headers);
  console.info(received_headers["content-type"] === "application/json" ? JSON.parse(raw_body) : raw_body);
  console.groupEnd();
  // */

  return {
    http_version,
    status_code,
    status_message,

    raw_headers,
    headers: received_headers,

    text: () => raw_body,
    json: () => JSON.parse(raw_body)
  };
};
