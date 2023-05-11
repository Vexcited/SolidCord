import { type SetStoreFunction, createStore } from "solid-js/store";
import { createSignal } from "solid-js";
import { useParams } from "@solidjs/router";

import type { OpDispatchReady } from "@/websockets/gateway/types";

export interface CacheStoreDefault {
  token: null;
  ready: false;
}

export interface CacheStoreInitializing {
  token: string;
  ready: false;
}

export interface CacheStoreReady {
  token: string;
  ready: true;

  gateway: {
    user: OpDispatchReady["d"]["user"];
    users: OpDispatchReady["d"]["users"];
    guilds: OpDispatchReady["d"]["guilds"];
    relationships: OpDispatchReady["d"]["relationships"];
    private_channels: OpDispatchReady["d"]["private_channels"];
  };

  requests: Record<string, unknown>;
}

type CacheStore = CacheStoreDefault | CacheStoreInitializing | CacheStoreReady;

const [accounts_caches, setAccountsCaches] = createSignal<Record<string, [get: CacheStore, set: SetStoreFunction<CacheStore>]>>({});

const createAccountCache = (account_id: string) => {
  const store_default: CacheStoreDefault = { token: null, ready: false };

  const new_accounts = { ...accounts_caches() };
  new_accounts[account_id] = createStore<CacheStore>(store_default);

  setAccountsCaches({ ...new_accounts });
};

const useCurrent = <T extends CacheStore>() => {
  const params = useParams();
  const account_id = () => params.id as string;

  if (!(account_id() in accounts_caches())) {
    createAccountCache(account_id());
  }

  return accounts_caches()[account_id()] as [get: T, set: SetStoreFunction<CacheStore>];
};

/** Get the setter of the cache of an account. */
const useSetterOf = (account_id: string) => {
  if (!(account_id in accounts_caches())) {
    createAccountCache(account_id);
  }

  return accounts_caches()[account_id][1];
};

export default { useCurrent, useSetterOf };
