/* @refresh reload */
import "@/styles/globals.css";
import "@fontsource/rubik/400.css";
import "@fontsource/rubik/500.css";
import "@fontsource/rubik/600.css";
import "@fontsource/rubik/700.css";

import { render } from "solid-js/web";

import { Router, useRoutes } from "@solidjs/router";
import routes from "~solid-pages";

const mount = document.getElementById("root") as HTMLDivElement;
render(() => {
  const Routes = useRoutes(routes);

  return (
    <Router>
      <Routes />
    </Router>
  );
}, mount);
