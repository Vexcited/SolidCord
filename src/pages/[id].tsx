import type { Component } from "solid-js";
import { A, Outlet } from "@solidjs/router";

const AppMainLayout: Component = () => {

  return (
    <>
      <p>Hello from layout!</p>
      <A href="/">Go to account selection page</A>
      <Outlet />
    </>
  );
};

export default AppMainLayout;

