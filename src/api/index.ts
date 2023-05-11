export const DISCORD_API_ENDPOINT = "https://discord.com/api/";

import accounts from "@/stores/accounts";

export const getCurrentAccountID = () => {
  const account_id = localStorage.getItem("lastVisitedAccount");
  if (!account_id) throw new Error("not in account.");

  return account_id;
};

export const getCurrentAccountToken = () => {
  const account_id = getCurrentAccountID();

  const account = accounts.get(account_id);
  if (!account) throw new Error("account doesn't exist.");

  return account.token;
};
