import type { Component } from "solid-js";
import { Switch, Match, createSignal } from "solid-js";

import AuthAccountSelector from "@/components/auth/account-selector";
import AuthLogin from "@/components/auth/login";

import accounts from "@/stores/accounts";

const LoginPage: Component = () => {
  const userHasNoAccount = () => accounts.values().length <= 0;

  const [component, setComponent] = createSignal<
    | "ACCOUNT_SELECTOR"
    | "SIGNIN"
    | "SIGNUP"
  >(
    // We automatically show the sign-in component if
    // the user don't have any account stored.
    userHasNoAccount() ? "SIGNIN" : "ACCOUNT_SELECTOR"
  );

  return (
    <div class="h-full flex items-center justify-center bg-[#5865F2]">
      <Switch>
        <Match when={component() === "ACCOUNT_SELECTOR"}>
          <AuthAccountSelector onAddAccountClick={() => setComponent("SIGNIN")} />
        </Match>
        <Match when={component() === "SIGNIN"}>
          <AuthLogin
            showBackArrow={!userHasNoAccount()}
            onBackArrowClick={() => setComponent("ACCOUNT_SELECTOR")}
          />
        </Match>
      </Switch>
    </div>
  );
};

export default LoginPage;

