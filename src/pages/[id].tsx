import type { Component } from "solid-js";
import { onMount, onCleanup, Show, For } from "solid-js";
import { Outlet, useParams, useNavigate, A } from "@solidjs/router";

import type { UserStoreReady } from "@/stores/user";
import { setUserStore, userStore } from "@/stores/user";
import accounts from "@/stores/accounts";

import DiscordClientWS from "@/websockets/gateway";
import { getGuildIconURL, getUserAvatarURL } from "@/utils/api/images";

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
  const params = useParams();

  return (
    <div class="h-full flex bg-[#1e1f22]">
      {/* Guild list. */}
      <div class="w-[72px] flex flex-(shrink-0 col) items-center gap-2 overflow-y-auto pt-1">
        <Show when={props.store.user.avatar} fallback={
          <A class="h-12 w-12 flex items-center justify-center bg-white font-medium text-black" href={`/${props.store.user.id}/@me`}
            classList={{ "rounded-lg": params.guild_id === "@me", "rounded-full": params.guild_id !== "@me" }}
          >
            {props.store.user.username[0].toUpperCase()}
          </A>
        }>
          {avatar_hash => (
            <A href={`/${props.store.user.id}/@me`}>
              <img
                class="h-12 w-12"
                classList={{ "rounded-lg": params.guild_id === "@me", "rounded-full": params.guild_id !== "@me" }}
                src={getUserAvatarURL(props.store.user.id, avatar_hash())}
              />

            </A>
          )}
        </Show>

        <hr class="w-[32px] border-2 border-gray rounded-lg" />

        <For each={props.store.guilds}>
          {guild => (
            <A href={`/${props.store.user.id}/${guild.id}`}>
              <Show when={guild.properties.icon}>
                {icon_hash => (
                  <img
                    class="h-12 w-12 rounded-full"
                    classList={{ "rounded-lg": params.guild_id === guild.id, "rounded-full": params.guild_id !== guild.id }}
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
