import type { DiscordMeResponse } from "@/api/users";

import localforage from "localforage";

export const cachingStorage = (user_id: string) => localforage.createInstance({
  name: "caching",
  storeName: user_id
});

export const createCacheStorage = (discordUsersMe: DiscordMeResponse) => {
  return cachingStorage(discordUsersMe.id)
    .setItem("/users/@me", discordUsersMe);
};

export const getCacheInStorage = <T>(user_id: string, endpoint: string) => {
  return cachingStorage(user_id)
    .getItem<T>(endpoint);
};

export const setCacheInStorage = <T>(user_id: string, endpoint: string, data: T) => {
  return cachingStorage(user_id)
    .setItem<T>(endpoint, data);
};
