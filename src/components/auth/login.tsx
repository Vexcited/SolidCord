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
    <div class="bg-[#313338] relative flex justify-between gap-8 w-full max-w-[480px] md:max-w-[784px] p-8 rounded-md shadow-lg">
      <Show when={props.showBackArrow}>
        <button type="button" class="absolute top-12 left-8"
          onClick={() => props.onBackArrowClick && props.onBackArrowClick()}
        >
          <IoArrowBack size={24} color="#DBDEE1" />
        </button>
      </Show>

      <div class="w-full">
        <div class="flex flex-col gap-5">
          <div class="flex flex-col items-center gap-2">
            <h1 class="text-[#F2F3F5] font-semibold text-[24px] leading-[30px]">
              Welcome back!
            </h1>
            <p class="text-[#B5BAC1] text-[16px] leading-[20px]">
              We're so excited to see you again!
            </p>
          </div>

          <form class="flex flex-col gap-5"
            onSubmit={loginHandler}
          >
            <label>
              <p class="uppercase text-[#B5BAC1] text-[12px] leading-[16px] font-bold mb-2 tracking-wide">
                  E-Mail ou numéro de téléphone
                <span class="text-[#F23F42] pl-1">*</span>
              </p>
              <input type="text" value={state.uid}
                class="bg-[#1E1F22] text-[#DBDEE1] w-full p-[10px] rounded-[3px] outline-none"
                placeholder="epic.g@mer.com"
                onChange={({ currentTarget }) => setState("uid", currentTarget.value)}
              />
            </label>

            <label>
              <p class="uppercase text-[#B5BAC1] text-[12px] leading-[16px] font-bold mb-2 tracking-wide">
                  Mot de passe
                <span class="text-[#F23F42] pl-1">*</span>
              </p>
              <input type="password" value={state.password}
                class="bg-[#1E1F22] text-[#DBDEE1] w-full p-[10px] rounded-[3px] outline-none"
                placeholder="********"
                onChange={({ currentTarget }) => setState("password", currentTarget.value)}
              />
            </label>

            <button type="submit"
              class="rounded-[3px] w-full text-white bg-[#5865F2] px-4 py-0.5 text-[16px] font-medium h-[44px] leading-[24px] min-w-[130px] min-h-[44px] text-center"
            >
                Connexion
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
