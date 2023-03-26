import type { OpCode } from "./types";
import { OpCodes } from "./types";

/**
 * Here, we use version 10 of their API, with JSON encoding.
 * TODO: Compress the data.
 */
const DISCORD_WS_URL = "wss://gateway.discord.gg/?v=10&encoding=json";

import { userStore } from "@/stores/user";

class DiscordClientWS {
  token: string;
  connection: WebSocket;

  constructor (token?: string) {
    const client_token = token || userStore.token;
    if (!client_token) throw new Error("`token` is undefined! Check if you passed a `token` argument or if the `user` store has been initialized.");

    this.token = client_token;

    this.connection = new WebSocket(DISCORD_WS_URL);
    this.connection.addEventListener("open", () => {
      this.sendJSON({
        op: 2,
        d: {
          token: this.token,
          capabilities: 4093,
          properties: {
            os: "Windows", // TODO
            browser: "Chrome", // TODO
            device: "",
            system_locale: navigator.language,
            browser_user_agent: navigator.userAgent,
            browser_version: "109.0.0.0", // TODO
            os_version: "",
            referrer: "",
            referring_domain: "",
            referrer_current: "",
            referring_domain_current: "",
            release_channel: "stable", // TODO
            client_build_number: 169617, // TODO
            client_event_source: null
          },
          presence: {
            status: "unknown",
            since: 0,
            activities: [],
            afk: false
          },
          compress: false,
          client_state: {
            guild_versions: {},
            highest_last_message_id: "0",
            read_state_version: 0,
            user_guild_settings_version: -1,
            user_settings_version: -1,
            private_channels_version: "0",
            api_code_version: 0
          }
        }
      });
    });

    this.connection.addEventListener("message", (message) => this.handleGatewayMessage(message.data));
  }

  sendJSON <T>(message: T) {
    this.connection.send(JSON.stringify(message));
  }

  async handleGatewayMessage (message: OpCode) {
    switch (message.op) {
    case OpCodes.Hello:
      console.log(message.d.heartbeat_interval);
      break;
    }
  }
}

export default DiscordClientWS;
