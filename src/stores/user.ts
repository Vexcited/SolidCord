import { createStore } from "solid-js/store";

export interface UserStore {
  token: string | null,
  id: string | null
}

export const [userStore, setUserStore] = createStore<UserStore>({
  token: null,
  id: null
});
