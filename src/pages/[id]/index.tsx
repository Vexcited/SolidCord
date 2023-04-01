import { Component, For, Show } from "solid-js";

import type { UserStoreReady } from "@/stores/user";
import { setUserStore, userStore } from "@/stores/user";
import { getUserAvatarURL } from "@/utils/api/images";

const AppHomePage: Component = () => {
  const channels = () => (userStore as UserStoreReady).private_channels;
  const users = () => (userStore as UserStoreReady).users;

  const getRecipients = (ids: string[]) => {
    return ids.map(id => users().find(user => user.id === id));
  }

  const PrivateChannelItem: Component<ReturnType<typeof channels>[number]> = (channel) => {
    const recipients = getRecipients(channel.recipient_ids);

    return (
      <div class="flex items-center gap-2">
        <Show when={recipients[0]?.avatar}
          fallback={
            <div class="bg-black w-8 h-8 rounded-full" />
          }
        >
          <img class="w-8 h-8 rounded-full"
            src={getUserAvatarURL(recipients[0]?.id, recipients[0]?.avatar)}
          />
        </Show>
        <p class="text-white">
          {channel.name ?? recipients.map(user => user?.nickname ?? user?.username).join(", ")}
        </p>
      </div>
    )
  }

  return (
    <div class="flex h-full">
      <div class="flex-shrink-0 w-[240px] h-full bg-[#2b2d31] rounded-tl-lg">
        <nav class="flex flex-col gap-4 p-4 overflow-y-auto h-full"
          aria-label="Private channels"
        >
          <For each={channels()}>
            {channel => (
              <div>
                <PrivateChannelItem {...channel} />
              </div>
            )}
          </For>
        </nav>
      </div>
      <div class="w-full bg-black">

      </div>
    </div>
  );
};

export default AppHomePage;

