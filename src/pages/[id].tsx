import type { Component } from "solid-js";
import { Show, For } from "solid-js";
import { Outlet, useParams, A } from "@solidjs/router";

import caching from "@/stores/caching";
import { getGuildIconURL, getUserAvatarURL } from "@/utils/api/images";

const Layout: Component = () => {
  const params = useParams();

  const [cache] = caching.useCurrent();
  localStorage.setItem("lastVisitedAccount", params.id);

  return (
    <Show when={cache.token && cache.ready ? cache : null}
      fallback={<p>Loading connection to gateway...</p>}
    >
      {cache => (
        <div class="h-full flex bg-[#1e1f22]">
          {/* Guild list. */}
          <div class="w-[72px] flex flex-(shrink-0 col) items-center gap-2 overflow-y-auto pt-1">
            <Show when={cache().gateway.user.avatar} fallback={
              <A class="h-12 w-12 flex items-center justify-center bg-white font-medium text-black" href={`/${cache().gateway.user.id}/@me`}
                classList={{ "rounded-lg": params.guild_id === "@me", "rounded-full": params.guild_id !== "@me" }}
              >
                {cache().gateway.user.username[0].toUpperCase()}
              </A>
            }>
              {avatar_hash => (
                <A href={`/${cache().gateway.user.id}/@me`}>
                  <img
                    class="h-12 w-12"
                    classList={{ "rounded-lg": params.guild_id === "@me", "rounded-full": params.guild_id !== "@me" }}
                    src={getUserAvatarURL(cache().gateway.user.id, avatar_hash())}
                  />

                </A>
              )}
            </Show>

            <hr class="w-[32px] border-2 border-gray rounded-lg" />

            <For each={cache().gateway.guilds}>
              {guild => (
                <A href={`/${cache().gateway.user.id}/${guild.id}`}>
                  <Show when={guild.properties.icon}>
                    {icon_hash => (
                      <img
                        class="h-12 w-12 rounded-full"
                        classList={{ "rounded-lg": params.guild_id === guild.id, "rounded-full": params.guild_id !== guild.id }}
                        src={getGuildIconURL(guild.properties.id, icon_hash())}
                      />
                    )}
                  </Show>
                </A>
              )}
            </For>
          </div>
          <div class="w-full">
            <Outlet />
          </div>
        </div>
      )}
    </Show>
  );
};

export default Layout;
