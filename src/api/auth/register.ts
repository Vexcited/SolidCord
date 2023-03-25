import type { DiscordCaptchaRequiredResponse } from "./types";

import { DISCORD_API_ENDPOINT } from "@/api";
import { Body, fetch } from "@tauri-apps/api/http";

type FunctionResponse =
  | {
    need_captcha: false;
    token: string;
  }
  | {
    need_captcha: true;
    sitekey: string;
  }

// TODO: Find where `fingerprint` comes from.

export const callAuthRegisterAPI = async (req: {
  username: string,
  password: string,
  email: string,
  birth: string,

  consent: boolean,
  promotional_mails: boolean,

  hcaptcha_token: string | null
}): Promise<FunctionResponse> => {
  const uri = DISCORD_API_ENDPOINT + "v9/auth/register";
  const body = Body.json({
    // fingerprint: "000000000.xxxxxxxxxxxxxxxxxxxxxxx",

    email: req.email,
    username: req.username,
    password: req.password,
    // Date in this format: "YYYY-MM-DD"
    date_of_birth: req.birth,

    invite: null,
    gift_code_sku_id: null,

    consent: req.consent, // Should be `true` to continue.
    promotional_email_opt_in: req.promotional_mails, // Optional, should default to `false`

    // Token from HCaptcha, if required.
    captcha_key: req.hcaptcha_token
  });

  const response = await fetch(uri, {
    method: "POST",
    body,

    headers: {
      // "x-fingerprint": "000000000.xxxxxxxxxxxxxxxxxxxxxxx"
    }
  });

  console.log(response);
  return;

  // const body = response.json();

  // if (body.captcha_sitekey) {
  //   return {
  //     need_captcha: true,
  //     sitekey: (body as DiscordCaptchaRequiredResponse).captcha_sitekey
  //   };
  // }

  // return {
  //   need_captcha: false,
  //   token: (body as { token: string }).token
  // };
};
