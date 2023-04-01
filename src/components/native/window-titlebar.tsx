import type { Component } from "solid-js";

import WindowDragger from "@/components/native/window-dragger";
import { appWindow } from "@tauri-apps/api/window";

import { VsChromeMinimize, VsChromeMaximize, VsChromeClose } from "solid-icons/vs";

const WindowTitlebar: Component = () => (
  <div class="bg-[#1e1f22] z-[999]">
    <WindowDragger component="div" class="flex-shrink-0 mt-1 h-[18px] select-none flex justify-between items-center">
      <p class="text-[#b6bcc9] text-xs pl-2 select-none pointer-events-none -mt-1">SolidCord</p>
      <div class="flex">
        <div
          role="button"
          aria-label="Minimize"
          class="w-7 flex justify-center items-center text-[#b5bac1] h-full -mt-1"
          onClick={() => appWindow.minimize()}
        >
          <VsChromeMinimize />
        </div>
        <div
          role="button"
          aria-label="Maximize"
          class="w-7 flex justify-center items-center text-[#b5bac1] h-full -mt-1"
          onClick={() => appWindow.toggleMaximize()}
        >
          <VsChromeMaximize />
        </div>
        <div
          role="button"
          aria-label="Close"
          class="w-7 flex justify-center items-center text-[#b5bac1] h-full -mt-1"
          onClick={() => appWindow.close()}
        >
          <VsChromeClose />
        </div>
      </div>
    </WindowDragger>
  </div>
);

export default WindowTitlebar;
