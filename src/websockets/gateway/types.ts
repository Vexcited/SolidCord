import type { OpDispatchReady } from "./handlers/dispatch";

export enum OpCodes {
  Dispatch = 0,
  Heartbeat = 1,
  Hello = 10,
  Ack = 11
}

export interface OpHearbeat {
  op: OpCodes.Heartbeat;
  /** The inner d key is the last sequence number `s` received by the client. */
  d: number | null;
}

/** Received immediately after connecting to gateway. */
export interface OpHello {
  op: OpCodes.Hello;
  t: null;
  s: null;
  d: {
    /** After evey `heartbeat_interval`ms, we should send
     * an OpCode = 1 to the gateway and they should respond
     * us with `OpAck`.
     */
    heartbeat_interval: number;
  };
}

export interface OpAck {
  op: OpCodes.Ack;
}

export type OpDispatch = (
  | OpDispatchReady
);

export type OpCode = (
  | OpDispatch
  | OpHearbeat
  | OpHello
  | OpAck
);
