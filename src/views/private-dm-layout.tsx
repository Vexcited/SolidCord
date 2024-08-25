import { createMemo, type ParentComponent, For } from "solid-js";
import { A, useNavigate, useParams } from "@solidjs/router";
import PrivateChannelEntry from "@/components/private-dm/entry";

import caching, { type CacheStoreReady } from "@/stores/cache";
import accounts from "@/stores/accounts";

export const PrivateDMLayout: ParentComponent = (props) => {
  const params = useParams();
  const navigate = useNavigate();

  const [cache] = caching.use<CacheStoreReady>();
  const account = accounts.use();

  const channel_id = () => params.channel_id;

  console.log(cache.gateway.private_channels);
  const guild = createMemo(() => cache.gateway.guilds.find(guild => guild.id === "@me"));
  const channel = createMemo(() => guild()?.channels.find(channel => channel.id === channel_id()));

  return (
    <div class="h-full flex">
      <div class="h-full w-[240px] flex-shrink-0 rounded-tl-lg border-r border-white/10">
        <div class="h-full flex flex-col divide-white/10 divide-y">
          <div class="flex justify-center items-center w-full p-3 h-[54px] flex-shrink-0">
            <input placeholder="Find or start a conversation" class="w-full bg-white/10 rounded-md px-2 h-full text-white" />
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
          
          <div class="h-[58px] w-full p-3">
            <button type="submit" class="font-semibold text-white"
              onClick={() => {
                localStorage.removeItem("lastVisitedAccount");
                navigate("/");
              }}
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
      
      <div class="w-full flex flex-col">
        <div>
          {channel()?.name}
        </div>
        
        {props.children}
      </div>
    </div>
  )
}