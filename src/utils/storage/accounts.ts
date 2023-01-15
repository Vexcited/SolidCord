import localforage from "localforage";

export interface StoredAccount {
  token: string;
}

export const accounts_storage = localforage.createInstance({
  name: "accounts",
  storeName: "accounts"
});

export const setAccount = async (user_id: string, token: string) => {
  return accounts_storage.setItem<StoredAccount>(user_id, {
    token
  });
};

export const getAccount = async (user_id: string) => {
  const account = await accounts_storage.getItem<StoredAccount>(user_id);
  return account;
};
