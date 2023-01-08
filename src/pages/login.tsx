import type { JSX, Component } from "solid-js";

import { createStore } from "solid-js/store";
import { Show } from "solid-js";

import HCaptcha from "solid-hcaptcha";
import { A } from "@solidjs/router";

import { callLoginAPI, callMfaTotpAPI } from "@/api/auth";

const LoginPage: Component = () => {
  const [state, setState] = createStore<{
    username: string
    password: string

    hcaptcha_sitekey: null | string
    hcaptcha_token: null | string

    mfa_ticket: null | string
    mfa_code: string
  }>({
    username: "",
    password: "",

    hcaptcha_sitekey: null,
    hcaptcha_token: null,

    mfa_ticket: null,
    mfa_code: ""
  });

  const sendLoginRequest = async () => {
    const response = await callLoginAPI({
      login: state.username,
      password: state.password,

      hcaptcha_token: state.hcaptcha_token
    });

    if (response.need_captcha) {
      setState("hcaptcha_sitekey", response.sitekey);
      return;
    }

    if (response.need_mfa) {
      setState("mfa_ticket", response.ticket);
      return;
    }

    console.log("DONE", response.token);
  };



  const sendMfaRequest = async () => {
    if (!state.mfa_ticket) return;

    const response = await callMfaTotpAPI({
      code: state.mfa_code,
      ticket: state.mfa_ticket
    });

    if (!response.success) {
      console.error("blblbl", response.debug);
      return;
    }

    console.info("DONE", response.token);
  };

  const loginHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault();
    sendLoginRequest();
  };

  const mfaHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault();
    sendMfaRequest();
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

      <Show when={state.hcaptcha_sitekey}>
        <HCaptcha sitekey={state.hcaptcha_sitekey as string}
          /**
           * Workaround to bypass the `localhost` check.
           * Took from <https://github.com/hCaptcha/react-native-hcaptcha/blob/1569dc22501cfa63754d49683f6c278cee2bab80/Hcaptcha.js#L25>.
           */
          config={{ host: `${state.hcaptcha_sitekey}.react-native.hcaptcha.com` }}

          onVerify={(token) => {
            setState("hcaptcha_token", token);
            sendLoginRequest();
          }}
        />
      </Show>

      <Show when={state.mfa_ticket}>
        <form onSubmit={mfaHandler}>
          <input value={state.mfa_code}
            onChange={({ currentTarget }) => setState("mfa_code", currentTarget.value)}
          />

          <button type="submit">
            Submit code
          </button>
        </form>
      </Show>
    </>
  );
};

export default LoginPage;

