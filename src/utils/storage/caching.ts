import type { DiscordMeResponse } from "@/api/users";

import localforage from "localforage";

export enum StoredCacheEndpoint {
  USERS_ME = "/users/me"
}

export interface StoredCache {
  /** This is a required endpoint for each account. */
  [StoredCacheEndpoint.USERS_ME]: DiscordMeResponse;
}

export const caching_storage = (user_id: string) => localforage.createInstance({
  name: "caching",
  storeName: user_id
});

export const createCacheStorage = (discordUsersMe: DiscordMeResponse) => {
  return caching_storage(discordUsersMe.id)
    .setItem(StoredCacheEndpoint.USERS_ME, discordUsersMe);
};

export const getCache = <T>(user_id: string, endpoint: StoredCacheEndpoint) => {
  return caching_storage(user_id)
    .getItem<T>(endpoint);
};

export const setCache = <T>(user_id: string, endpoint: StoredCacheEndpoint, data: T) => {
  return caching_storage(user_id)
    .setItem<T>(endpoint, data);
};
