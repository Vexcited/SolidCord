import type { JSX, Component } from "solid-js";

import { useNavigate } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { Show } from "solid-js";

import HCaptcha from "solid-hcaptcha";
import { A } from "@solidjs/router";

import { callAuthLoginAPI, callAuthMfaTotpAPI } from "@/api/auth";
import { callUsersMeAPI } from "@/api/users";

import { setAccount } from "@/utils/storage/accounts";
import { createCacheStorage } from "@/utils/storage/caching";

const LoginPage: Component = () => {
  const navigate = useNavigate();

  const [state, setState] = createStore<{
    uid: string
    password: string
    errors: null | any[] // TODO: Please, type this.

    hcaptcha_sitekey: null | string
    hcaptcha_token: null | string

    mfa_ticket: null | string
    mfa_code: string
  }>({
    uid: "",
    password: "",
    errors: null,

    hcaptcha_sitekey: null,
    hcaptcha_token: null,

    mfa_ticket: null,
    mfa_code: ""
  });

  const sendLoginRequest = async () => {
    if (!state.uid || !state.password) return;

    const response = await callAuthLoginAPI({
      login: state.uid,
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

    if (response.need_email_verification) {
      setState("errors", []); // TODO: Handle this step.
      return;
    }

    await processUserToken(response.token);
  };

  const sendMfaRequest = async () => {
    if (!state.mfa_ticket) return;

    const response = await callAuthMfaTotpAPI({
      code: state.mfa_code,
      ticket: state.mfa_ticket
    });

    if (!response.success) {
      // TODO: Handle the errors.
      console.error(response.debug);
      return;
    }

    await processUserToken(response.token);
  };

  const processUserToken = async (token: string) => {
    const response = await callUsersMeAPI({ token });

    await setAccount(response.id, token);
    await createCacheStorage(response);

    navigate("/");
    return;
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
        <input type="text" value={state.uid}
          placeholder="E-Mail or Phone Number"
          onChange={({ currentTarget }) => setState("uid", currentTarget.value)}
        />

        <input type="password" value={state.password}
          placeholder="Password"
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
            placeholder="6 digits code"
            onChange={({ currentTarget }) => setState("mfa_code", currentTarget.value)}
          />

          <button type="submit">
            Submit MFA code
          </button>
        </form>
      </Show>
    </>
  );
};

export default LoginPage;

