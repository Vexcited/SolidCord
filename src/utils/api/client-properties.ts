import fetch from "@/utils/native/fetch";
import Bowser from "bowser";

/** Information on current WebView. */
const browser = Bowser.parse(window.navigator.userAgent);

export interface DiscordClientProperties {
  /** @example "Windows" */
  os: string;
  /** @example "10" */
  os_version: string;

  browser: string;
  browser_version: string;
  browser_user_agent: string;

  device: string;
  /** @example "fr" */
  system_locale: string;

  referrer: string;
  referring_domain: string;
  referrer_current: string;
  referring_domain_current: string;

  /** @example "stable" */
  release_channel: string;
  /** Value from `client_build_number_cache` */
  client_build_number: number;
  client_event_source: null;
}

let client_build_number_cache: string | undefined;
let client_properties_cache: DiscordClientProperties | undefined;

export const buildClientPropertiesObject = async (): Promise<DiscordClientProperties> => {
  if (!client_build_number_cache) {
    // Thanks to [voidfill](https://github.com/voidfill) for the API endpoint.
    const response = await fetch<{ client_build_number: string }>("https://discordversion.voidfill.cc/");
    client_build_number_cache = response.data.client_build_number;
  }

  if (!client_properties_cache) {
    client_properties_cache = {
      os: browser.os.name as string,
      browser: browser.browser.name as string,
      device: "",
      system_locale: window.navigator.language,
      browser_user_agent: window.navigator.userAgent,
      browser_version: browser.browser.version as string,
      os_version: browser.os.versionName as string,
      referrer: "",
      referring_domain: "",
      referrer_current: "",
      referring_domain_current: "",
      release_channel: "stable",
      client_build_number: parseInt(client_build_number_cache),
      client_event_source: null
    };
  }

  return client_properties_cache;
};

export const createClientPropertiesHeader = async (): Promise<string> => {
  const clientPropertiesObject = await buildClientPropertiesObject();
  return btoa(JSON.stringify(clientPropertiesObject));
};
