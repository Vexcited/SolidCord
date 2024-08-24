import type {
  DiscordLoginMfaRequiredResponse,
  DiscordCaptchaRequiredResponse,
  DiscordLoginTokenResponse,
  DiscordLoginVerificationEmailResponse,
  DiscordLoginInvalidLoginResponse
} from "./types";

import { createApiEndpointURL } from "@/api";
import fetch from "@/utils/native/fetch";

type FunctionResponse = (
  | { status: "EMAIL_VERIFICATION" }
  | {
    status: "INVALID_CREDENTIALS";
    data: {
      is_uid: boolean;
      is_password: boolean;
    };
  }
  | {
    status: "UNKNOWN";
    data: { debug: unknown };
  }
  | {
    status: "TOKEN";
    data: { token: string };
  }
  | {
    status: "HCAPTCHA";
    data: { sitekey: string };
  }
  | {
    status: "MFA";
    data: { ticket: string };
  }
);

export const callAuthLoginAPI = async (req: {
  login: string;
  password: string;
  hcaptcha_token: string | null;
}): Promise<FunctionResponse> => {
  const uri = createApiEndpointURL(9, "/auth/login");

  const { data } = await fetch<(
    | DiscordCaptchaRequiredResponse
    | DiscordLoginMfaRequiredResponse
    | DiscordLoginTokenResponse
    | DiscordLoginVerificationEmailResponse
    | DiscordLoginInvalidLoginResponse
  )>(uri, {
      response: "json",
      method: "POST",
      body: {
        login: req.login,
        password: req.password,
        captcha_key: req.hcaptcha_token,

        undelete: false,
        login_source: null,
        gift_code_sku_id: null
      }
    });

  if ("captcha_sitekey" in data) {
    return {
      status: "HCAPTCHA",
      data: { sitekey: data.captcha_sitekey }
    };
  }

  else if ("mfa" in data) {
    return {
      status: "MFA",
      data: { ticket: data.ticket }
    };
  }

  else if ("errors" in data) {
    // Variables to handle invalid credentials error.
    let error_in_uid = false, error_in_password = false;

    if ("login" in data.errors) {
      const error_code = data.errors.login._errors[0].code;

      if (error_code === "ACCOUNT_LOGIN_VERIFICATION_EMAIL") {
        return { status: "EMAIL_VERIFICATION" };
      }
      else if (error_code === "INVALID_LOGIN") {
        error_in_uid = true;
      }
    }

    if ("password" in data.errors) {
      const error_code = data.errors.password._errors[0].code;

      if (error_code === "INVALID_LOGIN") {
        error_in_password = true;
      }
    }

    if (error_in_uid || error_in_password) {
      return {
        status: "INVALID_CREDENTIALS",
        data: {
          is_uid: error_in_uid,
          is_password: error_in_password
        }
      };
    }
    else {
      return {
        status: "UNKNOWN",
        data: { debug: data.errors }
      };
    }
  }

  return {
    status: "TOKEN",
    data: { token: data.token }
  };
};
