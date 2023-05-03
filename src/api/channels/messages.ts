import { DISCORD_API_ENDPOINT } from "@/api";
import { ResponseType } from "@tauri-apps/api/http";
import fetch from "@/utils/native/fetch";

import { userStore } from "@/stores/user";

export interface Message {
  id: string;
  type: 0;
  content: string;
  channel_id: string;

  tts: boolean;
  pinned: boolean;

  timestamp: string;

  author: {
    id: string;
    username: string;
  };
}

export const callGetChannelsMessagesAPI = async (req: {
  channel_id: string;
  /** Can go up to 100. */
  limit?: number;
  before?: string;
}): Promise<Message[]> => {
  const uri = new URL(DISCORD_API_ENDPOINT + `v9/channels/${req.channel_id}/messages`);
  uri.searchParams.set("limit", (req.limit ?? 50).toString());
  if (req.before) uri.searchParams.set("before", req.before);

  const token = userStore.token;
  if (!token) throw new Error("Unauthenticated user, no token found.");

  const { data } = await fetch<Message[]>(uri.href, {
    responseType: ResponseType.JSON,
    method: "GET",
    headers: {
      authorization: token
    }
  });

  return data;
};
