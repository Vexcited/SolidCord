import type { DiscordMeResponse } from "@/api/users";
import type { Component } from "solid-js";
import { A } from "@solidjs/router";

import { For, Show, createResource } from "solid-js";

import { accounts_storage } from "@/utils/storage/accounts";
import { getCache, StoredCacheEndpoint } from "@/utils/storage/caching";

const fetcher = async () => {
  const keys = await accounts_storage.keys();
  const accounts: DiscordMeResponse[] = [];

  for (const user_id of keys) {
    const informations = await getCache<DiscordMeResponse>(user_id, StoredCacheEndpoint.USERS_ME);
    if (!informations) continue;

    accounts.push(informations);
  }

  return accounts;
};

const AccountSelectionPage: Component = () => {
  const [accounts] = createResource(fetcher);

  return (
    <>
      <p>Welcome to SolidCord!</p>
      <A href="/login">Link a Discord account</A>

      <Show when={accounts.loading}>
        <p>Loading the accounts...</p>
      </Show>

      <For each={accounts()}>
        {account => (
          <A href={`/${account.id}/`}>
            <div class="flex flex-col border-2">
              <p class="text-lg font-medium">{account.username}#{account.discriminator}</p>
              <span class="text-sm">{account.id}</span>
            </div>
          </A>
        )}
      </For>
    </>
  );
};

export default AccountSelectionPage;
