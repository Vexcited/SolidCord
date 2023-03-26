import { createSignal } from "solid-js";

export interface AccountStore {
  id: string,
  username: string,
  discriminator: string
}

const [
  accountsStore,
  _setAccountsStore
] = createSignal<AccountStore[]>(
  // Get default value from localStorage.
  JSON.parse(localStorage.getItem("accounts") || "[]")
);

const setAccountsStore = (new_store: AccountStore[]) => {
  localStorage.setItem("accounts", JSON.stringify(new_store));
  _setAccountsStore(new_store);
};

export {
  accountsStore, setAccountsStore
};
