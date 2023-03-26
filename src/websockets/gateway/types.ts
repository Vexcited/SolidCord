export enum OpCodes {
  Hello = 10,
  Ack = 11
}

/**
 * Sent immediately after connecting, contains the heartbeat_interval to use.
 */
export interface OpHello {
  op: OpCodes.Hello,
  t: null,
  s: null,
  d: {
    /** After evey `heartbeat_interval`ms, we should send
     * an OpCode = 1 to the gateway and they should respond
     * us with OpCode = 11
     */
    heartbeat_interval: number;
  }
}

export interface OpAck {
  op: OpCodes.Ack
}

export type OpCode =
  | OpHello
  | OpAck
;
