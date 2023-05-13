import type { Setter } from "solid-js";

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
  connection: DiscordClientWS | null;
}

/**
 * Storage for the user's connected accounts.
 * When enabled, accounts are all connected to the gateway on application start.
 */
class AccountsStorage {
  private accounts: Account[];
  private setAccounts: Setter<Account[]>;

  /**
   * @param setAccounts - Pass a store setter to get updates on a signal.
   */
  constructor (setAccounts: Setter<AccountStored[]>) {
    console.info("[utils/storage][accounts]: new instance of manager");

    const accounts: AccountStored[] = JSON.parse(localStorage.getItem("accounts") ?? "[]");
    this.setAccounts = setAccounts;
    this.accounts = [];

    // We spawn the connection for each account.
    for (const account of accounts) {
      console.info("[utils/storage][accounts]: spawning new connection for account with username", account.username);
      const connection = new DiscordClientWS(account.token, account.id);

      this.accounts.push({
        ...account,
        connection
      });
    }

    this.updateAccountsStorageValue();
  }

  /** Sync value from `this.accounts` with localStorage value. */
  private updateAccountsStorageValue = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const accounts: AccountStored[] = this.accounts.map(({ connection, ...account }) => account);
    localStorage.setItem("accounts", JSON.stringify(accounts));
    this.setAccounts(this.accounts);
  };

  /**
   * Get a specific account in the storage using an user ID.
   * Returns `undefined` when no account using this user ID is found.
   * @param id - User ID that should be found across the accounts.
   */
  public get = (id: string): Account | undefined => {
    const account = this.accounts.find(
      user => user.id === id
    );

    return account;
  };

  /**
   * Append a new account into the storage.
   * @param account_raw - Account to add in the storage.
   */
  public add = (account_raw: AccountStored): Account => {
    // We check if we already have this user in the storage.
    const existing_account = this.get(account_raw.id);
    if (existing_account) return existing_account;

    const connection = new DiscordClientWS(account_raw.token, account_raw.id);
    const account: Account = {
      ...account_raw,
      connection
    };

    this.accounts.push(account);
    this.updateAccountsStorageValue();

    return account;
  };

  /**
   * Remove an account from the accounts storage.
   * @param account - Account to remove from the storage.
   */
  public remove = (id: string): void => {
    const account = this.get(id);
    if (!account) return;

    // Destroy connection before removing account from SolidCord.
    if (account.connection) account.connection.destroy();

    this.accounts = this.accounts.filter(
      account => account.id !== id
    );

    this.updateAccountsStorageValue();
  };
}

export default AccountsStorage;
