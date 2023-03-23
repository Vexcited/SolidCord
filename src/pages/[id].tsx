import type { Component } from "solid-js";
import { onMount, onCleanup } from "solid-js";
import { A, Outlet, useParams, useNavigate } from "@solidjs/router";

import { setUser } from "@/stores/app";
import { getAccount } from "@/utils/storage/accounts";
import { useUsersMeAPI } from "@/api/users";

import DiscordClientWS from "@/websockets/client";

const AppMainLayout: Component = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [user] = useUsersMeAPI();

  onMount(async () => {
    const account = await getAccount(params.id);
    if (!account) {
      navigate("/?account_not_found=true");
      return;
    }

    setUser({
      token: account.token,
      id: params.id
    });

    const client = new DiscordClientWS(account.token);
  });

  onCleanup(() => {
    setUser({
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

