import type { DMChannel, GroupDMChannel, GuildCategoryChannel, GuildTextChannel, GuildVoiceChannel } from "@/types/discord/channel";
import type { Message } from "@/types/discord/message";

export interface CacheUser {
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
}


export type CacheDMChannel = (DMChannel | GroupDMChannel) & { messages: Message[] }
export type CacheGuildChannel = (GuildVoiceChannel | GuildTextChannel | GuildCategoryChannel) & { messages: Message[] }
