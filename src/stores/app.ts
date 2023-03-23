import { createStore } from "solid-js/store";

export const [user, setUser] = createStore<{
  token: string | null,
  id: string | null
}>({
  token: null,
  id: null
});
