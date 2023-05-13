import type { DiscordMeResponse } from "./types";

import fetch from "@/utils/native/fetch";
import { DISCORD_API_ENDPOINT, getCurrentAccountToken } from "@/api";

// import caching from "@/stores/caching";

// import { setCacheInStorage } from "@/utils/storage/caching";

export const callUsersMeAPI = async (token?: string) => {
  // let isFromCurrent = false;

  if (!token) {
    token = getCurrentAccountToken();
    // isFromCurrent = true;
  }

  const uri = DISCORD_API_ENDPOINT + "v9/users/@me";
  const response = await fetch(uri, {
    method: "GET",
    headers: { authorization: token }
  });

  const data = response.data as (
    DiscordMeResponse
  );

  // if (isFromCurrent) {
  //   const [_, setCache] = caching.useCurrent();
  //   setCacheInStorage<DiscordMeResponse>(userStore.id, CachingStorageEndpoints.USERS_ME, data);
  // }

  return data;
};
