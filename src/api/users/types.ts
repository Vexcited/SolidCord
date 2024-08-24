export interface DiscordMeResponse {
  id: string;

  email: string;
  username: string;
  discriminator: string;

  avatar: string | null;
  avatar_decoration: string | null;

  public_flags: number;
  premium_type: number;
  flags: number;

  purchased_flags?: number;

  banner: string | null;
  banner_color: string | null;

  accent_color: number | null;

  bio: string;
  locale: string;

  phone: string | null;
  mfa_enabled: boolean;

  nsfw_allowed: boolean;
  verified: boolean;
}
