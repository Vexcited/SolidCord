import type { OpDispatch } from "../types";
import { setUserStore } from "@/stores/user";

export const handleDispatchGatewayMessage = (message: OpDispatch) => {
  switch (message.t) {
  case "READY":
    setUserStore(prev => ({
      token: prev.token as string,
      ready: true,

      users: message.d.users,
      guilds: message.d.guilds,
      private_channels: message.d.private_channels,
      relationships: message.d.relationships,
      user: message.d.user
    }));
  }
};
