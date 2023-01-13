import type { DiscordMeResponse } from "@/api/users";

import localforage from "localforage";

export interface StoredAccount {
  token: string;
  informations: DiscordMeResponse;
}

export const accounts_storage = localforage.createInstance({
  name: "solidcord",
  storeName: "accounts"
});

export const listAccounts = async () => {
  const accounts: StoredAccount[] = [];
  await accounts_storage.iterate((value: StoredAccount) => accounts.push(value));

  return accounts;
};

export const initializeAcount = async (token: string, informations: DiscordMeResponse) => {
  const key = informations.id;

  await accounts_storage.setItem<StoredAccount>(key, {
    token,
    informations
  });
};

