import { type SetStoreFunction, createStore } from "solid-js/store";
import { createSignal } from "solid-js";
import { useParams } from "@solidjs/router";

import type { OpDispatchReady } from "@/websockets/gateway/types";
import type { CacheUser } from "@/types/cache";
import type { User } from "@/types/discord/user";
import type { Channel } from "@/types/discord/channel";
import type { Message } from "@/types/discord/message";

/**
 * When we just created the store, connection
 * to gateway is not created yet.
 */
export interface CacheStoreDefault {
  token: null;
  ready: false;
}

/**
 * When connecting to gateway.
 */
export interface CacheStoreInitializing {
  token: string;
  ready: false;
}

/**
 * Connection to gateway has been done, and
 * data is ready to be used.
 */
export interface CacheStoreReady {
  token: string;
  ready: true;

  channels: Array<Channel & { messages: Record<string, Message> }>;

  gateway: {
    user: CacheUser;
    users: User[];
    guilds: OpDispatchReady["d"]["guilds"];
    relationships: OpDispatchReady["d"]["relationships"];
    private_channels: OpDispatchReady["d"]["private_channels"];
  };

  requests: Record<string, unknown>;
}

type CacheStore = CacheStoreDefault | CacheStoreInitializing | CacheStoreReady;

// We assign a store for each account ID.
// By doing that, we have a cache for each account currently connected to gateway.
const [accounts_caches, setAccountsCaches] = createSignal<Record<string, [get: CacheStore, set: SetStoreFunction<CacheStore>]>>({});
/** Creates a new cache store (`CacheStoreDefault`) for a given account ID. */
const createAccountCache = (account_id: string) => {
  const store_default: CacheStoreDefault = { token: null, ready: false };

  const new_accounts = { ...accounts_caches() };
  new_accounts[account_id] = createStore<CacheStore>(store_default);

  setAccountsCaches(new_accounts);
};

/**
 * Returns the store for the current account
 * or the given account ID in parameter.
 *
 * Should only be used in components.
 */
const use = <T extends CacheStore>(from_id?: string) => {
  const params = useParams();
  const account_id = () => from_id ?? params.id as string;

  if (!(account_id() in accounts_caches())) {
    createAccountCache(account_id());
  }

  return accounts_caches()[account_id()] as unknown as [get: T, set: SetStoreFunction<T>];
};

/** Returns the setter of the store of a given account ID. */
const setterOf = <T extends CacheStore>(account_id: string) => {
  if (!(account_id in accounts_caches())) {
    createAccountCache(account_id);
  }

  return accounts_caches()[account_id][1] as SetStoreFunction<T>;
};

export default { use, setterOf };
