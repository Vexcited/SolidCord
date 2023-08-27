import { createSignal } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { appWindow } from "@tauri-apps/api/window";

const LOCALSTORAGE_CURRENT_ACCOUNT_ID_KEY = "lastVisitedAccountID";

const [isAppFocused, setAppFocused] = createSignal(true);
const [currentAccountID, rawSetCurrentAccountID] = createSignal<string | null>(localStorage.getItem(LOCALSTORAGE_CURRENT_ACCOUNT_ID_KEY));

appWindow.onFocusChanged(({ payload: focused }) => {
  setAppFocused(focused);
});

const setCurrentAccountID = (id: string): void => {
  const navigate = useNavigate();
  const params = useParams();

  if (params.id !== id) {
    console.info("[app :: setCurrentAccountID]: ID isn't the same as `params.id`, we early return to navigate there.");
    navigate(`/${id}`);
    return;
  }

  localStorage.setItem(LOCALSTORAGE_CURRENT_ACCOUNT_ID_KEY, id);
  rawSetCurrentAccountID(id);
};

export default {
  isFocused: isAppFocused,
  currentAccountID, setCurrentAccountID
};
