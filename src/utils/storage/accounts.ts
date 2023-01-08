import localforage from "localforage";

export interface StoredAccount {
  token: string;
}

export const accounts_storage = localforage.createInstance({
  name: "solidcord",
  storeName: "accounts"
});

export const listAccounts = async () => {
  const accounts: StoredAccount[] = [];
  await localforage.iterate((value: StoredAccount) => accounts.push(value));

  return accounts;
};
