import type { OpDispatchReady } from "@/websockets/gateway/handlers/dispatch";
import { createStore } from "solid-js/store";

export interface UserStoreDefault {
  token: null;
  ready: false;
}

export interface UserStoreInitializing {
  token: string;
  ready: false;
}

export interface UserStoreReady {
  token: string;
  ready: true;

  user: OpDispatchReady["d"]["user"];
  users: OpDispatchReady["d"]["users"];
  guilds: OpDispatchReady["d"]["guilds"];
  relationships: OpDispatchReady["d"]["relationships"];
  private_channels: OpDispatchReady["d"]["private_channels"];
}

export const [userStore, setUserStore] = createStore<UserStoreDefault | UserStoreInitializing | UserStoreReady>({
  token: null,
  ready: false
});
