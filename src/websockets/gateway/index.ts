import type { SetStoreFunction } from "solid-js/store";
import type { CacheDMChannel, CacheGuildChannel } from "@/types/cache";
import type { OpCode, OpDispatch, OpHeartbeat } from "./types";
import { OpCodes } from "./types";

import caching, { CacheStoreReady } from "@/stores/caching";
import app from "@/stores/app";

import { sendNativeNotification } from "@/utils/native/notify";
import { UserAttentionType, appWindow } from "@tauri-apps/api/window";

import { listen, emit } from "@tauri-apps/api/event";
import { getCacheInStorage, setCacheInStorage } from "@/utils/storage/caching";

import { buildClientPropertiesObject } from "@/utils/api/client-properties";

/**
 * Here, we use version 10 of their API, with JSON encoding.
 * TODO: Compress using `zlib-stream`.
 * TODO: Encode using `etf`.
 */
// const DISCORD_WS_URL = "wss://gateway.discord.gg/?v=10&encoding=json";



class DiscordClientWS {
  private token: string;
  private account_id: string;
  private setAccountCache: SetStoreFunction<CacheStoreReady>;

  // public connection: WebSocket;

  private heartbeat_interval_ms?: number;
  private heartbeat_interval?: number;

  /** Sequence used for sessions and heartbeats. */
  private sequence: number | null = null;

  constructor (token: string, account_id: string) {
    this.token = token;
    this.account_id = account_id;
    this.setAccountCache = caching.useSetterOf<CacheStoreReady>(this.account_id);

    console.info("[websockets/gateway] opening new connection for account", this.account_id);

    // When spawning a new connection,
    // we get gateway data from cache and show it until we get
    // new data from gateway to update the store.
    getCacheInStorage<CacheStoreReady["gateway"]>(this.account_id, "__gateway")
      .then(gateway_data => {
        if (!gateway_data) return;
        const channels: CacheStoreReady["channels"] = [];

        // Append every DM channels.
        for (const channel_raw of gateway_data.private_channels) {
          const channel = channel_raw as CacheDMChannel;
          channel.messages = {};

          channels.push(channel);
        }

        // Append every guilds' channels.
        for (const guild of gateway_data.guilds) {
          for (const channel_raw of guild.channels) {
            const channel = channel_raw as CacheGuildChannel;
            channel.messages = {};

            channels.push(channel);
          }
        }

        this.setAccountCache({
          token: this.token,
          ready: true,

          channels,
          requests: {},

          gateway: gateway_data
        } as CacheStoreReady);
      });

    listen(`gateway/${this.account_id}`, (event) => {
      if (typeof event.payload !== "string") return;
      this.handleGatewayMessage(event.payload);
    });

    emit("gateway", this.account_id);
  }

  public destroy = async () => {
    this.stopHeartbeatInterval();
    await emit(`gateway/${this.account_id}`, "destroy");

    console.info("[websockets/gateway] closed connection.");
  };

  private sendJSON = async <T>(message: T) => {
    console.info("[websockets/gateway] sending message to gateway.", message);
    await emit(`gateway/${this.account_id}`, message);
  };

  private handleGatewayOpen = async () => {
    console.info("[gateway] opened connection for account", this.account_id);

    this.sendJSON({
      op: OpCodes.Identify,
      d: {
        token: this.token,
        capabilities: 8189, // Where those numbers come from?
        properties: await buildClientPropertiesObject(),
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

  private handleGatewayMessage = async (message_raw: string) => {
    // Remember we use JSON encoding, for now.
    const message = JSON.parse(message_raw) as OpCode;

    if ("s" in message) {
      this.sequence = message.s;
    }

    switch (message.op) {
    case OpCodes.Hello:
      this.heartbeat_interval_ms = message.d.heartbeat_interval;
      this.startHeartbeatInterval();
      this.handleGatewayOpen();
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

    this.heartbeat_interval = setInterval(() => this.sendJSON<OpHeartbeat>({
      op: OpCodes.Heartbeat,
      d: this.sequence
    }), this.heartbeat_interval_ms);
  };

  private stopHeartbeatInterval = () => {
    if (this.heartbeat_interval)
      clearInterval(this.heartbeat_interval);
  };

  private handleDispatchGatewayMessage = async (message: OpDispatch) => {
    switch (message.t) {
    case "READY": {
      const channels: CacheStoreReady["channels"] = [];

      // Append every DM channels.
      for (const channel_raw of message.d.private_channels) {
        const channel = channel_raw as CacheDMChannel;
        channel.messages = {};

        channels.push(channel);
      }

      // Append every guilds' channels.
      for (const guild of message.d.guilds) {
        for (const channel_raw of guild.channels) {
          const channel = channel_raw as CacheGuildChannel;
          channel.messages = {};

          channels.push(channel);
        }
      }

      const gateway_data: CacheStoreReady["gateway"] = {
        users: message.d.users,
        guilds: message.d.guilds,
        private_channels: message.d.private_channels,
        relationships: message.d.relationships,
        user: message.d.user
      };

      await setCacheInStorage<CacheStoreReady["gateway"]>(this.account_id, "__gateway", gateway_data);

      this.setAccountCache({
        token: this.token,
        ready: true,

        channels,
        requests: {},

        gateway: gateway_data
      } as CacheStoreReady);
      break;
    }

    case "MESSAGE_CREATE": {
      const { channel_id } = message.d;
      this.setAccountCache("channels", channel => channel.id === channel_id, "messages", prev => ({ ...prev, [message.d.id]: message.d }));

      if (!app.isFocused()) {
        await appWindow.requestUserAttention(UserAttentionType.Critical);
        await sendNativeNotification({
          title: message.d.author.username,
          body: message.d.content
        });
      }

      break;
    }

    default:
      console.info("[websockets/gateway] unknown dispatch", message);
    }
  };
}

export default DiscordClientWS;
