import { type Component, For, Match, Show, Switch, createMemo } from "solid-js";

import caching, { type CacheStoreReady } from "@/stores/cache";
import accounts from "@/stores/accounts";

import { getUserAvatarURL, getChannelIconURL } from "@/utils/api/images";

import { BsPeopleFill } from "solid-icons/bs";

import { A, Outlet, useNavigate, useParams } from "@solidjs/router";
import { ChannelTypes } from "@/types/discord/channel";
import { getPrivateChannelName, getRecipientsFromIds } from "@/utils/api/channels";

const AppHomePage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const guild_id = () => params.guild_id;
  const channel_id = () => params.channel_id;

  const [cache] = caching.use<CacheStoreReady>();
  const account = accounts.use();

  const guild = createMemo(() => cache.gateway.guilds.find(guild => guild.id === guild_id()));
  const guild_channels = createMemo(() => {
    const guild_data = guild();
    if (!guild_data) return;

    const channels = guild_data.channels;
    const sorted_channels = [];

    const categories = channels?.filter(channel => channel.type === ChannelTypes.GUILD_CATEGORY);
    if (!categories) return [];

    for (const category of categories) {
      // We need two separate arrays for channels in categories
      // We have text channels above vocals channels, they don't to match the `position` each other.
      const category_text_channels_sorted = [];
      const category_vocal_channels_sorted = [];

      // We get every channels under that category.
      const category_channels = channels.filter(channel => "parent_id" in channel && channel.parent_id === category.id);
      if (!category_channels) continue;

      for (const channel of category_channels) {
        // We put vocal channels in another array.
        if (channel.type === ChannelTypes.GUILD_VOICE) {
          category_vocal_channels_sorted[channel.position] = channel;
          continue;
        }

        category_text_channels_sorted[channel.position] = channel;
      }

      // We put the category and its channels in the result.
      sorted_channels[category.position] = {
        data: category,
        text_channels: category_text_channels_sorted.filter(Boolean),
        vocal_channels: category_vocal_channels_sorted.filter(Boolean)
      };
    }

    // We filter empty elements.
    return sorted_channels.filter(Boolean);
  });

  const channel = createMemo(() => guild()?.channels.find(channel => channel.id === channel_id()));

  const PrivateChannelEntry: Component<CacheStoreReady["gateway"]["private_channels"][number]> = (channel) => {
    const recipients = createMemo(() => getRecipientsFromIds(channel.recipient_ids));


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

  return (
    <div class="h-full flex">
      <div class="h-full w-[240px] flex-shrink-0 rounded-tl-lg bg-[#2b2d31]">
        <div class="h-full flex flex-col border-gray divide-y">
          <Show when={guild_id() === "@me"}
            fallback={
              <>
                <div class="w-full p-3">
                  <p class="font-semibold text-white">{guild()?.properties.name}</p>
                </div>
                <nav class="h-full flex flex-col gap-4 overflow-y-auto p-4 text-white"
                  aria-label="Channels of the guild"
                >
                  <For each={guild_channels()}>
                    {category => (
                      <div class="flex flex-col gap-1">
                        <p class="text-sm font-semibold uppercase">
                          {category.data.name}
                        </p>
                        <div class="flex flex-col gap-1">
                          <For each={category.text_channels}>
                            {channel => (
                              <A class="flex items-center gap-2 rounded-md px-2 py-1 pl-4"
                                href={`/${account.id}/${guild_id()}/${channel.id}`}
                                classList={{
                                  "bg-white/20 text-white ": channel.id === channel_id()
                                }}
                              >
                                <p>{channel.name}</p>
                              </A>
                            )}
                          </For>
                          <For each={category.vocal_channels}>
                            {channel => (
                              <div class="ml-4 flex items-center gap-2">
                                <p>(vocal) {channel.name}</p>
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    )}
                  </For>
                </nav>
              </>

            }
          >
            <div class="h-[48px] w-full p-3">
              <input placeholder="Search" class="w-full" />
            </div>
            <nav class="h-full flex flex-col gap-4 overflow-y-auto p-4"
              aria-label="Private channels"
            >
              <A class="flex items-center gap-2" href={`/${account.id}/@me/friends`}>
                <p class="text-white">
                  Friends
                </p>
              </A>

              <For each={cache.gateway.private_channels}>
                {channel => (
                  <div>
                    <PrivateChannelEntry {...channel} />
                  </div>
                )}
              </For>
            </nav>
          </Show>
          <div class="h-[58px] w-full p-3">
            <button type="submit" class="font-semibold text-white"
              onClick={() => {
                localStorage.removeItem("lastVisitedAccount");
                navigate("/");
              }}
            >
              switch acc
            </button>
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col">
        <div>
          {channel()?.name}
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AppHomePage;

