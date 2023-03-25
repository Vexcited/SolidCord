import type { DiscordLoginTokenResponse } from "./types";

import { DISCORD_API_ENDPOINT } from "@/api";
import { Body, fetch } from "@tauri-apps/api/http";

type FunctionResponse =
  | {
    success: true;
    token: string;
  }
  | {
    success: false;
    debug: string;
  }

export const callAuthMfaTotpAPI = async (req: {
  code: string,
  ticket: string
}): Promise<FunctionResponse> => {
  const uri = DISCORD_API_ENDPOINT + "v9/auth/mfa/totp";
  const body = Body.json({
    code: req.code,
    ticket: req.ticket,

    login_source: null,
    gift_code_sku_id: null
  });

  const response = await fetch(uri, {
    method: "POST",
    body
  });

  console.log(response);
  return;

  // const body = response.json();

  // if (body.token) {
  //   return {
  //     success: true,
  //     token: (body as DiscordLoginTokenResponse).token
  //   };
  // }

  // return {
  //   success: false,
  //   debug: body
  // };
};
