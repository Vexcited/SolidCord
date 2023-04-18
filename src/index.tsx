/* @refresh reload */
import "@fontsource/rubik/400.css";
import "@fontsource/rubik/500.css";
import "@fontsource/rubik/600.css";
import "@fontsource/rubik/700.css";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

import { render } from "solid-js/web";

import { Router, useRoutes } from "@solidjs/router";
import routes from "~solid-pages";

import WindowTitlebar from "@/components/native/window-titlebar";

const mount = document.getElementById("root") as HTMLDivElement;
render(() => {
  const Routes = useRoutes(routes);

  return (
    <Router>
      <main class="h-screen flex flex-col">
        <WindowTitlebar />
        <Routes />
      </main>
    </Router>
  );
}, mount);

import fetch from "@/utils/native/fetch";

// Internal API
// TODO: Declare a module exposing the types and publish it as a module to make external plugins easier to do.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.api = {
  native_fetch: fetch
};
