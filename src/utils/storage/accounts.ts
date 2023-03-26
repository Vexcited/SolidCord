import localforage from "localforage";

export interface AccountStorage {
  token: string;
}

export const accountsStorage = localforage.createInstance({
  name: "accounts",
  storeName: "accounts"
});

/**
 * Retrieves storage from an account in the localForage
 * depending on the `user_id` key.
 */
export const getAccountStorage = async (user_id: string) => {
  const account = await accountsStorage.getItem<AccountStorage>(user_id);
  return account;
};

export const setAccountStorageToken = async (user_id: string, token: string) => {
  return accountsStorage.setItem<AccountStorage>(user_id, {
    token
  });
};

