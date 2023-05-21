import { type Component, Match, Show, Switch, createEffect, createMemo, on, onCleanup, For, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";

import { callGetChannelsMessagesAPI, callPostChannelsMessagesAPI } from "@/api/channels/messages";

import { open } from "@tauri-apps/api/shell";
import caching, { type CacheStoreReady } from "@/stores/caching";
import { ChannelTypes } from "@/types/discord/channel";
import { getPrivateChannelName } from "@/utils/api/channels";

const Page: Component = () => {
  const params = useParams();
  const [cache] = caching.useCurrent<CacheStoreReady>();

  const channel_id = () => params.channel_id;
  const channel = () => cache.channels.find(channel => channel.id === channel_id());
  const channel_messages = createMemo(() => {
    const messages = channel()?.messages;
    if (!messages) return [];

    return Object.values(messages)
      .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
  });

  const channel_name = createMemo(() => {
    const data = channel();
    if (!data) return null;

    switch (data.type) {
    case ChannelTypes.DM:
    case ChannelTypes.GROUP_DM:
      return getPrivateChannelName(data);
    }
  });

  const [message_content, setMessageContent] = createSignal("");

  let chatContainerRef: HTMLDivElement | undefined;
  let oldScrollHeight = 0;
  let fetching = false;

  const scrollUpChatContainer = () => {
    if (!chatContainerRef) return;
    chatContainerRef.scrollTop = chatContainerRef.scrollHeight - oldScrollHeight;
    oldScrollHeight = chatContainerRef.scrollHeight;
  };

  const scrollDownChatContainer = () => {
    if (!chatContainerRef) return;
    chatContainerRef.scrollTop = chatContainerRef.scrollHeight;
    oldScrollHeight = chatContainerRef.scrollHeight;
  };

  const get = async (before?: string) => {
    if (fetching) return;
    fetching = true;

    const data = await callGetChannelsMessagesAPI({
      channel_id: channel_id(),
      limit: 50,
      before
    });

    if (data.length === 0) return;
    fetching = false;

    if (before) scrollUpChatContainer();
    else setTimeout(() => scrollDownChatContainer(), 0);
  };

  // When switching channels, we fetch messages.
  // Since messages are objects in the cache, cache will be displayed while fetching.
  createEffect(on(channel_id, async () => {
    onCleanup(() => {
      fetching = false;
    });

    const channel_data = channel();
    if (!channel_data) return;

    await get();
  }));

  // When we received a new message, we automatically scroll down.
  createEffect(on(channel_messages, () => {
    scrollDownChatContainer();
  }));

  return (
    <div class="h-full min-h-0 flex flex-col">
      <div class="h-[48px] bg-[#2b2d31] p-3 text-white">
        {channel_name() ?? "Unknown"}
      </div>
      <div ref={chatContainerRef} class="h-full min-h-0 flex flex-col gap-2 overflow-y-auto px-[72px] pb-[24px]"
        onScroll={(event) => {
          const latest_messages = channel_messages();

          const top = event.currentTarget.scrollTop;
          // First index should always be the oldest.
          const oldest_message_id = latest_messages[0]?.id;

          if (top <= 100 && oldest_message_id) {
            get(oldest_message_id);
          }
        }}
      >
        <Show when={channel_messages()} fallback={<p>Loading...</p>}>
          <For each={channel_messages()}>
            {message => (
              <div class="flex flex-col text-white">
                <div class="flex gap-2">
                  <p class="text-lg font-bold">{message.author.username}</p>
                  <span>{new Date(message.timestamp).toLocaleString()}</span>
                </div>
                <p>{message.content}</p>
                <For each={message.attachments}>
                  {attachment => (
                    <Switch
                      fallback={
                        <button type="button" onClick={() => open(attachment.url)}
                          class="w-fit rounded-lg bg-blue p-2 text-white"
                        >
                          {attachment.filename} ({attachment.content_type})
                        </button>
                      }
                    >
                      <Match when={attachment.content_type.startsWith("image/")}>
                        <img class="block h-auto max-w-[550px] rounded-2 object-cover"
                          src={attachment.url}
                          alt={attachment.filename}
                        />
                      </Match>
                      <Match when={attachment.content_type.startsWith("video/")}>
                        <video controls class="block h-auto max-w-[550px] rounded-2 object-cover"
                          src={attachment.url}
                        />
                      </Match>
                      <Match when={attachment.content_type.startsWith("audio/")}>
                        <audio controls
                          src={attachment.url}
                        />
                      </Match>
                    </Switch>
                  )}
                </For>
              </div>
            )}
          </For>
        </Show>
      </div>
      <div class="h-auto">
        <form onSubmit={async (event) => {
          event.preventDefault();

          try {
            await callPostChannelsMessagesAPI(channel_id(), {
              content: message_content(),
              flags: 0,
              nonce: null,
              tts: false
            });

            setMessageContent("");
          }
          catch {
            console.error("send message: action need internet access");
          }
        }}>
          <input class="w-full p-2 outline-none" type="text" onInput={(e) => setMessageContent(e.currentTarget.value)} value={message_content()} />
        </form>
      </div>
    </div>
  );
};

export default Page;
