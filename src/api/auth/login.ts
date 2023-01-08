import type {
  DiscordLoginMfaRequiredResponse,
  DiscordCaptchaRequiredResponse,
  DiscordLoginTokenResponse
} from "./types";

import { DISCORD_API_ENDPOINT } from "@/api";
import { request } from "@/utils/native";

type FunctionResponse =
  | {
    need_captcha: false;
    need_mfa: false;

    token: string;
  }
  | {
    need_captcha: true;
    need_mfa: false;

    sitekey: string;
  }
  | {
    need_captcha: false;
    need_mfa: true;

    ticket: string;
  }

export const callLoginAPI = async (req: {
  login: string,
  password: string,
  hcaptcha_token: string | null
}): Promise<FunctionResponse> => {
  const response = await request(DISCORD_API_ENDPOINT + "v9/auth/login", {
    method: "POST",
    body: JSON.stringify({
      login: req.login,
      password: req.password,
      captcha_key: req.hcaptcha_token,

      undelete: false,
      login_source: null,
      gift_code_sku_id: null
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const body = response.json();

  if (body.captcha_sitekey) {
    return {
      need_captcha: true,
      need_mfa: false,

      sitekey: (body as DiscordCaptchaRequiredResponse).captcha_sitekey
    };
  }

  if (body.token === null && body.mfa) {
    return {
      need_captcha: false,
      need_mfa: true,

      ticket: (body as DiscordLoginMfaRequiredResponse).ticket
    };
  }

  return {
    need_captcha: false,
    need_mfa: false,

    token: (body as DiscordLoginTokenResponse).token
  };
};
