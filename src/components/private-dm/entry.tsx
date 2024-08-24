import { CacheStoreReady } from "@/stores/cache";
import { ChannelTypes } from "@/types/discord/channel";
import { getPrivateChannelName, getRecipientsFromIds } from "@/utils/api/channels";
import { getChannelIconURL, getUserAvatarURL } from "@/utils/api/images";
import { A } from "@solidjs/router";
import { BsPeopleFill } from "solid-icons/bs";
import { Component, createMemo, Match, Show, Switch } from "solid-js";
import accounts from "@/stores/accounts";

const PrivateChannelEntry: Component<CacheStoreReady["gateway"]["private_channels"][number]> = (channel) => {
  const recipients = createMemo(() => getRecipientsFromIds(channel.recipient_ids));
  const account = accounts.use();

  /**
   * Checks if the channel have an image or not.
   * @returns `null` when no image for the channel could be found.
   */
  const getChannelImageURL = (): string | null => {
    let url: string | null = null;

    switch (channel.type) {
    case ChannelTypes.DM: {
      const user = recipients()[0];
      if (!user || !user.avatar) break;

      url = getUserAvatarURL(
        user.id,
        user.avatar
      );

      break;
    }

    case ChannelTypes.GROUP_DM: {
      if (!channel.icon) break;

      url = getChannelIconURL(
        channel.id,
        channel.icon
      );

      break;
    }
    }

    return url;
  };

  return (
    <A class="flex items-center gap-2" href={`/${account.id}/@me/${channel.id}`}>
      <Show when={getChannelImageURL()}
        fallback={
          <div class="h-8 w-8 flex items-center justify-center rounded-full bg-black">
            <Switch>
              <Match when={channel.type === ChannelTypes.GROUP_DM}>
                <BsPeopleFill color="white" />
              </Match>
            </Switch>
          </div>
        }
      >
        {url => (
          <img class="h-8 w-8 rounded-full"
            src={url()}
          />
        )}
      </Show>
      <p class="text-white">
        {getPrivateChannelName(channel)}
      </p>
    </A>
  );
};

export default PrivateChannelEntry;
