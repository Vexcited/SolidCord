import type {
  DiscordLoginMfaRequiredResponse,
  DiscordCaptchaRequiredResponse,
  DiscordLoginTokenResponse,
  DiscordLoginVerificationEmailResponse
} from "./types";

import { DISCORD_API_ENDPOINT } from "@/api";
import { Body, ResponseType } from "@tauri-apps/api/http";
import fetch from "@/utils/native/fetch";

type FunctionResponse =
  | {
    need_email_verification: true;
    need_captcha: false;
    need_mfa: false;
  }
  | {
    need_email_verification: false;
    need_captcha: false;
    need_mfa: false;

    token: string;
  }
  | {
    need_email_verification: false;
    need_captcha: true;
    need_mfa: false;

    sitekey: string;
  }
  | {
    need_email_verification: false;
    need_captcha: false;
    need_mfa: true;

    ticket: string;
  }

export const callAuthLoginAPI = async (req: {
  login: string;
  password: string;
  hcaptcha_token: string | null;
}): Promise<FunctionResponse> => {
  const uri = DISCORD_API_ENDPOINT + "v9/auth/login";
  const body = Body.json({
    login: req.login,
    password: req.password,
    captcha_key: req.hcaptcha_token,

    undelete: false,
    login_source: null,
    gift_code_sku_id: null
  });

  const { data } = await fetch<(
    | DiscordCaptchaRequiredResponse
    | DiscordLoginMfaRequiredResponse
    | DiscordLoginTokenResponse
    | DiscordLoginVerificationEmailResponse
  )>(uri, {
      responseType: ResponseType.JSON,
      method: "POST",
      body
    });

  if ("captcha_sitekey" in data) {
    return {
      need_email_verification: false,
      need_captcha: true,
      need_mfa: false,

      sitekey: data.captcha_sitekey
    };
  }

  else if ("mfa" in data) {
    return {
      need_email_verification: false,
      need_captcha: false,
      need_mfa: true,

      ticket: data.ticket
    };
  }

  else if ("errors" in data) {
    // TODO: Handle more errors so we can switch between errors.

    // if (data.errors.login._errors[0].code === "ACCOUNT_LOGIN_VERIFICATION_EMAIL")
    return {
      need_email_verification: true,
      need_captcha: false,
      need_mfa: false
    };
  }

  return {
    need_email_verification: false,
    need_captcha: false,
    need_mfa: false,

    token: data.token
  };
};
