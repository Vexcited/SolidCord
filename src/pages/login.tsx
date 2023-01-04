import type { JSX, Component } from "solid-js";
import { A } from "@solidjs/router";

import { createStore } from "solid-js/store";
import { request } from "@/utils/native";

const LoginPage: Component = () => {
  const [state, setState] = createStore({
    username: "",
    password: ""
  });

  const loginHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (event) => {
    event.preventDefault();

    const response = await request("https://discord.com/api/v9/auth/login", {
      method: "POST",
      body: JSON.stringify({
        login: state.username,
        password: state.password,

        undelete: false,
        captcha_key: null,
        login_source: null,
        gift_code_sku_id: null
      }),
      headers: {
        "content-type": "application/json"
      }
    });

    console.log(state, response);
  };

  return (
    <>
      <A href="/">Go back to home page</A>

      <form onSubmit={loginHandler}>
        <input type="text" value={state.username}
          onChange={({ currentTarget }) => setState("username", currentTarget.value)}
        />

        <input type="password" value={state.password}
          onChange={({ currentTarget }) => setState("password", currentTarget.value)}
        />

        <button type="submit">
          Login to Discord!
        </button>
      </form>
    </>
  );
};

export default LoginPage;

