import type { ValidComponent } from "solid-js";
import type { DynamicProps } from "solid-js/web";
import { Dynamic } from "solid-js/web";

const WindowDragger = <T extends ValidComponent>(props: DynamicProps<T>) => (
  // We just inject the `data-tauri-drag-region` attribute
  // to make the window draggable.
  <Dynamic data-tauri-drag-region {...props} />
);

export default WindowDragger;
