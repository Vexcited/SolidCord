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

  const minimizeAndMaximizeClasses = "hover:(bg-[#4e5058] bg-opacity-[0.3]) active:(text-white bg-opacity-[0.48])";
  const closeClasses = "hover:(bg-[#f23f42] text-white)";

  return (
    <div class="z-[999] bg-[#1e1f22]">
      <WindowDragger component="div" class="mt-1 h-[18px] flex flex-shrink-0 select-none items-center justify-between">
        <p class="pointer-events-none select-none pl-2 text-(xs [#b6bcc9]) -mt-1">
          SolidCord
        </p>

        <div class="h-full flex items-center">
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
            action={() => appWindow.hide()}
            icon={<VsChromeClose />}
          />
        </div>
      </WindowDragger>
    </div>
  );
};

export default WindowTitlebar;
