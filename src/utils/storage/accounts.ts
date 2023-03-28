import type { Setter } from "solid-js";

export interface AccountStorage {
  id: string,
  username: string,
  /** 4 numbers, containing an `#` at the start. */
  discriminator: string,

  /** Can be used to generate the avatar URL, if exists. */
  avatar_hash: string | null,
  /** Token that is used to connect to the account. */
  token: string
}

/**
 * Storage for the user's connected accounts.
 *
 * Here, we don't use localforage, instead we use
 * [Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
 * With localStorage, the data we get doesn't need any load time
 * on contrary with localforage where we need to `await`.
 *
 * It allows us to directly get user's accounts and
 * do actions on first load without any loader.
 */
class AccountsStorage {
  private accounts: AccountStorage[];
  private setAccounts: Setter<AccountStorage[]>;

  /**
   * @param setAccounts - Pass a store setter to get updates on a signal.
   */
  constructor (setAccounts: Setter<AccountStorage[]>) {
    this.accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    this.setAccounts = setAccounts;

    this.updateAccountsStorageValue();
  }

  /** Sync value from `this.accounts` with localStorage value. */
  private updateAccountsStorageValue (): void {
    localStorage.setItem("accounts", JSON.stringify(this.accounts));
    this.setAccounts(this.accounts);
  }

  /**
   * Get a specific account in the storage using an user ID.
   * Returns `undefined` when no account using this user ID is found.
   * @param id - User ID that should be found across the accounts.
   */
  public get (id: string): AccountStorage | undefined {
    const account = this.accounts.find(
      user => user.id === id
    );

    return account;
  }

  /**
   * Append a new account into the storage.
   * @param account - Account to add in the storage.
   */
  public add (account: AccountStorage): AccountStorage[] {
    // We add the new account into the accounts storage.
    this.accounts.push(account);
    this.updateAccountsStorageValue();

    return this.accounts;
  }

  /**
   * Remove an account from the accounts storage.
   * @param account - Account to remove from the storage.
   */
  public remove (id: string): void {
    this.accounts = this.accounts.filter(
      user => user.id !== id
    );

    this.updateAccountsStorageValue();
  }
}

export default AccountsStorage;
