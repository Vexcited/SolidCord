import { createStore } from "solid-js/store";

type UserStore =
  | {
    token: string;
    informations: Record<string, string>;
  }
  | { token: null }

export const [user_store, setUserStore] = createStore<UserStore>({
  token: null
});
