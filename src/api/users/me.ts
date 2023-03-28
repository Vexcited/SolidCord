import type { DiscordMeResponse } from "./types";

import { fetch } from "@tauri-apps/api/http";
import { DISCORD_API_ENDPOINT } from "@/api";

import { userStore } from "@/stores/user";
import { createResource } from "solid-js";

import { setCacheInStorage, CachingStorageEndpoints } from "@/utils/storage/caching";

export const callUsersMeAPI = async (req?: { token?: string }) => {
  const token = req?.token || userStore.token;
  if (!token) throw new Error("User not available.");

  const uri = DISCORD_API_ENDPOINT + "v9/users/@me";
  const response = await fetch(uri, {
    method: "GET",
    headers: {
      "Authorization": token
    }
  });

  const data = response.data as (
    DiscordMeResponse
  );

  if (userStore.token && userStore.id) {
    setCacheInStorage<DiscordMeResponse>(userStore.id, CachingStorageEndpoints.USERS_ME, data);
  }

  return data;
};

export const useUsersMeAPI = () => createResource(
  () => userStore.token,
  () => callUsersMeAPI()
);
