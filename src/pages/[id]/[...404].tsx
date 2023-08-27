import type { Component } from "solid-js";

import accounts from "@/stores/accounts";
import { Navigate } from "@solidjs/router";

const Page: Component = () => {
  const account = accounts.use();
  return <Navigate href={`/${account.id}/@me`} />;
};

export default Page;

