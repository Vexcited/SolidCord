import type { OpCode, OpDispatch, OpHearbeat } from "./types";
import { OpCodes } from "./types";

import caching from "@/stores/caching";

import Bowser from "bowser";

/**
 * Here, we use version 10 of their API, with JSON encoding.
 * TODO: Compress using `zlib-stream`.
 * TODO: Encode using `etf`.
 */
const DISCORD_WS_URL = "wss://gateway.discord.gg/?v=10&encoding=json";

class DiscordClientWS {
  private token: string;
  private account_id: string;
  private setAccountCache: ReturnType<typeof caching["useSetterOf"]>;

  public connection: WebSocket;

  private heartbeat_interval_ms?: number;
  private heartbeat_interval?: number;

  /** Sequence used for sessions and heartbeats. */
  private sequence: number | null = null;

  constructor (token: string, account_id: string) {
    this.token = token;
    this.account_id = account_id;
    this.setAccountCache = caching.useSetterOf(this.account_id);

    console.info("[websockets/gateway] opening new connection for account", this.account_id);

    this.connection = new WebSocket(DISCORD_WS_URL);
    this.connection.addEventListener("open", this.handleGatewayOpen);
    this.connection.addEventListener("message", this.handleGatewayMessage);
  }

  public destroy = () => {
    this.stopHeartbeatInterval();
    this.connection.close();

    console.info("[websockets/gateway] closed connection.");
  };

  private sendJSON = <T>(message: T) => {
    console.info("[websockets/gateway] sending message to gateway.", message);
    this.connection.send(JSON.stringify(message));
  };

  private handleGatewayOpen = () => {
    console.info("[gateway] opened connection for account", this.account_id);

    // Get informations on current browser to pass them in WS.
    const browser_parser = Bowser.parse(window.navigator.userAgent);

    this.sendJSON({
      op: OpCodes.Identify,
      d: {
        token: this.token,
        capabilities: 8189, // Where those numbers come from?
        properties: {
          os: browser_parser.os.name,
          browser: browser_parser.browser.name,
          device: "",
          system_locale: window.navigator.language,
          browser_user_agent: window.navigator.userAgent,
          browser_version: browser_parser.browser.version,
          os_version: browser_parser.os.versionName,
          referrer: "",
          referring_domain: "",
          referrer_current: "",
          referring_domain_current: "",
          release_channel: "stable",
          client_build_number: 195078, // Find a way to get this? Anyway, last updated, 03/05/2023 - in DD/MM/YYYY format.
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
  };

  private handleGatewayMessage = async (event: MessageEvent<string>) => {
    const message_raw = event.data;
    // Remember we use JSON encoding, for now.
    const message = JSON.parse(message_raw) as OpCode;

    if ("s" in message) {
      this.sequence = message.s;
    }

    switch (message.op) {
    case OpCodes.Hello:
      this.heartbeat_interval_ms = message.d.heartbeat_interval;
      this.startHeartbeatInterval();
      break;
    case OpCodes.Dispatch:
      this.handleDispatchGatewayMessage(message);
      break;
    case OpCodes.Ack:
      console.info("[websockets/gateway] server received heartbeat - we got `ack`.");
      break;
    default:
      console.warn("[websockets/gateway] unknown message from gateway", message);
      break;
    }
  };

  private startHeartbeatInterval = () => {
    if (typeof this.heartbeat_interval_ms === "undefined") return;
    console.info(`[websockets/gateway] starting \`OpHeartbeat\` interval (\`heartbeat_interval_ms\` -> ${this.heartbeat_interval_ms})`);

    this.heartbeat_interval = setInterval(() => this.sendJSON<OpHearbeat>({
      op: OpCodes.Heartbeat,
      d: this.sequence
    }), this.heartbeat_interval_ms);
  };

  private stopHeartbeatInterval = () => {
    if (this.heartbeat_interval)
      clearInterval(this.heartbeat_interval);
  };

  private handleDispatchGatewayMessage = (message: OpDispatch) => {
    switch (message.t) {
    case "READY":
      this.setAccountCache({
        token: this.token,
        ready: true,

        gateway: {
          users: message.d.users,
          guilds: message.d.guilds,
          private_channels: message.d.private_channels,
          relationships: message.d.relationships,
          user: message.d.user
        }
      });
      break;

    default:
      console.info("[websockets/gateway] unknown dispatch", message);
    }
  };
}

export default DiscordClientWS;
