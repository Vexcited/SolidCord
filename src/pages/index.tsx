import type { Component } from "solid-js";
import { A } from "@solidjs/router";

import { For, Show, createResource } from "solid-js";
import { listAccounts } from "@/utils/storage/accounts";

const HomePage: Component = () => {
  const [accounts] = createResource(listAccounts);

  return (
    <>
      <p>Welcome to SolidCord!</p>
      <A href="/login">Link a Discord account</A>

      <Show when={accounts.loading}>
        <p>Loading the accounts...</p>
      </Show>

      <For each={accounts()}>
        {account => (
          <p>{account.token}</p>
        )}
      </For>
    </>
  );
};

export default HomePage;
