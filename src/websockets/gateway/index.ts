import type { OpCode, OpHearbeat } from "./types";
import { OpCodes } from "./types";

import { handleDispatchGatewayMessage } from "./handlers/dispatch";

/**
 * Here, we use version 10 of their API, with JSON encoding.
 * TODO: Compress the data.
 */
const DISCORD_WS_URL = "wss://gateway.discord.gg/?v=10&encoding=json";

import { userStore } from "@/stores/user";

class DiscordClientWS {
  private token: string;
  public connection: WebSocket;

  private heartbeat_interval_ms?: number;
  private heartbeat_interval?: number;

  constructor (token?: string) {
    const client_token = token || userStore.token;
    if (!client_token) throw new Error("`token` is undefined! Check if you passed a `token` argument or if the `user` store has been initialized.");

    this.token = client_token;
    console.info("[gateway] opening new connection.");

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

    this.connection.addEventListener("message", this.handleGatewayMessage);
  }

  public destroy = () => {
    this.stopHeartbeatInterval();
    this.connection.close();

    console.info("[gateway] closed connection.");
  };

  private sendJSON = <T>(message: T) => {
    console.info("[websockets/gateway] sending message to gateway.", message);
    this.connection.send(JSON.stringify(message));
  };

  private handleGatewayMessage = async (event: MessageEvent<string>) => {
    const message_raw = event.data;
    // Remember we use JSON encoding, for now.
    const message = JSON.parse(message_raw) as OpCode;

    switch (message.op) {
    case OpCodes.Hello:
      this.heartbeat_interval_ms = message.d.heartbeat_interval;
      this.startHeartbeatInterval();
      break;
    case OpCodes.Dispatch:
      handleDispatchGatewayMessage(message);
      break;
    case OpCodes.Ack:
      console.info("[websockets/gateway] server received heartbeat - we got `ack`.");
      break;
    default:
      console.log("unknown message from gateway", message);
      break;
    }
  };

  private startHeartbeatInterval = () => {
    if (typeof this.heartbeat_interval_ms === "undefined") return;
    console.info(`[websockets/gateway] starting \`OpHeartbeat\` interval (\`heartbeat_interval_ms\` -> ${this.heartbeat_interval_ms})`);

    this.heartbeat_interval = setInterval(() => this.sendJSON<OpHearbeat>({
      op: OpCodes.Heartbeat,
      d: null // TODO: Handle sequence number.
    }), this.heartbeat_interval_ms);
  };

  private stopHeartbeatInterval = () => {
    if (this.heartbeat_interval)
      clearInterval(this.heartbeat_interval);
  };
}

export default DiscordClientWS;
