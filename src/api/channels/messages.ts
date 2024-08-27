import type { Message } from "@/types/discord/message";

import { createApiEndpointURL, getCurrentAccount } from "@/api";
import fetch from "@/utils/native/fetch";

import caching, { type CacheStoreReady } from "@/stores/cache";

export const callGetChannelsMessagesAPI = async (req: {
  channel_id: string;
  /** Can go up to 100. */
  limit?: number;
  before?: string;
}): Promise<Message[]> => {
  const uri = createApiEndpointURL(9, `/channels/${req.channel_id}/messages`);
  uri.searchParams.set("limit", (req.limit ?? 50).toString());
  if (req.before) uri.searchParams.set("before", req.before);

  const account = getCurrentAccount();
  const setter = caching.setterOf<CacheStoreReady>(account.id);

  const response = await fetch<Message[]>(uri, {
    headers: { Authorization: account.token }
  });

  const parsed_data = response.data.reduce(
    (acc, curr) => (acc[curr.id] = curr, acc),
    {} as Record<string, Message>
  );

  setter(
    "channels", (channel) => channel.id === req.channel_id,
    "messages", (prev) => ({ ...prev, ...parsed_data })
  );

  return response.data;
};

export const callPostChannelsMessagesAPI = async (channel_id: string, req: {
  content: string;
  flags: number;
  nonce?: string | null;
  tts?: false;
}): Promise<Message> => {
  const uri = createApiEndpointURL(9, `/channels/${channel_id}/messages`);

  const account = getCurrentAccount();
  const setter = caching.setterOf<CacheStoreReady>(account.id);

  const { data } = await fetch<Message>(uri, {
    response: "json",
    headers: { Authorization: account.token },
    method: "POST",
    body: req
  });

  setter(
    "channels", (channel) => channel.id === channel_id,
    "messages", (prev) => ({ ...prev, [data.id]: data })
  );

  return data;
};
