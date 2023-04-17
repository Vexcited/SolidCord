const IMAGE_BASE_URL = "https://cdn.discordapp.com/";

export const getUserAvatarURL = (user_id: string, avatar_hash: string, options: Partial<{
  format: ".png" | ".jpg" | ".jpeg" | ".webp" | ".gif";
  /** Will override `format` option's value to `.gif` format is available. */
  useGifWhenAvailable: boolean;
  /** Between 16 and 4096. */
  size: number;
}> = {
  format: ".webp",
  useGifWhenAvailable: true,
  size: 4096
}) => {
  let format = options.format ?? ".webp";
  if (options.useGifWhenAvailable && avatar_hash.startsWith("a_")) {
    format = ".gif";
  }

  const uri = IMAGE_BASE_URL + `avatars/${user_id}/${avatar_hash}${format}`;
  return uri + `?size=${options.size ?? 4096}`;
};

export const getGuildIconURL = (guild_id: string, icon_hash: string, options: Partial<{
  format: ".png" | ".jpg" | ".jpeg" | ".webp" | ".gif";
  /** Will override `format` option's value to `.gif` format is available. */
  useGifWhenAvailable: boolean;
  /** Between 16 and 4096. */
  size: number;
}> = {
  format: ".webp",
  useGifWhenAvailable: true,
  size: 4096
}) => {
  let format = options.format ?? ".webp";
  if (options.useGifWhenAvailable && icon_hash.startsWith("a_")) {
    format = ".gif";
  }

  const uri = IMAGE_BASE_URL + `icons/${guild_id}/${icon_hash}${format}`;
  return uri + `?size=${options.size ?? 4096}`;
};

export const getChannelIconURL = (channel_id: string, icon_hash: string, options: Partial<{
  format: ".png" | ".jpg" | ".jpeg" | ".webp";
  /** Between 16 and 4096. */
  size: number;
}> = {
  format: ".webp",
  size: 4096
}) => {
  const format = options.format ?? ".webp";

  const uri = IMAGE_BASE_URL + `channel-icons/${channel_id}/${icon_hash}${format}`;
  return uri + `?size=${options.size ?? 4096}`;
};
