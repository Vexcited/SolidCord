import type { Component } from "solid-js";
import { onMount, onCleanup, Show, For } from "solid-js";
import { A, Outlet, useParams, useNavigate } from "@solidjs/router";

import type { UserStoreReady } from "@/stores/user";
import { setUserStore, userStore } from "@/stores/user";
import accounts from "@/stores/accounts";

import DiscordClientWS from "@/websockets/gateway";
import { getGuildIconURL } from "@/utils/api/images";

const AppMainLayout: Component = () => {
  const navigate = useNavigate();
  const params = useParams();

  let client: DiscordClientWS | undefined;

  onMount(async () => {
    const account = accounts.get(params.id);
    if (!account) {
      navigate("/?account_not_found=true");
      return;
    }

    setUserStore({
      token: account.token,
      ready: false
    });

    client = new DiscordClientWS(account.token);
  });

  onCleanup(() => {
    if (client) client.destroy();
    setUserStore({ token: null });
  });

  return (
    <Show when={userStore.token && userStore.ready}>
      <Layout store={userStore as UserStoreReady} />
    </Show>
  );
};

export default AppMainLayout;

const Layout: Component<{ store: UserStoreReady }> = (props) => {
  return (
    <div class="flex h-full bg-[#1e1f22]">
      {/* Guild list. */}
      <div class="flex flex-col flex-shrink-0 items-center pt-1 gap-2 w-[72px] overflow-y-auto">
        <For each={props.store.guilds}>
          {guild => (
            <Show when={guild.properties.icon}>
              {icon_hash => (
                <img
                  class="rounded-full h-12 w-12"
                  src={getGuildIconURL(guild.properties.id, icon_hash())}
                />
              )}
            </Show>
          )}
        </For>
      </div>
      <div class="w-full">
        <Outlet />
      </div>
    </div>
  );
};
