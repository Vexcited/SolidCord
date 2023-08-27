import { createSignal } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";

import DiscordClientWS from "@/websockets/gateway";

export interface AccountStored {
  id: string;
  username: string;
  /** 4 numbers, containing an `#` at the start. */
  discriminator: string;

  /** Can be used to generate the avatar URL, if exists. */
  avatar_hash: string | null;
  /** Token that is used to connect to the account. */
  token: string;
}

export interface Account extends AccountStored {
  /** `null` when account isn't connected to gateway. */
  connection: DiscordClientWS | null;
}

// Accounts on first load.
const accountsStored: AccountStored[] = JSON.parse(localStorage.getItem("accounts") ?? "[]");
// We instantiate the gateway for those accounts, and global store them.
const [accountsStore, setAccountsStore] = createSignal<Account[]>(accountsStored.map(
  account => ({ ...account, connection: new DiscordClientWS(account.token, account.id) })
));

/**
 * Get a specific account in the storage using an user ID.
 * Returns `undefined` when no account using this user ID is found.
 * @param id - User ID that should be found across the accounts.
 */
const get = (id: string): Account | undefined => {
  const account = accountsStore().find(
    user => user.id === id
  );

  return account;
};

/**
 * Returns a getter for the specified `from_id` account.
 * If no ID is specified, we use the ID of the current account.
 * Redirects to account selector page when the account isn't found.
 */
const use = (from_id?: string) => {
  const params = useParams();
  const navigate = useNavigate();
  const account_id = () => from_id ?? params.id as string;

  const account = get(account_id());
  if (!account) {
    navigate("/");
    throw new Error("Account wasn't found in store.");
  }

  return account;
};

/** Update the values in localStorage with the ones from the signal. */
const syncWithLocalStorage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const accounts: AccountStored[] = accountsStore().map(({ connection, ...account }) => account);
  localStorage.setItem("accounts", JSON.stringify(accounts));
};


/**
* Append a new account into the storage.
* @param account_raw - Account to add in the storage.
*/
const add = (account_raw: AccountStored): Account => {
  // We check if we already have this user in the storage.
  const existing_account = get(account_raw.id);
  if (existing_account) return existing_account;

  const connection = new DiscordClientWS(account_raw.token, account_raw.id);
  const account: Account = {
    ...account_raw,
    connection
  };

  setAccountsStore(prev => [...prev, account]);
  syncWithLocalStorage();

  return account;
};

/**
 * Remove an account from the accounts storage.
 * @param account - Account to remove from the storage.
 */
const remove = (id: string): boolean => {
  const account = get(id);
  if (!account) return false;

  // Destroy connection before removing account from SolidCord.
  if (account.connection) account.connection.destroy();

  setAccountsStore(prev => prev.filter(account => account.id !== id));
  syncWithLocalStorage();

  return true;
};

export default {
  values: accountsStore,
  add,
  get,
  remove,
  use
};
