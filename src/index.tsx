/* @refresh reload */
import "@/styles/globals.css";

import { render } from "solid-js/web";

import { Router, useRoutes } from '@solidjs/router'
import routes from "~solid-pages";

const mount = document.getElementById("root") as HTMLDivElement;
render(() => {
  const Routes = useRoutes(routes)
  
  return (
    <Router>
      <Routes />
    </Router>
  );
}, mount);
