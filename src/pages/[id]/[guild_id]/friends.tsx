import type { Component } from "solid-js";

import { Show, For, createMemo } from "solid-js";
import { Navigate, useParams } from "@solidjs/router";
import caching, { type CacheStoreReady } from "@/stores/cache";

const Page: Component = () => {
  const params = useParams();
  const [cache] = caching.use<CacheStoreReady>();

  const friends = createMemo(() => {
    const users = cache.gateway.users;
    const relations = cache.gateway.relationships;

    return users.filter(
      (user) => relations.find(
        relation => relation.user_id === user.id
      )
    );
  });

  return (
    <>
      {/** We check that the user is in `@me` guild so it doesn't conflict. */}
      <Show when={params.guild_id !== "@me"}>
        <Navigate href={`/${cache.gateway.user.id}/@me/friends`} />
      </Show>

      <div>
        <For each={friends()}>
          {friend => (
            <div>
              <p>{friend.username}#{friend.discriminator}</p>
            </div>
          )}
        </For>
      </div>
    </>
  );
};

export default Page;
