import { createRoot, createSignal } from "solid-js";
import { appWindow } from "@tauri-apps/api/window";

export default createRoot(() => {
  const [isAppFocused, setAppFocused] = createSignal(true);

  appWindow.onFocusChanged(({ payload: focused }) => {
    setAppFocused(focused);
  });

  return { isFocused: isAppFocused };
});
