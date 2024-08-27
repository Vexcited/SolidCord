import { type ParentComponent, For, createMemo } from "solid-js";

import caching, { type CacheStoreReady } from "@/stores/cache";
import accounts from "@/stores/accounts";

import { A, useParams } from "@solidjs/router";
import { ChannelTypes } from "@/types/discord/channel";
import UserWidget from "@/components/panels/user-widget";

const GuildLayout: ParentComponent = (props) => {
  const params = useParams();
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

  return (
    <div class="h-full flex">
      <div class="h-full w-[240px] flex-shrink-0 rounded-tl-lg border-r border-white/10">
        <div class="h-full flex flex-col divide-white/10 divide-y">
          <div class="flex items-center w-full p-3 h-[54px] flex-shrink-0">
            <p class="font-semibold text-white">{guild()?.properties.name}</p>
          </div>

          <nav class="h-full flex flex-col gap-4 overflow-y-auto p-4"
            aria-label="Channels of the guild"
          >
            <For each={guild_channels()}>
              {category => (
                <div class="flex flex-col gap-1">
                  <p class="text-sm font-semibold uppercase text-white/65">
                    {category.data.name}
                  </p>

                  <div class="flex flex-col gap-1">
                    <For each={category.text_channels}>
                      {channel => (
                        <A class="flex items-center gap-2 rounded-md px-2 py-1 pl-4"
                          href={`/${account.id}/${guild_id()}/${channel.id}`}
                          classList={{
                            "text-white/50": channel.id !== channel_id(),
                            "bg-white/15 text-white": channel.id === channel_id()
                          }}
                        >
                          <p>{channel.name}</p>
                        </A>
                      )}
                    </For>
                    <For each={category.vocal_channels}>
                      {channel => (
                        <div class="flex items-center gap-2 rounded-md px-2 py-1 pl-4">
                          <p class="text-white/50 cursor-not-allowed truncate"
                            title="Voice channels are not supported yet."
                          >
                            (VC) {channel.name}
                          </p>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </nav>

          <UserWidget />
        </div>
      </div>
      <div class="w-full flex flex-col">
        {props.children}
      </div>
    </div>
  );
};

export default GuildLayout;

