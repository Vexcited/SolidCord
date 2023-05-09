import type { Component } from "solid-js";

import { Show, For, createMemo } from "solid-js";
import { Navigate, useParams } from "@solidjs/router";
import { userStore, type UserStoreReady } from "@/stores/user";

const Page: Component = () => {
  const params = useParams();
  const store = () => userStore as UserStoreReady;

  const friends = createMemo(() => {
    const users = store().users;
    const relations = store().relationships;

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
        <Navigate href={`/${store().user.id}/@me/friends`} />
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
