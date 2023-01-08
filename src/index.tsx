/* @refresh reload */
import "virtual:windi.css";

import { render } from "solid-js/web";

import { Router, Routes, Route } from "@solidjs/router";
import { Suspense, lazy } from "solid-js";

const HomePage = lazy(() => import("@/pages/index"));
const LoginPage = lazy(() => import("@/pages/login"));
render(() => (
  <Router>
    <Suspense fallback={<p>Loading route...</p>}>
      <Routes>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
      </Routes>
    </Suspense>
  </Router>
), document.getElementById("root") as HTMLDivElement);

Neutralino.init();
