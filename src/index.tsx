/* @refresh reload */
import "virtual:windi.css";

import { render } from "solid-js/web";

import { Router, Routes, Route } from "@solidjs/router";
import { Suspense, lazy, Show } from "solid-js";

const AccountSelectionPage = lazy(() => import("@/pages/index"));
const LoginPage = lazy(() => import("@/pages/login"));

const AppMainLayout = lazy(() => import("@/pages/[id].js"));
const AppHomePage = lazy(() => import("@/pages/[id]/index"));

import { installCurlWindows, checkCurlInstallation } from "@/utils/native/appdata";

render(() => (
  <Router>
    <Suspense fallback={<p>Loading route...</p>}>
      <Show when={NL_OS === "Windows"}>
        <button onClick={installCurlWindows}>Install cURL for Windows</button>
        <button onClick={async () => {
          const result = await checkCurlInstallation();
          console.log("installation of cURL result:", result);
        }
      }>Check cURL installation (look console)</button>
      </Show>

      <Routes>
        <Route path="/" component={AccountSelectionPage} />
        <Route path="/login" component={LoginPage} />

        <Route path="/:id" component={AppMainLayout}>
          <Route path="/" component={AppHomePage} />
        </Route>
      </Routes>
    </Suspense>
  </Router>
), document.getElementById("root") as HTMLDivElement);

Neutralino.init();
