import type { Component } from "solid-js";

import WindowDragger from "@/components/native/window-dragger";
import { appWindow } from "@tauri-apps/api/window";

import { VsChromeMinimize, VsChromeMaximize, VsChromeClose } from "solid-icons/vs";

const WindowTitlebar: Component = () => (
  <WindowDragger component="div" class="flex-shrink-0 h-6 z-[999] select-none bg-[#1e1f22] flex justify-between items-center">
    <p class="text-[#b6bcc9] text-xs pl-2 select-none pointer-events-none">SolidCord</p>
    <div class="flex">
      <div
        role="button"
        aria-label="Minimize"
        class="w-7 flex justify-center items-center text-[#b5bac1] h-full"
        onClick={() => appWindow.minimize()}
      >
        <VsChromeMinimize />
      </div>
      <div
        role="button"
        aria-label="Maximize"
        class="w-7 flex justify-center items-center text-[#b5bac1] h-full"
        onClick={() => appWindow.toggleMaximize()}
      >
        <VsChromeMaximize />
      </div>
      <div
        role="button"
        aria-label="Close"
        class="w-7 flex justify-center items-center text-[#b5bac1] h-full"
        onClick={() => appWindow.close()}
      >
        <VsChromeClose />
      </div>
    </div>
  </WindowDragger>
);

export default WindowTitlebar;
