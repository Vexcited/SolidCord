import type { Message } from "@/types/discord/message";

import { DISCORD_API_ENDPOINT, getCurrentAccountToken } from "@/api";
import { ResponseType, Body } from "@tauri-apps/api/http";
import fetch from "@/utils/native/fetch";

export const callGetChannelsMessagesAPI = async (req: {
  channel_id: string;
  /** Can go up to 100. */
  limit?: number;
  before?: string;
}): Promise<Message[]> => {
  const uri = new URL(DISCORD_API_ENDPOINT + `v9/channels/${req.channel_id}/messages`);
  uri.searchParams.set("limit", (req.limit ?? 50).toString());
  if (req.before) uri.searchParams.set("before", req.before);

  const token = getCurrentAccountToken();

  const { data } = await fetch<Message[]>(uri.href, {
    responseType: ResponseType.JSON,
    headers: { authorization: token },
    method: "GET"
  });

  return data;
};

export const callPostChannelsMessagesAPI = async (channel_id: string, req: {
  content: string;
  flags: number;
  nonce?: string | null;
  tts?: false;
}): Promise<Message> => {
  const uri = DISCORD_API_ENDPOINT + `v9/channels/${channel_id}/messages`;
  const token = getCurrentAccountToken();

  const body = Body.json(req);

  const { data } = await fetch<Message>(uri, {
    responseType: ResponseType.JSON,
    headers: { authorization: token },
    method: "POST",
    body
  });

  return data;
};
