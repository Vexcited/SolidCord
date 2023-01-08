import type { DiscordMeResponse } from "./types";

import { request } from "@/utils/native";
import { DISCORD_API_ENDPOINT } from "@/api";

import { user_store } from "@/stores/app";

export const callUsersMeAPI = async (req?: { token?: string }) => {
  const token = req?.token || user_store.token;
  if (!token) throw new Error("User not available.");

  const response = await request(DISCORD_API_ENDPOINT + "v9/users/@me", {
    method: "GET",
    headers: {
      "Authorization": token
    }
  });

  const body = response.json() as DiscordMeResponse;
  return body;
};
