import type { Message } from "@/types/discord/message";

import { DISCORD_API_ENDPOINT, getCurrentAccount } from "@/api";
import { ResponseType, Body } from "@tauri-apps/api/http";
import fetch from "@/utils/native/fetch";

import caching, { type CacheStoreReady } from "@/stores/caching";
import { getCacheInStorage, setCacheInStorage } from "@/utils/storage/caching";

export const callGetChannelsMessagesAPI = async (req: {
  channel_id: string;
  /** Can go up to 100. */
  limit?: number;
  before?: string;
}): Promise<Message[]> => {
  const endpoint_path = `v9/channels/${req.channel_id}/messages`;
  const uri = new URL(DISCORD_API_ENDPOINT + endpoint_path);
  uri.searchParams.set("limit", (req.limit ?? 50).toString());
  if (req.before) uri.searchParams.set("before", req.before);

  const account = getCurrentAccount();
  const setter = caching.useSetterOf<CacheStoreReady>(account.id);

  let data: Message[];

  try {
    const response = await fetch<Message[]>(uri.href, {
      responseType: ResponseType.JSON,
      headers: { Authorization: account.token },
      method: "GET"
    });

    data = response.data;
  }
  catch {
    const cache = await getCacheInStorage<Record<string, Message>>(account.id, endpoint_path) ?? {};
    const limit = req.limit ?? 50;

    let values = Object.values(cache);

    if (req.before) {
      const message = cache[req.before];
      if (!message) values = [];
      else {
        values = values.filter(msg => Date.parse(msg.timestamp) < Date.parse(message.timestamp));
      }
    }

    data = values.slice(-limit);
  }

  let cached: Record<string, Message> = {};
  const parsed_data = data.reduce((acc: Record<string, Message>, curr) => (acc[curr.id] = curr, acc), {});
  setter("channels", channel => channel.id === req.channel_id, "messages", prev => {
    cached = { ...prev, ...parsed_data };
    return cached;
  });

  await setCacheInStorage<Record<string, Message>>(account.id, endpoint_path, cached);

  return data;
};

export const callPostChannelsMessagesAPI = async (channel_id: string, req: {
  content: string;
  flags: number;
  nonce?: string | null;
  tts?: false;
}): Promise<Message> => {
  const endpoint_path = `v9/channels/${channel_id}/messages`;
  const uri = DISCORD_API_ENDPOINT + endpoint_path;
  const account = getCurrentAccount();
  const setter = caching.useSetterOf<CacheStoreReady>(account.id);

  const body = Body.json(req);

  const { data } = await fetch<Message>(uri, {
    responseType: ResponseType.JSON,
    headers: { Authorization: account.token },
    method: "POST",
    body
  });

  let cached: Record<string, Message> = {};
  setter("channels", channel => channel.id === channel_id, "messages", prev => {
    cached = { ...prev, [data.id]: data };
    return cached;
  });

  await setCacheInStorage<Record<string, Message>>(account.id, endpoint_path, cached);

  return data;
};
