import type { JSX, Component } from "solid-js";

import { useNavigate } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { Show } from "solid-js";

import HCaptcha from "solid-hcaptcha";

import { callAuthLoginAPI, callAuthMfaTotpAPI } from "@/api/auth";
import { callUsersMeAPI } from "@/api/users";

import { createCacheStorage } from "@/utils/storage/caching";
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
    error: null | string;

    hcaptcha_sitekey: null | string;
    hcaptcha_token: null | string;

    mfa_ticket: null | string;
    mfa_code: string;
  }>({
    uid: "",
    password: "",
    error: null,

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
      setState("error", "New location, please check your email for a quick verification.");
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
    const user = await callUsersMeAPI({ token });
    console.info("[.][processUserToken]: received `/users/me` data", user);

    // Make sure to remove any instance of this user account before.
    accounts.remove(user.id);

    // Add the account into our storage/store.
    accounts.add({
      id: user.id,
      username: user.username,
      avatar_hash: user.avatar,
      discriminator: user.discriminator,
      token
    });

    await createCacheStorage(user);

    navigate(`/${user.id}`);
    return;
  };

  const loginHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault();
    return sendLoginRequest();
  };

  const mfaHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault();
    return sendMfaRequest();
  };

  const hcaptchaVerifyHandler = (token: string) => {
    setState("hcaptcha_token", token);
    return sendLoginRequest();
  };

  return (
    <div class="relative max-w-[480px] w-full flex justify-between gap-8 rounded-md bg-[#313338] p-8 shadow-lg md:max-w-[784px]">
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
                placeholder="epic.g@mer.com"
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

            <button type="submit"
              class="h-[44px] min-h-[44px] min-w-[130px] w-full rounded-[3px] bg-[#5865F2] px-4 py-0.5 text-(center [16px] white) font-medium leading-[24px]"
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

            <button type="submit">
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
