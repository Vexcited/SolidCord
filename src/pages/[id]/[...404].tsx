import type { Component } from "solid-js";

import { type UserStoreReady, userStore } from "@/stores/user";
import { Navigate } from "@solidjs/router";

const Page: Component = () => {
  const store = () => userStore as UserStoreReady;

  return (
    <Navigate href={`/${store().user.id}/@me`} />
  );
};

export default Page;

