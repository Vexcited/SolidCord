import type { Message } from "@/types/discord/message";

import { DISCORD_API_ENDPOINT, getCurrentAccount } from "@/api";
import { ResponseType, Body } from "@tauri-apps/api/http";
import fetch from "@/utils/native/fetch";

import caching, { type CacheStoreReady } from "@/stores/caching";

export const callGetChannelsMessagesAPI = async (req: {
  channel_id: string;
  /** Can go up to 100. */
  limit?: number;
  before?: string;
}): Promise<Message[]> => {
  const uri = new URL(DISCORD_API_ENDPOINT + `v9/channels/${req.channel_id}/messages`);
  uri.searchParams.set("limit", (req.limit ?? 50).toString());
  if (req.before) uri.searchParams.set("before", req.before);

  const account = getCurrentAccount();
  const setter = caching.useSetterOf<CacheStoreReady>(account.id);

  const { data } = await fetch<Message[]>(uri.href, {
    responseType: ResponseType.JSON,
    headers: { authorization: account.token },
    method: "GET"
  });

  setter("channels", channel => channel.id === req.channel_id, "messages", prev => [...(prev ?? []), ...data]
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
  );

  return data;
};

export const callPostChannelsMessagesAPI = async (channel_id: string, req: {
  content: string;
  flags: number;
  nonce?: string | null;
  tts?: false;
}): Promise<Message> => {
  const uri = DISCORD_API_ENDPOINT + `v9/channels/${channel_id}/messages`;
  const account = getCurrentAccount();
  const setter = caching.useSetterOf<CacheStoreReady>(account.id);

  const body = Body.json(req);

  const { data } = await fetch<Message>(uri, {
    responseType: ResponseType.JSON,
    headers: { authorization: account.token },
    method: "POST",
    body
  });

  setter("channels", channel => channel.id === channel_id, "messages", prev => [...(prev ?? []), data]);

  return data;
};
