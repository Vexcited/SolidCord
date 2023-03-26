import type { DiscordMeResponse } from "@/api/users";

import localforage from "localforage";

export enum CachingStorageEndpoints {
  USERS_ME = "/users/me"
}

export interface CachingStorage {
  /** This is a required endpoint for each account. */
  [CachingStorageEndpoints.USERS_ME]: DiscordMeResponse;
}

export const cachingStorage = (user_id: string) => localforage.createInstance({
  name: "caching",
  storeName: user_id
});

export const createCacheStorage = (discordUsersMe: DiscordMeResponse) => {
  return cachingStorage(discordUsersMe.id)
    .setItem(CachingStorageEndpoints.USERS_ME, discordUsersMe);
};

export const getCache = <T>(user_id: string, endpoint: CachingStorageEndpoints) => {
  return cachingStorage(user_id)
    .getItem<T>(endpoint);
};

export const setCache = <T>(user_id: string, endpoint: CachingStorageEndpoints, data: T) => {
  return cachingStorage(user_id)
    .setItem<T>(endpoint, data);
};
