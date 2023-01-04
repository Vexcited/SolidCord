import type { Component } from "solid-js";
import { A } from "@solidjs/router";

const HomePage: Component = () => {
  return (
    <>
      <p>Welcome to SolidCord!</p>
      <A href="/login">Link a Discord account</A>
    </>
  );
};

export default HomePage;
