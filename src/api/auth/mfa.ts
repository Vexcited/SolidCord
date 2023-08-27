import type { DiscordLoginTokenResponse } from "./types";

import { createApiEndpointURL } from "@/api";
import fetch from "@/utils/native/fetch";

type FunctionResponse = (
  | {
    success: true;
    token: string;
  }
  | {
    success: false;
    debug: string;
  }
);

export const callAuthMfaTotpAPI = async (req: {
  code: string;
  ticket: string;
}): Promise<FunctionResponse> => {
  const uri = createApiEndpointURL(9, "/auth/mfa/totp");

  const response = await fetch(uri, {
    method: "POST",
    body: {
      code: req.code,
      ticket: req.ticket,

      login_source: null,
      gift_code_sku_id: null
    }
  });

  const data = response.data as (
    DiscordLoginTokenResponse
  );

  if ("token" in data) {
    return {
      success: true,
      token: data.token
    };
  }

  return {
    success: false,
    debug: data
  };
};
