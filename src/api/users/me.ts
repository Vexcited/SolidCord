import type { DiscordMeResponse } from "./types";

import fetch from "@/utils/native/fetch";
import { createApiEndpointURL, getCurrentAccountToken } from "@/api";

export const callUsersMeAPI = async (token?: string) => {
  if (!token) token = getCurrentAccountToken();

  const uri = createApiEndpointURL(9, "/users/@me");
  const response = await fetch<DiscordMeResponse>(uri, {
    method: "GET",
    headers: { Authorization: token }
  });

  return response.data;
};
