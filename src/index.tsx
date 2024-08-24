/* @refresh reload */
import "@unocss/reset/tailwind.css";
import "./assets/css/satoshi.css";
import "virtual:uno.css";

import { render } from "solid-js/web";
import Routes from "./router";

render(() => <Routes />, document.getElementById("root") as HTMLElement);
