export const DISCORD_API_ENDPOINT = "https://discord.com/api/";
export const createApiEndpointURL = (version: number, path: string) => new URL(
  `v${version}${path}`,
  DISCORD_API_ENDPOINT
);

import app from "@/stores/app";
import accounts from "@/stores/accounts";

export const getCurrentAccountID = () => {
  const account_id = app.currentAccountID();
  if (!account_id) throw new Error("not in account.");

  return account_id;
};

export const getCurrentAccount = () => {
  const account_id = getCurrentAccountID();
  const account = accounts.get(account_id);
  if (!account) throw new Error("account doesn't exist.");

  return account;
};

export const getCurrentAccountToken = () => {
  const account = getCurrentAccount();
  return account.token;
};
