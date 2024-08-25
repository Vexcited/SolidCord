import type { ParentComponent } from "solid-js";
import { Show, For, createEffect, on } from "solid-js";
import { useParams, A } from "@solidjs/router";
import { type } from "@tauri-apps/plugin-os"

import app from "@/stores/app";
import caching from "@/stores/cache";
import { getGuildIconURL, getUserAvatarURL } from "@/utils/api/images";

const AccountLayout: ParentComponent = (props) => {
  const params = useParams();

  const [cache] = caching.use();
  createEffect(on(() => params.id, (account_id) => {
    app.setCurrentAccountID(account_id);
  }));

  return (
    <Show when={cache.token && cache.ready ? cache : null}
      fallback={<p>Loading connection to gateway...</p>}
    >
      {cache => (
        <div class="h-screen flex"
          classList={{ "border-t border-white/10": type() === "windows" }}
        >
          {/* Guild list. */}
          <div class="w-[72px] flex flex-(shrink-0 col) items-center gap-2 overflow-y-auto pt-3 bg-black/10 border-r border-white/10">
            <Show when={cache().gateway.user.avatar} fallback={
              <A class="h-12 w-12 flex items-center justify-center bg-white font-medium text-black transition-[border-radius]" href={`/${cache().gateway.user.id}/@me`}
                classList={{ "rounded-lg": !params.guild_id, "rounded-[50%]": Boolean(params.guild_id) }}
              >
                {cache().gateway.user.username[0].toUpperCase()}
              </A>
            }>
              {avatar_hash => (
                <A href={`/${cache().gateway.user.id}/@me`}>
                  <img
                    class="h-12 w-12 bg-black/10 transition-[border-radius]"
                    classList={{ "rounded-lg": !params.guild_id, "rounded-[50%]": Boolean(params.guild_id) }}
                    src={getUserAvatarURL(cache().gateway.user.id, avatar_hash())}
                  />

                </A>
              )}
            </Show>

            <hr class="w-[32px] border-1 my-2 border-gray rounded-lg" />

            <For each={cache().gateway.guilds}>
              {guild => (
                <A href={`/${cache().gateway.user.id}/${guild.id}`}>
                  <Show when={guild.properties.icon}>
                    {icon_hash => (
                      <img
                        class="h-12 w-12 transition-[border-radius]"
                        classList={{ "rounded-lg": params.guild_id === guild.id, "rounded-[50%]": params.guild_id !== guild.id }}
                        src={getGuildIconURL(guild.properties.id, icon_hash())}
                      />
                    )}
                  </Show>
                </A>
              )}
            </For>
          </div>

          <div class="w-full">
            {props.children}
          </div>
        </div>
      )}
    </Show>
  );
};

export default AccountLayout;
