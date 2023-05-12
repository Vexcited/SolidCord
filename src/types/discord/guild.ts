/** <https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level> */
export enum GuildMessageNotificationLevel {
  /** members will receive notifications for all messages by default  */
  ALL_MESSAGES = 0,
  /** members will receive notifications only for messages that `@mention` them by default */
  ONLY_MENTIONS = 1
}

/** <https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level> */
export enum GuildExplicitContentFilterLevel {
  /** media content will not be scanned */
  DISABLED = 0,
  /** media content sent by members without roles will be scanned */
  MEMBERS_WITHOUT_ROLES = 1,
  /** media content sent by all members will be scanned */
  ALL_MEMBERS = 2
}

/** <https://discord.com/developers/docs/resources/guild#guild-object-mfa-level> */
export enum GuildMfaLevel {
  /** Guild has no MFA/2FA requirement for moderation actions. */
  NONE = 0,
  /** Guild has a 2FA requirement for moderation actions. */
  ELEVATED = 1
}

/** <https://discord.com/developers/docs/resources/guild#guild-object-verification-level> */
export enum GuildVerificationLevel {
  /** unrestricted */
  NONE = 0,
  /** must have verified email on account */
  LOW = 1,
  /** must be registered on Discord for longer than 5 minutes */
  MEDIUM = 2,
  /** must be a member of the server for longer than 10 minutes */
  HIGH = 3,
  /** must have a verified phone number */
  VERY_HIGH = 4
}

/** <https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level> */
export enum GuildNsfwLevel {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3
}

/** <https://discord.com/developers/docs/resources/guild#guild-object-premium-tier> */
export enum GuildPremiumTier {
  /** guild has not unlocked any Server Boost perks */
  NONE = 0,
  /** guild has unlocked Server Boost level 1 perks */
  TIER_1 = 1,
  /** guild has unlocked Server Boost level 2 perks */
  TIER_2 = 2,
  /** guild has unlocked Server Boost level 3 perks */
  TIER_3 = 3
}

/** <https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags> */
export enum GuildSystemChannelFlags {
  /** Suppress member join notifications */
  SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
  /** Suppress server boost notifications */
  SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
  /** Suppress server setup tips */
  SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
  /** Hide member join sticker reply buttons */
  SUPPRESS_JOIN_NOTIFICATION_REPLIES = 1 << 3,
  /** Suppress role subscription purchase and renewal notifications */
  SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS = 1 << 4,
  /** Hide role subscription sticker reply buttons */
  SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES = 1  << 5
}

/** <https://discord.com/developers/docs/resources/guild#guild-object-guild-features> */
export enum GuildFeatures {
  /** Guild has access to set an animated guild banner image. */
  ANIMATED_BANNER = "ANIMATED_BANNER",
  /** Guild has access to set an animated guild icon. */
  ANIMATED_ICON = "ANIMATED_ICON",
  /** Guild is using the [old permissions configuration behavior](https://discord.com/developers/docs/change-log#upcoming-application-command-permission-changes). */
  APPLICATION_COMMAND_PERMISSIONS_V2 = "APPLICATION_COMMAND_PERMISSIONS_V2",
  /** Guild has set up auto moderation rules. */
  AUTO_MODERATION = "AUTO_MODERATION",
  /** Guild has access to set a guild banner image. */
  BANNER = "BANNER",
  /** Guild can enable welcome screen, Membership Screening, stage channels and discovery, and receives community updates. */
  COMMUNITY = "COMMUNITY",
  /** Guild has enabled monetization. */
  CREATOR_MONETIZABLE_PROVISIONAL = "CREATOR_MONETIZABLE_PROVISIONAL",
  /** Guild has enabled the role subscription promo page. */
  CREATOR_STORE_PAGE = "CREATOR_STORE_PAGE",
  /** Guild has been set as a support server on the App Directory. */
  DEVELOPER_SUPPORT_SERVER = "DEVELOPER_SUPPORT_SERVER",
  /** Guild is able to be discovered in the directory. */
  DISCOVERABLE = "DISCOVERABLE",
  /** Guild is able to be featured in the directory. */
  FEATURABLE = "FEATURABLE",
  /** Guild has paused invites, preventing new users from joining. */
  INVITES_DISABLED = "INVITES_DISABLED",
  /** Guild has access to set an invite splash background. */
  INVITE_SPLASH = "INVITE_SPLASH",
  /** Guild has enabled Membership Screening. */
  MEMBER_VERIFICATION_GATE_ENABLED = "MEMBER_VERIFICATION_GATE_ENABLED",
  /** Guild has increased custom sticker slots. */
  MORE_STICKERS = "MORE_STICKERS",
  /** Guild has access to create announcement channels. */
  NEWS = "NEWS",
  /** Guild is partnered. */
  PARTNERED = "PARTNERED",
  /** Guild can be previewed before joining via Membership Screening or the directory. */
  PREVIEW_ENABLED = "PREVIEW_ENABLED",
  /** Guild is able to set role icons. */
  ROLE_ICONS = "ROLE_ICONS",
  /** Guild has role subscriptions that can be purchased. */
  ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE = "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
  /** Guild has enabled role subscriptions. */
  ROLE_SUBSCRIPTIONS_ENABLED = "ROLE_SUBSCRIPTIONS_ENABLED",
  /** Guild has enabled ticketed events. */
  TICKETED_EVENTS_ENABLED = "TICKETED_EVENTS_ENABLED",
  /** Guild has access to set a vanity URL. */
  VANITY_URL = "VANITY_URL",
  /** Guild is verified. */
  VERIFIED = "VERIFIED",
  /** Guild has access to set 384kbps bitrate in voice (previously VIP voice servers). */
  VIP_REGIONS = "VIP_REGIONS",
  /** Guild has enabled the welcome screen. */
  WELCOME_SCREEN_ENABLED = "WELCOME_SCREEN_ENABLED",
}

export enum GuildMutableFeatures {
  /** Requires "Administrator" permissions. Enables Community Features in the guild */
  COMMUNITY = GuildFeatures.COMMUNITY,
  /** Requires "Manage Guild" permissions. Pauses all invites/access to the server */
  INVITES_DISABLED = GuildFeatures.INVITES_DISABLED,
  /** Requires "Administrator" permissions. Enables discovery in the guild, making it publicly listed */
  DISCOVERABLE = GuildFeatures.DISCOVERABLE
}
