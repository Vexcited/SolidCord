import fetch from "@/utils/native/fetch";
import { type } from "@tauri-apps/plugin-os";

export interface DiscordClientProperties {
  browser: string
  client_build_number: number
  client_event_source: null
  client_version: string
  design_id: number
  native_build_number: null
  os: string
  os_arch: string
  os_version: string
  release_channel: string
  system_locale: string
}

let client_properties_cache: DiscordClientProperties | undefined;

export const findClientProperties = async (): Promise<DiscordClientProperties> => {
  if (!client_properties_cache) {
    let os = type() as string;
    if (os === "macos") os = "osx";
    else if (os === "android") os = "linux";

    const response = await fetch<{ properties: DiscordClientProperties }>("https://cordapi.dolfi.es/api/v2/properties/" + os, {
      method: "POST"
    });

    client_properties_cache = response.data.properties;
  }

  return client_properties_cache;
};

export const createClientPropertiesHeader = async (): Promise<string> => {
  const clientPropertiesObject = await findClientProperties();
  return btoa(JSON.stringify(clientPropertiesObject));
};
