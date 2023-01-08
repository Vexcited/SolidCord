import type { DiscordLoginTokenResponse } from "./types";

import { DISCORD_API_ENDPOINT } from "@/api";
import { request } from "@/utils/native";

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
  const response = await request(DISCORD_API_ENDPOINT + "v9/auth/mfa/totp", {
    method: "POST",
    body: JSON.stringify({
      code: req.code,
      ticket: req.ticket,

      login_source: null,
      gift_code_sku_id: null
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const body = response.json();

  if (body.token) {
    return {
      success: true,
      token: (body as DiscordLoginTokenResponse).token
    };
  }

  return {
    success: false,
    debug: body
  };
};
