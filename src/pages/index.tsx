import type { Component } from "solid-js";
import { A } from "@solidjs/router";

import { For, Show, createResource } from "solid-js";
import { listAccounts } from "@/utils/storage/accounts";

const AccountSelectionPage: Component = () => {
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
          <A href={`/${account.informations.id}/`}>
            <div class="flex flex-col border-2">
              <p class="text-lg font-medium">{account.informations.username}#{account.informations.discriminator}</p>
              <span class="text-sm">{account.informations.id}</span>
            </div>
          </A>
        )}
      </For>
    </>
  );
};

export default AccountSelectionPage;

