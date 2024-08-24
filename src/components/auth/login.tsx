import type { JSX, Component } from "solid-js";

import { useNavigate } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { Show } from "solid-js";

import HCaptcha from "solid-hcaptcha";

import { callAuthLoginAPI, callAuthMfaTotpAPI } from "@/api/auth";
import { callUsersMeAPI } from "@/api/users";

import accounts from "@/stores/accounts";

import { IoArrowBack } from "solid-icons/io";

const AuthLogin: Component<{
  showBackArrow?: boolean;
  onBackArrowClick?: () => void;
}> = (props) => {
  const navigate = useNavigate();

  const [state, setState] = createStore<{
    uid: string;
    password: string;

    hcaptcha_sitekey: null | string;
    hcaptcha_token: null | string;

    mfa_ticket: null | string;
    mfa_code: string;

    loading: boolean;
    error: null | string;
  }>({
    uid: "",
    password: "",

    hcaptcha_sitekey: null,
    hcaptcha_token: null,

    mfa_ticket: null,
    mfa_code: "",

    loading: false,
    error: null
  });

  const sendLoginRequest = async (): Promise<void> => {
    if (!state.uid || !state.password) {
      setState({
        loading: false,
        error: "Please, fill in the required fields."
      });

      return;
    }

    // Clear the state.
    setState({
      loading: true,
      error: null
    });

    const response = await callAuthLoginAPI({
      login: state.uid,
      password: state.password,
      hcaptcha_token: state.hcaptcha_token
    });

    if (response.status === "TOKEN") {
      return processUserToken(response.data.token);
    }
    // Only the `processUserToken` function will edit the `state.loading`.
    else setState("loading", false);

    // If we did not get the token, we do a switch case to handle.
    switch (response.status) {
    case "HCAPTCHA":
      setState("hcaptcha_sitekey", response.data.sitekey);
      break;
    case "EMAIL_VERIFICATION":
      setState("error", "New login location, please check your email address and verify the authentication.");
      break;
    case "MFA":
      setState("mfa_ticket", response.data.ticket);
      break;
    case "INVALID_CREDENTIALS":
      setState("error", "Bad credentials on " + [response.data.is_password ? "the password" : "", response.data.is_uid ? "the login" : ""].filter(Boolean).join(" and "));
      break;
    case "UNKNOWN":
      setState("error", `An unknown error was thrown, please checkout this debug output: ${JSON.stringify(response.data.debug)}`);
      break;
    }
  };

  const sendMfaRequest = async () => {
    if (!state.mfa_ticket) return;

    if (!state.mfa_code) {
      setState({
        loading: false,
        error: "Please, fill in your MFA code."
      });

      return;
    }

    setState({
      loading: true,
      error: null
    });

    const response = await callAuthMfaTotpAPI({
      code: state.mfa_code,
      ticket: state.mfa_ticket
    });

    if (!response.success) {
      // TODO: Handle the errors.
      console.error(response.debug);
      return;
    }

    return processUserToken(response.token);
  };

  /**
   * Process the token to get the first user information.
   */
  const processUserToken = async (token: string): Promise<void> => {
    const user = await callUsersMeAPI(token);

    // Make sure to remove any existent instance of this account before.
    accounts.remove(user.id);

    // Add the account into our storage/store.
    accounts.add({
      id: user.id,
      username: user.username,
      avatar_hash: user.avatar,
      discriminator: user.discriminator,
      token
    });

    setState({
      loading: false,
      error: null
    });

    navigate(`/${user.id}`);
  };

  const loginHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault();
    if (state.loading) return;

    return sendLoginRequest();
  };

  const mfaHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault();
    if (state.loading) return;

    return sendMfaRequest();
  };

  const hcaptchaVerifyHandler = (token: string) => {
    setState("hcaptcha_token", token);
    if (state.loading) return;

    return sendLoginRequest();
  };

  return (
    <div class="relative max-w-[480px] w-full flex justify-between gap-8 rounded-md p-8 md:max-w-[784px]">
      <Show when={props.showBackArrow}>
        <button type="button" class="absolute left-8 top-12"
          onClick={() => props.onBackArrowClick && props.onBackArrowClick()}
        >
          <IoArrowBack size={24} color="#DBDEE1" />
        </button>
      </Show>

      <div class="w-full">
        <div class="flex flex-col gap-5">
          <div class="flex flex-col items-center gap-2">
            <h1 class="text-([24px] [#F2F3F5]) font-semibold leading-[30px]">
              Welcome back!
            </h1>
            <p class="text-([16px] [#B5BAC1]) leading-[20px]">
              We're so excited to see you again!
            </p>
          </div>

          <form class="flex flex-col gap-5"
            onSubmit={loginHandler}
          >
            <label>
              <p class="mb-2 text-([12px] [#B5BAC1]) font-bold leading-[16px] tracking-wide uppercase">
                Email or Phone Number
                <span class="pl-1 text-[#F23F42]">*</span>
              </p>
              <input type="text" value={state.uid}
                class="w-full rounded-[3px] bg-[#1E1F22] p-[10px] text-[#DBDEE1] outline-none"
                placeholder="your.name@example.com"
                onChange={({ currentTarget }) => setState("uid", currentTarget.value)}
              />
            </label>

            <label>
              <p class="mb-2 text-([12px] [#B5BAC1]) font-bold leading-[16px] tracking-wide uppercase">
                Password
                <span class="pl-1 text-[#F23F42]">*</span>
              </p>
              <input type="password" value={state.password}
                class="w-full rounded-[3px] bg-[#1E1F22] p-[10px] text-[#DBDEE1] outline-none"
                placeholder="********"
                onChange={({ currentTarget }) => setState("password", currentTarget.value)}
              />
            </label>

            <Show when={state.error}>
              <p class="text-[#F23F42]">
                Error: {state.error}
              </p>
            </Show>

            <button type="submit"
              class="h-[44px] min-h-[44px] min-w-[130px] w-full rounded-[3px] bg-[#5865F2] px-4 py-0.5 text-(center [16px] white) font-medium leading-[24px] disabled:opacity-60"
              disabled={state.loading}
            >
              Log In
            </button>
          </form>
        </div>

        <Show when={state.hcaptcha_sitekey}>
          <HCaptcha sitekey={state.hcaptcha_sitekey as string}
            /**
             * Workaround to bypass the `localhost` check.
             * Took from <https://github.com/hCaptcha/react-native-hcaptcha/blob/1569dc22501cfa63754d49683f6c278cee2bab80/Hcaptcha.js#L25>.
             */
            config={{ host: `${state.hcaptcha_sitekey}.react-native.hcaptcha.com` }}
            onVerify={hcaptchaVerifyHandler}
          />
        </Show>

        <Show when={state.mfa_ticket}>
          <form onSubmit={mfaHandler}>
            <input value={state.mfa_code}
              placeholder="6 digits code"
              onChange={({ currentTarget }) => setState("mfa_code", currentTarget.value)}
            />

            <button type="submit"
              disabled={state.loading}
            >
              Submit MFA code
            </button>
          </form>
        </Show>
      </div>

      {/* <div class="hidden md:flex flex-col gap-8 items-center flex-shrink-0 w-[240px]">
        <div class="bg-white h-[160px] w-[160px] rounded p-2">
          <div class="bg-black h-full w-full" />
        </div>

        <div>
          <h2 class="text-[#F2F3F5] text-[20px] font-semibold text-center leading-[24px]">
              Se connecter avec un code QR
          </h2>
        </div>
      </div> */}
    </div>
  );
};

export default AuthLogin;
