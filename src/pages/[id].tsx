import type { Component } from "solid-js";
import { onMount, onCleanup, Show } from "solid-js";
import { A, Outlet, useParams, useNavigate } from "@solidjs/router";

import type { UserStoreReady } from "@/stores/user";
import { setUserStore, userStore } from "@/stores/user";
import accounts from "@/stores/accounts";

import DiscordClientWS from "@/websockets/gateway";

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
    <div class="flex flex-col">
      <div class="flex-shrink-0 w-[72px]" />
      <p>Welcome back, {props.store.user.username}#{props.store.user.discriminator}!</p>
      <p>You're in {props.store.guilds.length} guilds!</p>
      <p>You have {props.store.relationships.length} friends!</p>
      <p>You have {props.store.private_channels.length} DMs!</p>
      <A href="/">Go to account selection page</A>
      <Outlet />
    </div>
  );
};
