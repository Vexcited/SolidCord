import { Component, Show, createEffect, on, onCleanup } from "solid-js";

import { For, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import { callGetChannelsMessagesAPI, type Message } from "@/api/channels/messages";

const PageLayout: Component = () => {
  const params = useParams();
  const channel_id = () => params.channel_id;

  const [messages, setMessages] = createSignal<Message[] | null>(null);

  let chatContainerRef: HTMLDivElement | undefined;
  let oldScrollHeight = 0;
  let fetching = false;

  const get = async (before?: string) => {
    if (fetching) return;
    fetching = true;

    const data = await callGetChannelsMessagesAPI({
      channel_id: channel_id(),
      limit: 50,
      before
    });

    setMessages(prev => (prev !== null ? [...data, ...prev] : data)
      .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
    );

    fetching = false;

    if (before) {
      if (!chatContainerRef) return;
      chatContainerRef.scrollTop = chatContainerRef.scrollHeight - oldScrollHeight;
      oldScrollHeight = chatContainerRef.scrollHeight;
    }
  };

  createEffect(on(channel_id, async () => {
    onCleanup(() => {
      setMessages(null); fetching = false;
    });

    await get();

    if (!chatContainerRef) return;
    chatContainerRef.scrollTop = chatContainerRef.scrollHeight;
    oldScrollHeight = chatContainerRef.scrollHeight;
  }));

  return (
    <div ref={chatContainerRef} class="min-h-0 overflow-y-auto"
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
      {channel_id()}
      <Show when={messages()} fallback={<p>Loading...</p>}>
        <For each={messages()}>
          {message => (
            <div class="flex flex-col text-white">
              <div class="flex gap-2">
                <p class="text-lg font-bold">{message.author.username}</p>
                <span>{message.timestamp}</span>
              </div>
              <p>{message.content}</p>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
};

export default PageLayout;
