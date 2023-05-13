import { createSignal } from "solid-js";
import AccountsStorage, { type Account } from "@/utils/storage/accounts";

import { useParams, useNavigate } from "@solidjs/router";

const [accountsStore, setAccountsStore] = createSignal<Account[]>([]);
const accountsManager = new AccountsStorage(setAccountsStore);

/**
 * Returns the getter for the current account.
 * Redirects to account selector page when no account is available.
 */
const useCurrent = () => {
  const params = useParams();
  const navigate = useNavigate();
  const account_id = () => params.id as string;

  return [() => {
    const account = accountsManager.get(account_id());
    if (!account) {
      navigate("/");
      throw new Error("account not available.");
    }

    return account;
  }] as const;
};

export default {
  values: accountsStore,
  add: accountsManager.add,
  get: accountsManager.get,
  remove: accountsManager.remove,
  useCurrent
};
