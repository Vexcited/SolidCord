import { LocalesIdentifier } from "@/locales";
import { GuildCategoryChannel, DMChannel, GroupDMChannel, GuildTextChannel, GuildVoiceChannel } from "@/types/discord/channel";
import { GuildExplicitContentFilterLevel, GuildFeatures, GuildMessageNotificationLevel, GuildMfaLevel, GuildNsfwLevel, GuildPremiumTier, GuildSystemChannelFlags, GuildVerificationLevel } from "@/types/discord/guild";
import { Message } from "@/types/discord/message";
import { User } from "@/types/discord/user";

export enum OpCodes {
  Dispatch = 0,
  Heartbeat = 1,
  Identify = 2,
  Hello = 10,
  Ack = 11
}

export interface OpHeartbeat {
  op: OpCodes.Heartbeat;
  /** The inner d key is the last sequence number `s` received by the client. */
  d: number | null;
}

/** Received immediately after connecting to gateway. */
export interface OpHello {
  op: OpCodes.Hello;
  t: null;
  s: null;
  d: {
    /** After every `heartbeat_interval`ms, we should send
     * an OpCode = 1 to the gateway and they should respond
     * us with `OpAck`.
     */
    heartbeat_interval: number;
  };
}

export interface OpAck {
  op: OpCodes.Ack;
}

export type OpDispatch = (
  | OpDispatchReady
  | OpDispatchReadySupplemental
  | OpDispatchRelationshipUpdate
  | OpDispatchPresenceUpdate
  | OpDispatchMessageCreate
);

export type OpCode = (
  | OpDispatch
  | OpHeartbeat
  | OpHello
  | OpAck
);

export interface OpDispatchReadyRelationship {
  type: 1;
  id: string;
  /** "Friend name" we can give to the user. */
  nickname: string | null;
  user_id: string;
}

export interface OpDispatchReady {
  t: "READY";
  op: OpCodes.Dispatch;
  s: number;

  d: {
    v: number;
    guilds: ({
      application_command_counts: Record<number, number>;
      channels: (GuildTextChannel | GuildVoiceChannel | GuildCategoryChannel)[];

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

    private_channels: (
      | DMChannel
      | GroupDMChannel
    )[];

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

    relationships: OpDispatchReadyRelationship[];

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

    users: User[];
  };
}

export interface OpDispatchReadySupplemental {
  t: "READY_SUPPLEMENTAL";
  op: OpCodes.Dispatch;
  s: number;

  d: {
    merged_presences: {
      guilds: {
        user_id: string;
        status: "online";
        client_status: {
          desktop: "online";
        };
        activities: unknown[];
      }[][];

      friends: unknown[]; // TODO
    };

    merged_members: unknown[][];

    lazy_private_channels: [];

    guilds: {
      voice_states: unknown[]; // TODO
      id: string;
      embedded_activities: unknown[]; // TODO
    }[];

    disclose: [];
  };
}

export interface OpDispatchRelationshipUpdate {
  t: "RELATIONSHIP_UPDATE";
  op: OpCodes.Dispatch;
  s: number;

  d: {
    type: 1;
    nickname: string | null;
    id: string;
  };
}

export interface OpDispatchPresenceUpdate {
  t: "PRESENCE_UPDATE";
  s: number;
  op: OpCodes.Dispatch;

  d: {
    user: {
      id: string;
    };

    status: "online";
    guild_id: string;
    client_status: {
      desktop: "online";
    };
    activities: (
      {
        type: 0;
        timestamps: {
          start: number;
        };

        id: string;
        name: string;
        details: string;
        /** Sub-description of the activity. */
        state: string;
        session_id: string;
        flags: number;
        created_at: number;
        buttons: string[];
        assets: {
          small_text: string;
          small_image: string;
          large_text: string;
          large_image: string;
        };
        application_id: string;
      }
    )[];
  };
}

export interface OpDispatchMessageCreate {
  t: "MESSAGE_CREATE";
  s: number;
  op: OpCodes.Dispatch;
  d: Message;
}
