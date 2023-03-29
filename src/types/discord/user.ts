import type { LocalesIdentifier } from "@/locales";

export interface User {
  /** the user's id */
  id: string; // snowflake
  /** the user's username, not unique across the platform */
  username: string;
  /** the user's 4-digit discord-tag */
  discriminator: string;
  /** the user's [avatar hash](https://discord.com/developers/docs/reference#image-formatting) */
  avatar: string | null;
  /** whether the user belongs to an OAuth2 application */
  bot?: boolean;
  /** whether the user is an Official Discord System user (part of the urgent message system) */
  system?: boolean;
  /** whether the user has two factor enabled on their account */
  mfa_enabled?: boolean;
  /** the user's [banner hash](https://discord.com/developers/docs/reference#image-formatting) */
  banner?: string | null;
  /** the user's banner color encoded as an integer representation of hexadecimal color code */
  accent_color?: number | null;
  /** the user's chosen [language option](https://discord.com/developers/docs/reference#locales) */
  locale?: LocalesIdentifier;
  /** Whether the email on this account has been verified */
  verified?: boolean;
  /** The user's email */
  email?: string | null;
  /** The flags on a user's account */
  flags?: number;
  /** The type of Nitro subscription on a user's account */
  premium_type?: number;
  /** The public flags on a user's account */
  public_flags?: number;
}
