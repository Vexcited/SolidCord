import { createSignal } from "solid-js";

import type { AccountStorage } from "@/utils/storage/accounts";
import AccountsStorage from "@/utils/storage/accounts";

const [accountsStore, setAccountsStore] = createSignal<AccountStorage[]>([]);
const accountsManager = new AccountsStorage(setAccountsStore);

export default {
  values: accountsStore,
  add: accountsManager.add,
  get: accountsManager.get,
  remove: accountsManager.remove
};
