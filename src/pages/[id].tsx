import type { Component } from "solid-js";
import { onMount, onCleanup, Show, For } from "solid-js";
import { Outlet, useParams, useNavigate, A } from "@solidjs/router";

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
    <div class="h-full flex bg-[#1e1f22]">
      {/* Guild list. */}
      <div class="w-[72px] flex flex-(shrink-0 col) items-center gap-2 overflow-y-auto pt-1">
        <A href={`/${props.store.user.id}/@me`}>
          USER
        </A>
        <For each={props.store.guilds}>
          {guild => (
            <A href={`/${props.store.user.id}/${guild.id}`}>
              <Show when={guild.properties.icon}>
                {icon_hash => (
                  <img
                    class="h-12 w-12 rounded-full"
                    src={getGuildIconURL(guild.properties.id, icon_hash())}
                  />
                )}
              </Show>
            </A>
          )}
        </For>
      </div>
      <div class="w-full">
        <Outlet />
      </div>
    </div>
  );
};
