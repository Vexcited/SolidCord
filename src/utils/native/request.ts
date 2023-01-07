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

  body?: unknown,
  headers?: Record<string, string>
}

// TODO: Make this customizable later.
const CURL_PATH = NL_OS === "Windows" ? "curl.exe" : "curl";

export const request = async (url: string, options: RequestOptions = {
  method: "GET",
  followRedirects: true,
  http_client: "http2"
}) => {
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

  if (options.headers)
    command.push(
      ...Object.entries(options.headers).map(
        ([key, value]) => `-H '${key}: ${value}'`
      )
    );

  if (options.body && method !== "GET")
    // Or `--data <data>`, it adds HTTP POST data.
    command.push("-d", `'${options.body}'`);

  command.push(`'${url}'`);

  const output = await Neutralino.os.execCommand(command.join(" "));
  return output;
};
