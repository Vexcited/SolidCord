import type { DiscordMeResponse } from "./types";

import { fetch } from "@tauri-apps/api/http";
import { DISCORD_API_ENDPOINT } from "@/api";

import { user } from "@/stores/app";
import { createResource } from "solid-js";

import { setCache, StoredCacheEndpoint } from "@/utils/storage/caching";

export const callUsersMeAPI = async (req?: { token?: string }) => {
  const token = req?.token || user.token;
  if (!token) throw new Error("User not available.");

  const uri = DISCORD_API_ENDPOINT + "v9/users/@me";
  const response = await fetch(uri, {
    method: "GET",
    headers: {
      "Authorization": token
    }
  });

  console.log(response);
  return;

  // const body = response.json() as DiscordMeResponse;
  // if (user.token && user.id) {
  //   setCache<DiscordMeResponse>(user.id, StoredCacheEndpoint.USERS_ME, body);
  // }

  // return body;
};

export const useUsersMeAPI = () => createResource(() => user.token, () => callUsersMeAPI());
