import type { Message } from "@/types/discord/message";
import { Component, Match, Show, Switch, createEffect, on, onCleanup } from "solid-js";

import { For, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import { callGetChannelsMessagesAPI, callPostChannelsMessagesAPI } from "@/api/channels/messages";

import { open } from "@tauri-apps/api/shell";


const Page: Component = () => {
  const params = useParams();
  const channel_id = () => params.channel_id;

  const [messages, setMessages] = createSignal<Message[] | null>(null);
  const [message_content, setMessageContent] = createSignal<string>("");

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

    setMessages(prev => (prev !== null ? [...data, ...prev] : data)
      .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
    );

    fetching = false;

    if (before) scrollUpChatContainer();
    else setTimeout(() => scrollDownChatContainer(), 0);
  };

  createEffect(on(channel_id, async () => {
    onCleanup(() => {
      setMessages(null); fetching = false;
    });

    await get();
    scrollUpChatContainer();
  }));

  return (
    <div class="h-full min-h-0 flex flex-col">
      <div ref={chatContainerRef} class="h-full min-h-0 flex flex-col gap-2 overflow-y-auto px-[72px] pb-[24px]"
        onScroll={(event) => {
          const latest_messages = messages();
          if (latest_messages === null) return;

          const top = event.currentTarget.scrollTop;
          if (top <= 100) {
            // First index should always be the oldest.
            get(latest_messages[0].id);
          }
        }}
      >
        <Show when={messages()} fallback={<p>Loading...</p>}>
          <For each={messages()}>
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
          const message = await callPostChannelsMessagesAPI(channel_id(), {
            content: message_content(),
            flags: 0,
            nonce: null,
            tts: false
          });

          setMessages(prev => (prev !== null ? [...prev, message] : [message]));
          scrollDownChatContainer();
          setMessageContent("");
        }}>
          <input class="w-full p-2 outline-none" type="text" onInput={(e) => setMessageContent(e.currentTarget.value)} value={message_content()} />
        </form>
      </div>
    </div>
  );
};

export default Page;
