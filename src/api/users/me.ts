import type { DiscordMeResponse } from "./types";

import { request } from "@/utils/native";
import { DISCORD_API_ENDPOINT } from "@/api";

import { user } from "@/stores/app";
import { createResource } from "solid-js";

import { setCache, StoredCacheEndpoint } from "@/utils/storage/caching";

export const callUsersMeAPI = async (req?: { token?: string }) => {
  const token = req?.token || user.token;
  if (!token) throw new Error("User not available.");

  const response = await request(DISCORD_API_ENDPOINT + "v9/users/@me", {
    method: "GET",
    headers: {
      "Authorization": token
    }
  });

  const body = response.json() as DiscordMeResponse;
  if (user.token && user.id) {
    setCache<DiscordMeResponse>(user.id, StoredCacheEndpoint.USERS_ME, body);
  }

  return body;
};

export const useUsersMeAPI = () => createResource(() => user.token, () => callUsersMeAPI());
