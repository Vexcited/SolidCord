import { ChannelTypes, DMChannel, GroupDMChannel } from "@/types/discord/channel";
import type { User } from "@/types/discord/user";
import caching, { type CacheStoreReady } from "@/stores/caching";

/**
 * Priority:
 * 1. `nickname` if user is in `relationships`.
 * 2. `username`
 */
export const getUserNameFromPriority = (user: User): string => {
  let name = user.username;
  const [cache] = caching.useCurrent<CacheStoreReady>();

  const userInRelationships = cache.gateway.relationships.find(
    friend => friend.user_id === user.id
  );

  if (userInRelationships && userInRelationships.nickname) {
    name = userInRelationships.nickname;
  }

  return name;
};

export const getRecipientsFromIds = (ids: string[]) => {
  const [cache] = caching.useCurrent<CacheStoreReady>();
  return ids.map(id => cache.gateway.users.find(user => user.id === id));
};

export const getPrivateChannelName = (channel: DMChannel | GroupDMChannel): string => {
  const recipients = getRecipientsFromIds(channel.recipient_ids);

  let name = recipients.map(user => user && getUserNameFromPriority(user))
    .filter(Boolean)
    .sort()
    .join(", ");

  switch (channel.type) {
  case ChannelTypes.DM: {
    const user = recipients[0];
    if (!user) break; // Should never happen, though.

    name = getUserNameFromPriority(user);
    break;
  }

  case ChannelTypes.GROUP_DM: {
    // When the group channel doesn't have any name,
    // we keep the one generated by default.
    if (!channel.name) break;

    name = channel.name;
    break;
  }
  }

  return name;
};
