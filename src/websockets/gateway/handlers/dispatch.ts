import type { OpDispatch } from "../types";
import { OpCodes } from "../types";
import { LocalesIdentifier } from "@/locales";
import { GuildExplicitContentFilterLevel, GuildFeatures, GuildMessageNotificationLevel, GuildMfaLevel, GuildNsfwLevel, GuildPremiumTier, GuildSystemChannelFlags, GuildVerificationLevel } from "@/types/discord/guild";

import { setUserStore } from "@/stores/user";

export interface OpDispatchReady {
  t: "READY";
  op: OpCodes.Dispatch;
  s: 1;

  d: {
    v: number;
    guilds: ({
      application_command_counts: Record<number, number>;
      channels: ({
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
        type: 0; // text channels.
      } | {
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
        type: 2; // probably vocals.
        user_limit: number;
      } | {
        flags: number;
        type: 4; // category: could be a parent for other channels.
        position: number;
        permission_overwrites: {
          type: number;
          allow: string;
          deny: string;
          id: string; // snowflake.
        }[];
        name: string;
        id: string; // snowflake.
      })[];

      data_mode: "full";
      emojis: ({
        id: string;
        animated: boolean;
        available: boolean;
        managed: boolean;
        name: string;
        require_colons: boolean;
        roles: unknown[]; // TODO
      })[];

      guild_scheduled_events: unknown[];
      id: string; // snowflake.
      /** date in ISO8601 format */
      joined_at: string;
      large: boolean;
      lazy: boolean;
      member_count: number;
      premium_subscription_count: number;
      properties: {
        afk_channel_id: string | null;
        afk_timeout: number;
        application_id: string | null;
        banner: string | null;
        default_message_notifications: GuildMessageNotificationLevel;
        description: string | null;
        discovery_splash: null; // TODO
        explicit_content_filter: GuildExplicitContentFilterLevel;
        features: GuildFeatures[];
        home_header: string | null; // TODO
        hub_type: null; // TODO
        icon: string | null; // TODO
        id: string;
        latest_onboarding_question_id: string | null;
        max_members: number;
        max_stage_video_channel_users: number;
        max_video_channel_users: number;
        mfa_level: GuildMfaLevel;
        name: string;
        nsfw: boolean;
        nsfw_level: GuildNsfwLevel;
        owner_id: string;
        preferred_locale: LocalesIdentifier;
        premium_progress_bar_enabled: boolean;
        premium_tier: GuildPremiumTier;
        public_updates_channel_id: string | null;
        rules_channel_id: string | null;
        safety_alerts_channel_id: string | null;
        splash: null; // TODO
        system_channel_flags: GuildSystemChannelFlags;
        system_channel_id: string; // TODO
        vanity_url_code: null; // TODO
        verification_level: GuildVerificationLevel;
      };

      roles: ({
        color: number;
        flags: number;
        hoist: boolean;
        icon: string | null; // TODO
        id: string;
        managed: boolean;
        mentionable: boolean;
        name: string;
        permissions: string;
        position: number;
        tags: unknown; // TODO
        unicode_emoji: null; // TODO
      })[];

      stage_instances: unknown[]; // TODO
      stickers: unknown[]; // TODO
      threads: unknown[]; // TODO
      version: number;
    })[];

    merged_members: unknown[]; // TODO (maybe)

    private_channels: ({
      type: 1;
      flags: number;
      id: string;
      is_spam: boolean;
      last_message_id: string;
      /** date */
      last_pin_timestamp: string;
      recipient_ids: string[];
    })[];

    read_state: {
      entries: ({
        mention_count: number;
        last_pin_timestamp: string;
        last_message_id: string;
        id: string;
      })[];
      partial: boolean;
      version: number;
    };

    relationships: ({
      id: string; // snowflake.
      /** custom name we can give to the friend. */
      nickname: string | null;
      type: 1;
      user_id: string;
    })[];

    resume_gateway_url: string;
    session_id: string;
    session_type: "normal";

    /** active sessions on user's account */
    sessions: unknown[]; // TODO

    tutorial: null; // TODO

    user: {
      verified: boolean;
      username: string;
      purchased_flags: number;
      premium_type: number;
      premium: boolean;
      phone: string | null;
      nsfw_allowed: boolean;
      mobile: boolean;
      mfa_enabled: boolean;
      id: string;
      global_name: string | null;
      flags: number;
      email: string;
      display_name: string | null;
      discriminator: string;
      desktop: boolean;
      bio: string;
      banner_color: number | null;
      banner: null; // TODO
      avatar_decoration: null; // TODO
      avatar: string | null;
      accent_color: number | null;
    };

    user_settings_proto: string;
    analytics_token: string;
    api_code_version: number;
    auth_session_id_hash: string;

    country_code: string;
    friend_suggestion_count: number;

    personalization: {
      consented: boolean;
    };

    users: ({
      avatar: string | null;
      avatar_decoration: null; // TODO
      discriminator: string;
      display_name: string | null;
      global_name: string | null;
      id: string;
      public_flags: number;
      username: string;
    })[];
  };
}

export const handleDispatchGatewayMessage = (message: OpDispatch) => {
  switch (message.t) {
  case "READY":
    setUserStore(prev => ({
      token: prev.token as string,
      ready: true,

      users: message.d.users,
      guilds: message.d.guilds,
      private_channels: message.d.private_channels,
      relationships: message.d.relationships,
      user: message.d.user
    }));
  }
};
