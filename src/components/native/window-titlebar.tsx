import type { Component, JSX } from "solid-js";

import WindowDragger from "@/components/native/window-dragger";
import { appWindow } from "@tauri-apps/api/window";

import { VsChromeMinimize, VsChromeMaximize, VsChromeClose } from "solid-icons/vs";

const WindowTitlebar: Component = () => {
  const TitlebarButton: Component<{
    icon: JSX.Element;
    label: string;
    class: string;
    action: () => unknown;
  }> = (props) => (
    <div
      role="button"
      aria-label={props.label}
      class={`w-7 h-[22px] flex justify-center items-center text-[#b5bac1] -mt-1 ${props.class}`}
      onClick={() => props.action()}
    >
      {props.icon}
    </div>
  );

  const minimizeAndMaximizeClasses = "hover:bg-[#4e5058] hover:bg-opacity-[0.3] active:text-white active:bg-opacity-[0.48]";
  const closeClasses = "hover:bg-[#f23f42] hover:text-white";

  return (
    <div class="bg-[#1e1f22] z-[999]">
      <WindowDragger component="div" class="flex-shrink-0 flex justify-between items-center mt-1 h-[18px] select-none">
        <p class="select-none text-[#b6bcc9] text-xs pl-2 pointer-events-none -mt-1">
          SolidCord
        </p>

        <div class="flex items-center h-full">
          <TitlebarButton
            label="Minimize"
            class={minimizeAndMaximizeClasses}
            action={() => appWindow.minimize()}
            icon={<VsChromeMinimize />}
          />
          <TitlebarButton
            label="Maximize"
            class={minimizeAndMaximizeClasses}
            action={() => appWindow.toggleMaximize()}
            icon={<VsChromeMaximize />}
          />
          <TitlebarButton
            label="Close"
            class={closeClasses}
            action={() => appWindow.close()}
            icon={<VsChromeClose />}
          />
        </div>
      </WindowDragger>
    </div>
  );
};

export default WindowTitlebar;
