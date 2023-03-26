import type { Component } from "solid-js";
import { onMount, onCleanup } from "solid-js";
import { A, Outlet, useParams, useNavigate } from "@solidjs/router";

import { setUserStore } from "@/stores/user";
import { getAccountStorage } from "@/utils/storage/accounts";
import { useUsersMeAPI } from "@/api/users";

import DiscordClientWS from "@/websockets/gateway";

const AppMainLayout: Component = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [user] = useUsersMeAPI();

  onMount(async () => {
    const account = await getAccountStorage(params.id);
    if (!account) {
      navigate("/?account_not_found=true");
      return;
    }

    setUserStore({
      token: account.token,
      id: params.id
    });

    const client = new DiscordClientWS(account.token);
  });

  onCleanup(() => {
    setUserStore({
      token: null,
      id: null
    });
  });

  return (
    <>
      <p>Welcome back, {user()?.username}#{user()?.discriminator}!</p>
      <A href="/">Go to account selection page</A>
      <Outlet />
    </>
  );
};

export default AppMainLayout;

