export enum ChannelTypes {
  /** a text channel within a server */
  GUILD_TEXT = 0,
  /** a direct message between users */
  DM = 1,
  /** a voice channel within a server */
  GUILD_VOICE = 2,
  /** a direct message between multiple users */
  GROUP_DM = 3,
  /** an organizational category that contains up to 50 channels */
  GUILD_CATEGORY = 4,
  /** a channel that users can follow and crosspost into their own server (formerly news channels) */
  GUILD_ANNOUNCEMENT = 5,
  /** a temporary sub-channel within a GUILD_ANNOUNCEMENT channel */
  ANNOUNCEMENT_THREAD = 10,
  /** a temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel */
  PUBLIC_THREAD = 11,
  /** a temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission */
  PRIVATE_THREAD = 12,
  /** a voice channel for hosting events with an audience */
  GUILD_STAGE_VOICE = 13,
  /** the channel in a hub containing the listed servers */
  GUILD_DIRECTORY = 14,
  /** Channel that can only contain threads */
  GUILD_FORUM = 15
}

export interface DMChannel {
  id: string; // snowflake.
  last_message_id: string; // snowflake.
  name: string;

  is_spam: boolean;
  /** date */
  last_pin_timestamp?: string;

  flags: number;
  recipient_ids: string[];
  type: ChannelTypes.DM;
}

export interface GroupDMChannel {
  id: string; // snowflake.

  icon: string | null;
  name: string | null;
  last_message_id: string;

  flags: number;
  recipient_ids: string[];
  type: ChannelTypes.GROUP_DM;
}

export interface GuildVoiceChannel {
  flags: number;
  bitrate: number;
  id: string; // snowflake.
  last_message_id: string; // snowflake.
  name: string;
  parent_id: string;
  permission_overwrites: {
    type: number;
    allow: string;
    deny: string;
    id: string; // snowflake.
  }[];
  position: number;
  rate_limit_per_user: number;
  rtc_region: string | null;
  type: ChannelTypes.GUILD_VOICE;
  user_limit: number;
}

export interface GuildCategoryChannel {
  flags: number;
  type: ChannelTypes.GUILD_CATEGORY; // category: could be a parent for other channels.
  position: number;
  permission_overwrites: {
    type: number;
    allow: string;
    deny: string;
    id: string; // snowflake.
  }[];
  name: string;
  id: string; // snowflake.
}

export interface GuildTextChannel {
  flags: number;
  id: string; // snowflake.
  last_message_id: string; // snowflake.
  name: string;
  nsfw: boolean;
  parent_id: string;
  permission_overwrites: {
    type: number;
    allow: string;
    deny: string;
    id: string; // snowflake.
  }[];
  position: number;
  rate_limit_per_user: number;
  topic: string;
  type: ChannelTypes.GUILD_TEXT; // text channels.
}

export type Channel =
  | DMChannel
  | GroupDMChannel
  | GuildVoiceChannel
  | GuildTextChannel
  | GuildCategoryChannel
